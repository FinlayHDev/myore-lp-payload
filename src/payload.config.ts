import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Waitlist } from './collections/Waitlist'
import { SiteContent } from './globals/SiteContent'
import { migrations } from './migrations'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const smtp = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'hello@example.com',
      defaultFromName: process.env.EMAIL_FROM_NAME || 'My Ore',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || '' }
          : undefined,
      },
    })
  : undefined

export default buildConfig({
  serverURL: process.env.SERVER_URL || undefined,
  routes: { admin: '/cms' },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'app/(payload)/cms/importMap.js'),
    },
    meta: {
      titleSuffix: ' · My Ore CMS',
      icons: [{ rel: 'icon', type: 'image/png', url: '/favicon-48.png' }],
    },
    components: {
      graphics: { Logo: '/components/admin/Logo#Logo', Icon: '/components/admin/Icon#Icon' },
    },
  },
  collections: [Waitlist, Users, Media],
  globals: [SiteContent],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI || 'file:./data/payload.db' },
    prodMigrations: migrations,
  }),
  email: smtp,
  sharp,
})
