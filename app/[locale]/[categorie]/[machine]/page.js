import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { supabaseServer } from '@/lib/supabase-server'
import { categoryFromSlug, CATEGORIES } from '@/lib/categories'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import FuelAdvice from '@/components/FuelAdvice'
import ProductCards from '@/components/ProductCards'
import RelatedMachines from '@/components/RelatedMachines'
import ShareButton from '@/components/ShareButton'

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

  const { data: products } = await supabaseServer
    .from('producten')
    .select('*')
    .eq('motortype', machine.motortype)
    .eq('markt', locale)
    .order('kwaliteit', { ascending: true })

  const { data: relatedMachines } = await supabaseServer
    .from('machines')
    .select('*')
    .eq('merk', machine.merk)

  const t = await getTranslations({ locale })
  const categoryName = t(`categories.${categoryKey}`)
  const tSpecs = await getTranslations({ locale, namespace: 'specs' })

  const fuelLabel = machine.e10_geschikt ? 'E10' : 'Euro 95'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs
        locale={locale}
        items={[
          { label: categoryName, href: `/${locale}/${categorie}` },
          { label: `${machine.merk} ${machine.modelnummer}`, href: `/${locale}/${categorie}/${machineSlug}` },
        ]}
      />

      <div className="flex items-start gap-6 mb-6">
        {machine.afbeelding_url ? (
          <img
            src={machine.afbeelding_url}
            alt={`${machine.merk} ${machine.modelnummer}`}
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain flex-shrink-0"
          />
        ) : (
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
            🔧
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {machine.merk} {machine.modelnummer}
          </h1>
          <p className="text-gray-500">{categoryName}</p>
        </div>
      </div>

      <div className="mb-8">
        <FuelAdvice machine={machine} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">{tSpecs('motor_type')}</p>
          <p className="font-semibold">{tSpecs(machine.motortype === '2-takt' ? 'two_stroke' : 'four_stroke')}</p>
        </div>
        {machine.mengverhouding && (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">{tSpecs('mix_ratio')}</p>
            <p className="font-semibold">{machine.mengverhouding}</p>
          </div>
        )}
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500 mb-1">{tSpecs('e10')}</p>
          <p className="font-semibold">
            {machine.e10_geschikt === true ? tSpecs('yes') : machine.e10_geschikt === false ? tSpecs('no') : tSpecs('unknown')}
          </p>
        </div>
        {machine.bouwjaar && (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">{tSpecs('build_year')}</p>
            <p className="font-semibold">{machine.bouwjaar}</p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <ProductCards products={products} locale={locale} fuelLabel={fuelLabel} />
      </div>

      <div className="mb-8">
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
