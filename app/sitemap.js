import { supabaseServer } from '@/lib/supabase-server'
import { CATEGORIES } from '@/lib/categories'

const BASE_URL = 'https://fuelguide.app'
const LOCALES = ['nl', 'de', 'en']

export default async function sitemap() {
  const { data: machines } = await supabaseServer
    .from('machines')
    .select('slug, categorie')

  const entries = []

  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE_URL}/${l}`])
        ),
      },
    })
  }

  for (const locale of LOCALES) {
    for (const [key, cat] of Object.entries(CATEGORIES)) {
      entries.push({
        url: `${BASE_URL}/${locale}/${cat.slugs[locale]}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE_URL}/${l}/${cat.slugs[l]}`])
          ),
        },
      })
    }
  }

  if (machines) {
    for (const machine of machines) {
      if (!machine.slug || !CATEGORIES[machine.categorie]) continue
      for (const locale of LOCALES) {
        const catSlug = CATEGORIES[machine.categorie].slugs[locale]
        entries.push({
          url: `${BASE_URL}/${locale}/${catSlug}/${machine.slug}`,
          lastModified: new Date(),
          alternates: {
            languages: Object.fromEntries(
              LOCALES.map((l) => [
                l,
                `${BASE_URL}/${l}/${CATEGORIES[machine.categorie].slugs[l]}/${machine.slug}`,
              ])
            ),
          },
        })
      }
    }
  }

  return entries
}
