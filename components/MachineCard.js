'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { machineSlug as generateSlug } from '@/lib/categories'
import { Search } from 'lucide-react'

export default function MachineCard({ machine, locale, categorySlug, featured = false }) {
  const t = useTranslations('specs')
  const slug = machine.slug || generateSlug(machine.merk, machine.modelnummer)

  const motorLabel = machine.motortype === '2-takt' ? t('two_stroke')
    : machine.motortype === '4-takt' ? t('four_stroke')
    : t('unknown')

  if (featured) {
    return (
      <Link href={`/${locale}/${categorySlug}/${slug}`} className="block group">
        <div className="bg-surface-container-lowest rounded overflow-hidden flex flex-col md:flex-row border border-outline-variant/20 hover:border-outline-variant/100 transition-all shadow-ambient">
          <div className="md:w-1/2 relative min-h-[300px] bg-surface-container-low p-8 flex items-center justify-center">
            {machine.afbeelding_url ? (
              <img src={machine.afbeelding_url} alt={`${machine.merk} ${machine.modelnummer}`} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <Search className="w-16 h-16 text-outline" />
            )}
          </div>
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">{machine.merk} {machine.modelnummer}</h2>
              <div className="flex gap-2 mb-6">
                <span className="text-[10px] font-bold tracking-tight uppercase px-2 py-1 bg-surface-container-highest rounded">{motorLabel}</span>
                {machine.mengverhouding && (
                  <span className="text-[10px] font-bold tracking-tight uppercase px-2 py-1 bg-surface-container-highest rounded">{machine.mengverhouding}</span>
                )}
              </div>
            </div>
            <span className="signature-gradient text-white py-4 px-6 rounded font-bold uppercase tracking-wider text-sm text-center">
              {t('view_fuel') || 'BEKIJK BRANDSTOF'}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/${locale}/${categorySlug}/${slug}`} className="block group">
      <div className="bg-surface-container-low border border-outline-variant/10 rounded p-6 flex flex-col h-full hover:bg-surface-container-high transition-colors">
        <div className="aspect-square bg-surface-container-lowest rounded mb-6 overflow-hidden flex items-center justify-center">
          {machine.afbeelding_url ? (
            <img src={machine.afbeelding_url} alt={`${machine.merk} ${machine.modelnummer}`} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
          ) : (
            <Search className="w-12 h-12 text-outline" />
          )}
        </div>
        <h3 className="text-xl font-bold mb-2">{machine.merk} {machine.modelnummer}</h3>
        <div className="flex gap-2 mb-6">
          <span className="text-[10px] font-bold tracking-tight uppercase px-2 py-1 bg-surface-container-highest rounded">{motorLabel}</span>
        </div>
        <button className="mt-auto bg-surface-container-high text-on-surface py-3 px-4 rounded font-bold uppercase tracking-wider text-xs hover:bg-surface-container-highest transition-colors">
          {t('view_fuel') || 'BEKIJK BRANDSTOF'}
        </button>
      </div>
    </Link>
  )
}
