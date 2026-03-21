'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { machineSlug as generateSlug } from '@/lib/categories'

export default function MachineCard({ machine, locale, categorySlug }) {
  const t = useTranslations('specs')
  const slug = machine.slug || generateSlug(machine.merk, machine.modelnummer)

  const motorBadgeColor = machine.motortype === '4-takt'
    ? 'bg-green-100 text-green-800'
    : machine.motortype === '2-takt'
    ? 'bg-yellow-100 text-yellow-800'
    : 'bg-gray-100 text-gray-600'

  const motorLabel = machine.motortype === '2-takt' ? t('two_stroke')
    : machine.motortype === '4-takt' ? t('four_stroke')
    : t('unknown')

  return (
    <Link href={`/${locale}/${categorySlug}/${slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-4 flex items-center gap-4">
          {machine.afbeelding_url ? (
            <img
              src={machine.afbeelding_url}
              alt={`${machine.merk} ${machine.modelnummer}`}
              className="w-16 h-16 object-contain flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-2xl flex-shrink-0">
              🔧
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">
              {machine.merk} {machine.modelnummer}
            </h3>
            <Badge className={`mt-1 ${motorBadgeColor}`}>
              {motorLabel}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
