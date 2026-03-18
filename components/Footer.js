'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'

export default function Footer({ locale }) {
  const t = useTranslations('footer')
  const tCat = useTranslations('categories')

  return (
    <footer className="bg-groen text-white mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <Link
              key={key}
              href={`/${locale}/${cat.slugs[locale]}`}
              className="text-white/80 hover:text-white text-sm"
            >
              {tCat(key)}
            </Link>
          ))}
        </div>
        <p className="text-white/60 text-sm">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
