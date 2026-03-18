'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { CATEGORIES, categoryFromSlug } from '@/lib/categories'

const LOCALE_LABELS = { nl: 'NL', de: 'DE', en: 'EN' }

export default function Header() {
  const locale = useLocale()
  const t = useTranslations('header')
  const pathname = usePathname()
  const router = useRouter()

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <Image src="/logo.png" alt="FuelGuide" width={32} height={32} />
          <span className="font-bold text-groen text-lg hidden sm:inline">FuelGuide</span>
        </Link>

        {/* SearchBar will be added here in Task 6 */}

        <div className="flex items-center gap-3">
          {Object.entries(LOCALE_LABELS).map(([loc, label]) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`text-sm font-medium px-2 py-1 rounded ${
                loc === locale
                  ? 'bg-groen text-white'
                  : 'text-gray-500 hover:text-groen'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
