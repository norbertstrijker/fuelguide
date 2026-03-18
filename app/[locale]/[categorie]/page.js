import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { supabaseServer } from '@/lib/supabase-server'
import { CATEGORIES, categoryFromSlug, allCategoryKeys } from '@/lib/categories'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import MachineCard from '@/components/MachineCard'
import SearchBar from '@/components/SearchBar'

const BASE_URL = 'https://fuelguide.app'

export async function generateStaticParams() {
  const params = []
  for (const locale of routing.locales) {
    for (const key of allCategoryKeys()) {
      params.push({ locale, categorie: CATEGORIES[key].slugs[locale] })
    }
  }
  return params
}

export async function generateMetadata({ params }) {
  const { locale, categorie } = await params
  const key = categoryFromSlug(categorie, locale)
  if (!key) return {}
  const t = await getTranslations({ locale })
  const name = t(`categories.${key}`)

  const languages = {}
  for (const loc of routing.locales) {
    languages[loc] = `${BASE_URL}/${loc}/${CATEGORIES[key].slugs[loc]}`
  }

  return {
    title: `${name} — FuelGuide`,
    description: t(`category_page.intro_${key}`),
    alternates: { languages },
  }
}

export default async function CategoryPage({ params }) {
  const { locale, categorie } = await params
  setRequestLocale(locale)

  const categoryKey = categoryFromSlug(categorie, locale)
  if (!categoryKey) notFound()

  const t = await getTranslations({ locale })
  const categoryName = t(`categories.${categoryKey}`)

  const { data: machines } = await supabaseServer
    .from('machines')
    .select('*')
    .eq('categorie', categoryKey)
    .order('merk', { ascending: true })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs
        locale={locale}
        items={[{ label: categoryName, href: `/${locale}/${categorie}` }]}
      />

      <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
      <p className="text-gray-600 mb-6">
        {t(`category_page.intro_${categoryKey}`)}
      </p>

      <div className="mb-6">
        <SearchBar size="compact" categoryFilter={categoryKey} />
      </div>

      {machines && machines.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {machines.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              locale={locale}
              categorySlug={categorie}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">{t('search.no_results')}</p>
      )}
    </div>
  )
}
