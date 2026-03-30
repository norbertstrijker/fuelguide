'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import CountrySelector from '@/components/CountrySelector'

export default function Footer({ locale }) {
  const t = useTranslations('footer')
  const tCat = useTranslations('categories')

  return (
    <footer className="bg-on-surface text-surface mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <Link
              key={key}
              href={`/${locale}/${cat.slugs[locale]}`}
              className="text-surface/60 hover:text-surface text-sm font-medium transition-colors"
            >
              {tCat(key)}
            </Link>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-surface/10">
          <p className="text-surface/40 text-sm">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <CountrySelector />
        </div>
      </div>
    </footer>
  )
}
