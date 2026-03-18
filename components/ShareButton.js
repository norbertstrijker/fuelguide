'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

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
      <button onClick={handleCopy} className="text-sm text-gray-500 hover:text-groen">
        📋 {copied ? t('copied') : t('button')}
      </button>
    </div>
  )
}
