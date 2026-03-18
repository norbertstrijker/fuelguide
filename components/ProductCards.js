'use client'

import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const TIER_CONFIG = {
  basis: { label: 'basic', color: 'bg-gray-100 border-gray-200' },
  beter: { label: 'better', color: 'bg-green-50 border-green-200' },
  best: { label: 'best', color: 'bg-oranje/5 border-oranje/30' },
}

export default function ProductCards({ products, locale, fuelLabel }) {
  const t = useTranslations('products')

  if (!products || products.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">{t('title')}</h2>
        <p className="text-gray-600 bg-gray-50 rounded-lg p-4">
          {t('no_products', { fuel: fuelLabel || 'E10' })}
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{t('title')}</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        {products.map((product) => {
          const tier = TIER_CONFIG[product.kwaliteit] || TIER_CONFIG.basis
          const isBest = product.kwaliteit === 'best'

          return (
            <Card key={product.id} className={`relative ${tier.color} border`}>
              {isBest && (
                <Badge className="absolute -top-2 right-3 bg-oranje text-white">
                  {t('recommended')}
                </Badge>
              )}
              <CardContent className="p-5">
                {product.afbeelding_url && (
                  <img
                    src={product.afbeelding_url}
                    alt={product.naam}
                    className="w-full h-32 object-contain mb-3"
                  />
                )}
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  {t(tier.label)}
                </p>
                <h3 className="font-semibold mb-2">{product.naam}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.beschrijving}</p>
                {product.prijs && (
                  <p className="text-lg font-bold mb-3">€{product.prijs}</p>
                )}
                {product.affiliate_url && (
                  <Button asChild className="w-full bg-oranje hover:bg-oranje/90 text-white">
                    <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer nofollow">
                      {t('view_on')}
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
