import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { supabaseServer } from '@/lib/supabase-server'
import { categoryFromSlug, CATEGORIES } from '@/lib/categories'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import FuelAdvice from '@/components/FuelAdvice'
import GeoProductSection from '@/components/GeoProductSection'
import RelatedMachines from '@/components/RelatedMachines'
import ShareButton from '@/components/ShareButton'
import AdSlot from '@/components/AdSlot'

const BASE_URL = 'https://fuelguide.app'

export const dynamicParams = false

export async function generateStaticParams() {
  const { data: machines } = await supabaseServer
    .from('machines')
    .select('slug, categorie')

  if (!machines) return []

  const params = []
  for (const locale of routing.locales) {
    for (const machine of machines) {
      if (!machine.slug) continue
      const catSlug = CATEGORIES[machine.categorie]?.slugs[locale]
      if (!catSlug) continue
      params.push({ locale, categorie: catSlug, machine: machine.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }) {
  const { locale, categorie, machine: machineSlug } = await params
  const { data } = await supabaseServer
    .from('machines')
    .select('merk, modelnummer, categorie')
    .eq('slug', machineSlug)
    .single()

  if (!data) return {}

  const t = await getTranslations({ locale, namespace: 'meta' })

  const languages = {}
  for (const loc of routing.locales) {
    const catSlug = CATEGORIES[data.categorie]?.slugs[loc]
    languages[loc] = `${BASE_URL}/${loc}/${catSlug}/${machineSlug}`
  }

  return {
    title: t('machine_title', { brand: data.merk, model: data.modelnummer }),
    description: t('machine_description', { brand: data.merk, model: data.modelnummer }),
    alternates: { languages },
  }
}

export default async function MachineDetailPage({ params }) {
  const { locale, categorie, machine: machineSlug } = await params
  setRequestLocale(locale)

  const categoryKey = categoryFromSlug(categorie, locale)
  if (!categoryKey) notFound()

  const { data: machine } = await supabaseServer
    .from('machines')
    .select('*')
    .eq('slug', machineSlug)
    .single()

  if (!machine) notFound()

  const { data: relatedMachines } = await supabaseServer
    .from('machines')
    .select('*')
    .eq('merk', machine.merk)

  const t = await getTranslations({ locale })
  const categoryName = t(`categories.${categoryKey}`)

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <Breadcrumbs
        locale={locale}
        items={[
          { label: categoryName, href: `/${locale}/${categorie}` },
          { label: `${machine.merk} ${machine.modelnummer}`, href: `/${locale}/${categorie}/${machineSlug}` },
        ]}
      />

      <header className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-highest text-on-surface-variant rounded mb-4">
          <span className="text-[10px] font-bold tracking-label uppercase">
            {categoryName}
          </span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-bold tracking-display leading-none uppercase">
          {machine.merk} {machine.modelnummer}
        </h1>
      </header>

      <div className="mb-16">
        <FuelAdvice machine={machine} />
      </div>

      <GeoProductSection motortype={machine.motortype} merk={machine.merk} />

      <AdSlot id="ad-slot-detail" />

      <div className="mb-16">
        <RelatedMachines
          machines={relatedMachines || []}
          currentMachineId={machine.id}
          brand={machine.merk}
          locale={locale}
        />
      </div>

      <ShareButton />
    </div>
  )
}
