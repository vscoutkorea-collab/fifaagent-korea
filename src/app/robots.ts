import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/portal/', '/api/'],
      },
      {
        userAgent: 'Yeti',
        allow: '/',
        disallow: ['/portal/', '/api/'],
      },
    ],
    sitemap: 'https://www.footballeye.co.kr/sitemap.xml',
  }
}
