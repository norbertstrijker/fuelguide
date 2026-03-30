'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { CATEGORIES, categoryFromSlug } from '@/lib/categories'
import SearchBar from '@/components/SearchBar'

const LOCALE_LABELS = { nl: 'NL', de: 'DE', en: 'EN' }

export default function Header() {
  const locale = useLocale()
  const t = useTranslations('header')
  const pathname = usePathname()
  const router = useRouter()

  const isHomepage = pathname === `/${locale}` || pathname === `/${locale}/`

  function switchLocale(newLocale) {
    const segments = pathname.split('/')
    const oldLocale = segments[1]
    segments[1] = newLocale

    if (segments[2]) {
      const categoryKey = categoryFromSlug(segments[2], oldLocale)
      if (categoryKey) {
        segments[2] = CATEGORIES[categoryKey].slugs[newLocale]
      }
    }

    router.push(segments.join('/'))
  }

  return (
    <header className="sticky top-0 z-50 glass-header bg-surface/85">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          <Image src="/logo.png" alt="FuelGuide" width={40} height={40} className="transition-transform duration-500 group-hover:scale-105" />
          <span className="font-bold text-on-surface text-xl tracking-tighter uppercase hidden sm:inline">
            FUELGUIDE
          </span>
        </Link>

        {!isHomepage && (
          <div className="hidden sm:block flex-1 max-w-xs mx-6">
            <SearchBar size="compact" />
          </div>
        )}

        <div className="flex items-center gap-1">
          {Object.entries(LOCALE_LABELS).map(([loc, label]) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`text-xs font-bold tracking-label uppercase px-3 py-1.5 rounded transition-colors ${
                loc === locale
                  ? 'bg-primary text-white'
                  : 'text-on-surface/60 hover:text-primary hover:bg-surface-container-high'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-px w-full bg-surface-container-low" />
    </header>
  )
}
