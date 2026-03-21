'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { CATEGORIES } from '@/lib/categories'
import { Card, CardContent } from '@/components/ui/card'

const CATEGORY_ICONS = {
  grasmaaiers: '🌿',
  kettingzagen: '🪵',
  bladblazers: '🍂',
  heggenscharen: '✂️',
  bosmaaiers: '🌾',
  generatoren: '⚡',
}

export default function CategoryGrid({ locale, counts = {} }) {
  const t = useTranslations('categories')

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {Object.entries(CATEGORIES).map(([key, cat]) => (
        <Link key={key} href={`/${locale}/${cat.slugs[locale]}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">{CATEGORY_ICONS[key]}</div>
              <h3 className="font-semibold text-groen">{t(key)}</h3>
              {counts[key] !== undefined && (
                <p className="text-sm text-gray-500 mt-1">
                  {t('models_count', { count: counts[key] })}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
