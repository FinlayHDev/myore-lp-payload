import type { GlobalConfig } from 'payload'

import { CONTENT_DEFAULTS as D } from '../lib/content-defaults'

export const SiteContent: GlobalConfig = {
  slug: 'site-content',
  label: 'Site content',
  admin: { group: 'Content', description: 'Text and share image for the landing page. Changes go live immediately.' },
  access: { read: () => true, update: ({ req: { user } }) => Boolean(user) },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'hero', type: 'group', label: false, fields: [
              { name: 'eyebrow', type: 'text', defaultValue: D.hero.eyebrow },
              { name: 'headlineLine1', type: 'text', label: 'Headline, line 1', defaultValue: D.hero.headlineLine1 },
              { name: 'headlineLine2', type: 'text', label: 'Headline, line 2', defaultValue: D.hero.headlineLine2 },
              { name: 'intro', type: 'textarea', defaultValue: D.hero.intro },
            ] },
          ],
        },
        {
          label: 'Waitlist form',
          fields: [
            { name: 'waitlist', type: 'group', label: false, fields: [
              { name: 'placeholder', type: 'text', defaultValue: D.waitlist.placeholder },
              { name: 'buttonLabel', type: 'text', defaultValue: D.waitlist.buttonLabel },
              { name: 'helper', type: 'text', label: 'Helper text under the form', defaultValue: D.waitlist.helper },
              { name: 'successTitle', type: 'text', label: 'Message after joining', defaultValue: D.waitlist.successTitle },
            ] },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            {
              name: 'faqs',
              type: 'array',
              label: 'Questions',
              defaultValue: D.faqs.map((f) => ({ ...f })),
              admin: { initCollapsed: true },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'Final call to action',
          fields: [
            { name: 'finalCta', type: 'group', label: false, fields: [
              { name: 'line1', type: 'text', label: 'Heading, line 1', defaultValue: D.finalCta.line1 },
              { name: 'line2', type: 'text', label: 'Heading, line 2', defaultValue: D.finalCta.line2 },
              { name: 'body', type: 'textarea', defaultValue: D.finalCta.body },
            ] },
          ],
        },
        {
          label: 'Search & sharing',
          fields: [
            { name: 'seo', type: 'group', label: false, fields: [
              { name: 'title', type: 'text', label: 'Page title', defaultValue: D.seo.title },
              { name: 'description', type: 'textarea', label: 'Search description', defaultValue: D.seo.description },
              { name: 'shareTitle', type: 'text', label: 'Title when shared', defaultValue: D.seo.shareTitle },
              { name: 'shareDescription', type: 'textarea', label: 'Description when shared', defaultValue: D.seo.shareDescription },
              {
                name: 'shareImage',
                type: 'upload',
                relationTo: 'media',
                label: 'Share image',
                admin: { description: 'Shown when the link is shared. Leave empty to use the default banner (1600×890 works best).' },
              },
            ] },
          ],
        },
      ],
    },
  ],
}
