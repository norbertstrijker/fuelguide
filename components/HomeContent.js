'use client'

import { useTranslations } from 'next-intl'
import SearchBar from '@/components/SearchBar'
import BrandButtons from '@/components/BrandButtons'
import CategoryGrid from '@/components/CategoryGrid'
import HowItWorks from '@/components/HowItWorks'
import AdSlot from '@/components/AdSlot'

export default function HomeContent({ locale, counts }) {
  const t = useTranslations()

  async function handleBrandSearch(brand) {
    try {
      const res = await fetch(`/api/zoek?q=${encodeURIComponent(brand)}`)
      const data = await res.json()
      if (data.type === 'resultaat' && data.machine?.slug) {
        const catSlug = data.machine.categorie
        window.location.href = `/${locale}/${catSlug}/${data.machine.slug}`
      } else if (data.type === 'suggesties' && data.suggesties?.length > 0) {
        const first = data.suggesties[0]
        const catSlug = first.categorie
        window.location.href = `/${locale}/${catSlug}`
      }
    } catch {
      // Fallback: do nothing
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="text-primary text-xs font-bold uppercase tracking-label block mb-4">
              FuelGuide.app
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-display leading-tight text-on-surface mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-on-secondary-container max-w-xl leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Central Search */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <SearchBar size="large" />
      </section>

      {/* Brand Buttons */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <BrandButtons onSearch={handleBrandSearch} />
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-xs font-bold tracking-label uppercase text-outline">{t('categories.title')}</h2>
          <div className="flex-1 h-px bg-outline-variant/20" />
        </div>
        <CategoryGrid locale={locale} counts={counts} />
      </section>

      {/* Ad Slot */}
      <AdSlot id="ad-slot-home" />

      {/* How It Works */}
      <section className="bg-surface-container-low py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-xs font-bold tracking-label uppercase text-outline text-center mb-8">
            {t('how_it_works.title')}
          </h2>
          <HowItWorks />
        </div>
      </section>
    </>
  )
}
