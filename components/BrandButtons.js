'use client'

import { useTranslations } from 'next-intl'

const BRANDS = ['Stihl', 'Husqvarna', 'Honda', 'Makita', 'Bosch', 'Echo', 'Stiga', 'Mountfield']

export default function BrandButtons({ onSearch }) {
  const t = useTranslations('brands')

  return (
    <div className="bg-surface-container-low p-8 rounded">
      <div className="flex justify-between items-start mb-8">
        <span className="text-[10px] font-bold tracking-label uppercase text-outline">{t('title')}</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {BRANDS.map((brand) => (
          <button
            key={brand}
            onClick={() => onSearch(brand)}
            className="bg-surface-container-lowest px-4 py-2 rounded font-bold text-xs uppercase tracking-tight border border-transparent hover:border-primary-container transition-all"
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  )
}
