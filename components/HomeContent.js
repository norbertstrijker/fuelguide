'use client'

import { useTranslations } from 'next-intl'
import SearchBar from '@/components/SearchBar'
import CategoryGrid from '@/components/CategoryGrid'
import HowItWorks from '@/components/HowItWorks'

export default function HomeContent({ locale, counts }) {
  const t = useTranslations()

  return (
    <>
      <section className="bg-gradient-to-br from-groen to-groen-light text-white py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">{t('hero.title')}</h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8">{t('hero.subtitle')}</p>
          <SearchBar size="large" />
        </div>
      </section>

      <section className="py-6 border-b">
        <div className="max-w-3xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <span>✅ {t('trust.models')}</span>
          <span>✅ {t('trust.free')}</span>
          <span>✅ {t('trust.instant')}</span>
          <span>🌍 {t('trust.languages')}</span>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">{t('categories.title')}</h2>
        <CategoryGrid locale={locale} counts={counts} />
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">{t('how_it_works.title')}</h2>
          <HowItWorks />
        </div>
      </section>
    </>
  )
}
