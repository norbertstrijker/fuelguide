export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: 'https://fuelguide.app/sitemap.xml',
  }
}
