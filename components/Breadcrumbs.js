'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ locale, items }) {
  const t = useTranslations('breadcrumbs')

  const crumbs = [{ label: t('home'), href: `/${locale}` }, ...items]

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3 h-3" />}
          {i < crumbs.length - 1 ? (
            <Link href={crumb.href} className="hover:text-groen">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
