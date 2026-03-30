'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link2, Check } from 'lucide-react'

export default function ShareButton() {
  const [copied, setCopied] = useState(false)
  const t = useTranslations('share')

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="text-center">
      <button
        onClick={handleCopy}
        className="text-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 mx-auto"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        {copied ? t('copied') : t('button')}
      </button>
    </div>
  )
}
