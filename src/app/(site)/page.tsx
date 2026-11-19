import type { Metadata } from 'next'

import { LandingPage } from '@/components/landing/LandingPage'
import { getContent } from '@/lib/content'

// Content comes from the CMS, so render per request and edits show up straight away.
export const dynamic = 'force-dynamic'

const siteUrl = process.env.SERVER_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent()
  return {
    metadataBase: new URL(siteUrl),
    title: seo.title,
    description: seo.description,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/favicon-192.png', type: 'image/png', sizes: '192x192' },
        { url: '/favicon-48.png', type: 'image/png', sizes: '48x48' },
      ],
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      type: 'website',
      title: seo.shareTitle,
      description: seo.shareDescription,
      images: [{ url: seo.shareImage, width: 1600, height: 890, alt: 'My Ore. Raw thoughts, refined.' }],
    },
    twitter: { card: 'summary_large_image', title: seo.shareTitle, description: seo.shareDescription, images: [seo.shareImage] },
  }
}

export default async function Page() {
  const content = await getContent()
  return <LandingPage content={content} />
}
