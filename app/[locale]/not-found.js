'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('not_found')
  const locale = useLocale()

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">{t('title')}</p>
      <p className="text-gray-500 mb-8">{t('text')}</p>
      <Link href={`/${locale}`} className="text-oranje hover:underline font-medium">
        {t('back_home')}
      </Link>
    </div>
  )
}
