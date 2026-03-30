'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { CATEGORIES, machineSlug as generateSlug } from '@/lib/categories'
import { Search } from 'lucide-react'

export default function RelatedMachines({ machines, currentMachineId, brand, locale }) {
  const t = useTranslations('related')

  const related = machines
    .filter((m) => m.id !== currentMachineId)
    .slice(0, 6)

  if (related.length === 0) return null

  return (
    <div>
      <h2 className="text-xs font-bold tracking-label uppercase text-outline mb-6">
        {t('title', { brand })}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {related.map((machine) => {
          const catSlug = CATEGORIES[machine.categorie]?.slugs[locale] || machine.categorie
          const slug = machine.slug || generateSlug(machine.merk, machine.modelnummer)

          return (
            <Link
              key={machine.id}
              href={`/${locale}/${catSlug}/${slug}`}
              className="flex items-center gap-3 p-4 rounded bg-surface-container-low hover:bg-surface-container-high transition-colors"
            >
              {machine.afbeelding_url ? (
                <img src={machine.afbeelding_url} alt="" className="w-10 h-10 object-contain" />
              ) : (
                <div className="w-10 h-10 bg-surface-container-highest rounded flex items-center justify-center">
                  <Search className="w-4 h-4 text-outline" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{machine.merk} {machine.modelnummer}</p>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-label">
                  {machine.motortype === '2-takt' ? '2-takt' : '4-takt'}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
