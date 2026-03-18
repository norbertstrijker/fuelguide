'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { CATEGORIES, machineSlug as generateSlug } from '@/lib/categories'

export default function RelatedMachines({ machines, currentMachineId, brand, locale }) {
  const t = useTranslations('related')
  const tCat = useTranslations('categories')

  const related = machines
    .filter((m) => m.id !== currentMachineId)
    .slice(0, 6)

  if (related.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{t('title', { brand })}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {related.map((machine) => {
          const catSlug = CATEGORIES[machine.categorie]?.slugs[locale] || machine.categorie
          const slug = machine.slug || generateSlug(machine.merk, machine.modelnummer)

          return (
            <Link
              key={machine.id}
              href={`/${locale}/${catSlug}/${slug}`}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50"
            >
              {machine.afbeelding_url ? (
                <img src={machine.afbeelding_url} alt="" className="w-10 h-10 object-contain" />
              ) : (
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-lg">🔧</div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{machine.merk} {machine.modelnummer}</p>
                <Badge variant="outline" className="text-xs mt-0.5">
                  {tCat(machine.categorie)}
                </Badge>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
