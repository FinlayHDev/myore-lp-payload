import type { CollectionConfig, Endpoint } from 'payload'

import { isRateLimited } from '../lib/rate-limit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// POST /api/waitlist/signup  { email, source?, company? }
// The collection itself is closed to the public; this is the only way in.
const signup: Endpoint = {
  path: '/signup',
  method: 'post',
  handler: async (req) => {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(ip)) {
      return Response.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 })
    }

    let body: { email?: unknown; source?: unknown; company?: unknown }
    try {
      body = (await req.json?.()) ?? {}
    } catch {
      return Response.json({ error: 'Invalid request.' }, { status: 400 })
    }

    // Honeypot: real visitors never fill this hidden field in.
    if (typeof body.company === 'string' && body.company.trim() !== '') {
      return Response.json({ ok: true })
    }

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (!EMAIL_RE.test(email) || email.length > 255) {
      return Response.json({ error: "That email doesn't look quite right." }, { status: 400 })
    }
    const source = body.source === 'hero' || body.source === 'footer' ? body.source : 'other'

    try {
      const existing = await req.payload.find({
        collection: 'waitlist',
        where: { email: { equals: email } },
        limit: 1,
        depth: 0,
        pagination: false,
      })
      // Joining twice looks the same as joining once, so the form can't be used
      // to check whether an address is already on the list.
      if (existing.docs.length === 0) {
        await req.payload.create({ collection: 'waitlist', data: { email, source }, req })
      }
    } catch (err) {
      req.payload.logger.error({ err }, 'Waitlist signup failed')
      return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
    }
    return Response.json({ ok: true })
  },
}

const csvCell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`

// GET /api/waitlist/export — CSV of every signup, admins only.
const exportCsv: Endpoint = {
  path: '/export',
  method: 'get',
  handler: async (req) => {
    if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const rows: string[] = [['email', 'source', 'joined'].join(',')]
    let page = 1
    for (;;) {
      const res = await req.payload.find({
        collection: 'waitlist',
        limit: 500,
        page,
        depth: 0,
        sort: 'createdAt',
        req,
        overrideAccess: false,
      })
      for (const d of res.docs) rows.push([csvCell(d.email), csvCell(d.source), csvCell(d.createdAt)].join(','))
      if (!res.hasNextPage) break
      page += 1
    }
    const stamp = new Date().toISOString().slice(0, 10)
    return new Response(rows.join('\n') + '\n', {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="my-ore-waitlist-${stamp}.csv"`,
      },
    })
  },
}

export const Waitlist: CollectionConfig = {
  slug: 'waitlist',
  labels: { singular: 'Signup', plural: 'Waitlist' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'createdAt'],
    group: 'Launch',
    components: { beforeList: ['/components/admin/ExportCsv#ExportCsv'] },
  },
  access: {
    create: () => false,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  endpoints: [signup, exportCsv],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        const to = process.env.WAITLIST_NOTIFY_EMAIL
        if (operation !== 'create' || !to) return doc
        try {
          const total = await req.payload.count({ collection: 'waitlist', req })
          await req.payload.sendEmail({
            to,
            subject: `New My Ore waitlist signup: ${doc.email}`,
            text: `${doc.email} joined the waitlist (from ${doc.source}). ${total.totalDocs} signups in total.`,
          })
        } catch (err) {
          req.payload.logger.error({ err }, 'Waitlist notification email failed')
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'other',
      options: [
        { label: 'Hero form', value: 'hero' },
        { label: 'Footer form', value: 'footer' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'notes', type: 'textarea', admin: { description: 'Private notes. Never shown publicly.' } },
  ],
}
