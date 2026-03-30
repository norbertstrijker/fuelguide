'use client'

import { useTranslations } from 'next-intl'
import { regionLabel, formatPrice, regionCurrency } from '@/lib/geo'

export default function BrandProducts({ products, brand, region }) {
  const t = useTranslations('brand_products')

  if (!products || products.length === 0) return null

  const currency = regionCurrency(region)
  const platform = regionLabel(region)

  return (
    <div>
      <h2 className="text-xs font-bold tracking-label uppercase text-outline mb-6">
        {t('title', { brand })}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map((product) => (
          <a
            key={product.id}
            href={product.affiliate_url || '#'}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="bg-surface-container-low rounded p-4 hover:bg-surface-container-high transition-colors block"
          >
            {product.afbeelding_url && (
              <img src={product.afbeelding_url} alt={product.naam} className="w-full h-24 object-contain mb-3" />
            )}
            <p className="font-bold text-sm mb-1">{product.naam}</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-label">{product.type}</p>
            {product.prijs && (
              <p className="text-sm font-bold text-primary mt-2">
                {formatPrice(product.prijs, currency)}
              </p>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
