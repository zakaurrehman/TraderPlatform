import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.tradewithshaffy.com'
  const lastMod = '2026-05-15'

  return [
    { url: `${base}/`,        lastModified: lastMod, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/about`,   lastModified: lastMod, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/signals`, lastModified: lastMod, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/pricing`, lastModified: lastMod, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/reviews`, lastModified: lastMod, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/faq`,     lastModified: lastMod, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
