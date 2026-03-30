'use client'

import { useTranslations } from 'next-intl'
import { Check, Zap, Shield, Star } from 'lucide-react'
import { regionLabel, formatPrice, regionCurrency } from '@/lib/geo'

export default function ProductCards({ products, region }) {
  const t = useTranslations('products')

  if (!products || products.length === 0) {
    return (
      <div>
        <h2 className="text-xs font-bold tracking-label uppercase text-outline mb-6">{t('title')}</h2>
        <p className="text-on-surface-variant bg-surface-container-low rounded p-4">
          {t('no_products', { fuel: 'E10' })}
        </p>
      </div>
    )
  }

  const tiers = {
    basic: { icon: Check, ctaClass: 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest' },
    better: { icon: Zap, ctaClass: 'signature-gradient text-white hover:opacity-90 shadow-lg shadow-primary/20' },
    best: { icon: Star, ctaClass: 'bg-on-surface text-surface hover:bg-black' },
  }

  const sorted = [...products].sort((a, b) => {
    const order = { basic: 0, better: 1, best: 2 }
    return (order[a.kwaliteit] || 0) - (order[b.kwaliteit] || 0)
  })

  const currency = regionCurrency(region)
  const platform = regionLabel(region)

  return (
    <div>
      <h2 className="text-xs font-bold tracking-label uppercase text-outline mb-6">{t('title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sorted.map((product) => {
          const tier = tiers[product.kwaliteit] || tiers.basic
          const isBetter = product.kwaliteit === 'better'
          const Icon = tier.icon

          return (
            <div
              key={product.id}
              className={`rounded flex flex-col h-full ${
                isBetter ? 'bg-on-surface p-1' : 'bg-surface-container-low p-1'
              }`}
            >
              {isBetter && (
                <div className="flex justify-end px-4 pt-3">
                  <span className="signature-gradient px-3 py-1 rounded text-[9px] font-bold tracking-label text-white uppercase">
                    {t('recommended')}
                  </span>
                </div>
              )}
              <div className={`${isBetter ? 'bg-surface-container-lowest' : 'bg-surface'} p-8 flex-grow rounded`}>
                <div className="mb-8">
                  <span className="text-[10px] font-bold tracking-label text-on-secondary-container uppercase block mb-4">
                    {t(product.kwaliteit)}
                  </span>
                  <h3 className="text-lg font-bold mb-2">{product.naam}</h3>
                  {product.prijs && (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tighter text-on-surface">
                        {formatPrice(product.prijs, currency)}
                      </span>
                    </div>
                  )}
                </div>
                {product.afbeelding_url && (
                  <img src={product.afbeelding_url} alt={product.naam} className="w-full h-32 object-contain mb-6" />
                )}
              </div>
              <div className={`p-4 ${isBetter ? 'bg-on-surface' : ''}`}>
                {product.affiliate_url ? (
                  <a
                    href={product.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className={`block w-full py-4 rounded font-bold text-xs tracking-label uppercase text-center transition-all active:scale-[0.98] ${tier.ctaClass}`}
                  >
                    {t('view_on', { platform })}
                  </a>
                ) : (
                  <span className="block w-full py-4 rounded font-bold text-xs tracking-label uppercase text-center bg-surface-container-high text-on-surface-variant">
                    {t('view_on', { platform })}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
