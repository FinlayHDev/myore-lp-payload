import config from '@payload-config'
import { getPayload } from 'payload'

import { CONTENT_DEFAULTS as D } from './content-defaults'

const text = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim() !== '' ? value : fallback

export type Content = {
  seo: { title: string; description: string; shareTitle: string; shareDescription: string; shareImage: string }
  hero: { eyebrow: string; headlineLine1: string; headlineLine2: string; intro: string }
  waitlist: { placeholder: string; buttonLabel: string; helper: string; successTitle: string }
  faqs: { question: string; answer: string }[]
  finalCta: { line1: string; line2: string; body: string }
  footer: { tagline: string }
}

// Reads the "Site content" global and fills any empty field from the defaults,
// so the page always renders, even before anyone has opened the CMS.
export async function getContent(): Promise<Content> {
  let g: Record<string, any> = {}
  try {
    const payload = await getPayload({ config })
    g = (await payload.findGlobal({ slug: 'site-content', depth: 1 })) as Record<string, any>
  } catch (err) {
    console.error('Could not load site content, using defaults', err)
  }

  const faqs = Array.isArray(g.faqs)
    ? g.faqs.filter((f: any) => f?.question && f?.answer).map((f: any) => ({ question: f.question, answer: f.answer }))
    : []
  const image = g.seo?.shareImage
  return {
    seo: {
      title: text(g.seo?.title, D.seo.title),
      description: text(g.seo?.description, D.seo.description),
      shareTitle: text(g.seo?.shareTitle, D.seo.shareTitle),
      shareDescription: text(g.seo?.shareDescription, D.seo.shareDescription),
      shareImage: image && typeof image === 'object' && image.url ? image.url : '/og-banner.jpg',
    },
    hero: {
      eyebrow: text(g.hero?.eyebrow, D.hero.eyebrow),
      headlineLine1: text(g.hero?.headlineLine1, D.hero.headlineLine1),
      headlineLine2: text(g.hero?.headlineLine2, D.hero.headlineLine2),
      intro: text(g.hero?.intro, D.hero.intro),
    },
    waitlist: {
      placeholder: text(g.waitlist?.placeholder, D.waitlist.placeholder),
      buttonLabel: text(g.waitlist?.buttonLabel, D.waitlist.buttonLabel),
      helper: text(g.waitlist?.helper, D.waitlist.helper),
      successTitle: text(g.waitlist?.successTitle, D.waitlist.successTitle),
    },
    faqs: faqs.length > 0 ? faqs : D.faqs.map((f) => ({ ...f })),
    finalCta: {
      line1: text(g.finalCta?.line1, D.finalCta.line1),
      line2: text(g.finalCta?.line2, D.finalCta.line2),
      body: text(g.finalCta?.body, D.finalCta.body),
    },
    footer: { tagline: D.footer.tagline },
  }
}
