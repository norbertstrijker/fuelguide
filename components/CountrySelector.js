'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ALL_COUNTRIES } from '@/lib/geo'

function getCookie(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

function setCookie(name, value) {
  document.cookie = `${name}=${value};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
}

export default function CountrySelector() {
  const t = useTranslations('geo')
  const [country, setCountry] = useState('US')

  useEffect(() => {
    const saved = getCookie('fg_country')
    if (saved) setCountry(saved)
  }, [])

  function handleChange(e) {
    const newCountry = e.target.value
    setCountry(newCountry)
    setCookie('fg_country', newCountry)
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-label text-on-surface-variant/60">
        {t('your_region')}
      </span>
      <select
        value={country}
        onChange={handleChange}
        className="bg-transparent border-none text-sm font-bold text-on-surface-variant focus:ring-0 cursor-pointer p-0"
      >
        {ALL_COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
    </div>
  )
}
