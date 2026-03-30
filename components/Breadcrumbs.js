'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ locale, items }) {
  const t = useTranslations('breadcrumbs')

  const crumbs = [{ label: t('home'), href: `/${locale}` }, ...items]

  return (
    <nav className="flex items-center gap-1 text-sm text-on-surface-variant mb-6">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3 h-3 text-outline" />}
          {i < crumbs.length - 1 ? (
            <Link href={crumb.href} className="hover:text-primary transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-on-surface font-bold">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
