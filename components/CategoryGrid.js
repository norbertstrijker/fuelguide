'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { CATEGORIES } from '@/lib/categories'
import { Flower2, TreePine, Wind, Scissors, Trees, Zap } from 'lucide-react'

const CATEGORY_ICONS = {
  grasmaaiers: Flower2,
  kettingzagen: TreePine,
  bladblazers: Wind,
  heggenscharen: Scissors,
  bosmaaiers: Trees,
  generatoren: Zap,
}

export default function CategoryGrid({ locale, counts = {} }) {
  const t = useTranslations('categories')

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {Object.entries(CATEGORIES).map(([key, cat]) => {
        const Icon = CATEGORY_ICONS[key]
        return (
          <Link key={key} href={`/${locale}/${cat.slugs[locale]}`}>
            <div className="aspect-square bg-surface-container-low hover:bg-surface-container-high p-6 flex flex-col justify-between transition-colors rounded group">
              <Icon className="w-6 h-6 text-primary" />
              <div>
                {counts[key] !== undefined && (
                  <p className="text-[10px] font-bold tracking-label uppercase text-outline mb-1">
                    {t('models_count', { count: counts[key] })}
                  </p>
                )}
                <p className="font-bold text-sm">{t(key)}</p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
