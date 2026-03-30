import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { supabaseServer } from '@/lib/supabase-server'
import { CATEGORIES, categoryFromSlug, allCategoryKeys } from '@/lib/categories'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import MachineCard from '@/components/MachineCard'
import AdSlot from '@/components/AdSlot'

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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Breadcrumbs
        locale={locale}
        items={[{ label: categoryName, href: `/${locale}/${categorie}` }]}
      />

      <section className="mb-12">
        <span className="text-xs font-bold tracking-label uppercase text-on-surface-variant mb-2 block">
          {t('category_page.intro_' + categoryKey)}
        </span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-display leading-none">{categoryName}</h1>
      </section>

      {machines && machines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <MachineCard machine={machines[0]} locale={locale} categorySlug={categorie} featured={true} />
          </div>
          {machines.slice(1).map((machine) => (
            <div key={machine.id} className="md:col-span-4">
              <MachineCard machine={machine} locale={locale} categorySlug={categorie} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-on-surface-variant">{t('search.no_results')}</p>
      )}

      <AdSlot id="ad-slot-category" />
    </div>
  )
}
