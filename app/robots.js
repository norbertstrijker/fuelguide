export default function robots() {
  return {
    rules: { userAgent: '*', disallow: '/' },
    sitemap: 'https://fuelguide.app/sitemap.xml',
  }
}
