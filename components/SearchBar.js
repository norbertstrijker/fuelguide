'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Search, ArrowRight, Loader2 } from 'lucide-react'
import { CATEGORIES } from '@/lib/categories'

const EXAMPLES = ['Honda HRG 416', 'Husqvarna 125B', 'Stihl MS 250']

export default function SearchBar({ size = 'large', categoryFilter = null }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const locale = useLocale()
  const t = useTranslations()
  const router = useRouter()

  async function handleSearch(searchQuery) {
    const q = searchQuery || query
    if (!q.trim()) return

    setLoading(true)
    setResults(null)

    try {
      const res = await fetch(`/api/zoek?q=${encodeURIComponent(q)}`)
      const data = await res.json()

      if (data.type === 'resultaat' && data.machine?.slug) {
        const catSlug = CATEGORIES[data.machine.categorie]?.slugs[locale] || data.machine.categorie
        router.push(`/${locale}/${catSlug}/${data.machine.slug}`)
      } else if (data.type === 'suggesties') {
        setResults(data)
      } else {
        setResults(data)
      }
    } catch {
      setResults({ type: 'fout', bericht: 'Er ging iets mis.' })
    } finally {
      setLoading(false)
    }
  }

  if (size === 'compact') {
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleSearch() }} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('header.search_placeholder')}
            className="w-full bg-surface-container-low border-none rounded pl-9 pr-3 py-2 text-sm focus:ring-0 focus:bg-surface-container-high transition-colors placeholder:text-outline"
          />
        </div>
      </form>
    )
  }

  return (
    <div className="w-full">
      <form onSubmit={(e) => { e.preventDefault(); handleSearch() }}>
        <div className="ghost-border flex items-end py-4 transition-all duration-300">
          <Search className="text-outline mr-4 mb-1 w-8 h-8 flex-shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('hero.search_placeholder')}
            className="w-full bg-transparent border-none focus:ring-0 text-2xl md:text-3xl font-headline placeholder:text-outline-variant/60 text-on-surface"
          />
          <button
            type="submit"
            disabled={loading}
            className="signature-gradient text-white px-8 py-3 rounded font-bold tracking-tight flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-ambient mb-1 flex-shrink-0 text-sm uppercase"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {t('hero.search_button')}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {size === 'large' && (
        <div className="flex gap-2 mt-4 flex-wrap">
          <span className="text-sm text-on-surface-variant">{t('search.try_examples')}</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => { setQuery(ex); handleSearch(ex) }}
              className="text-sm bg-surface-container-low hover:bg-surface-container-high px-4 py-2 rounded font-medium transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {results && results.type === 'suggesties' && (
        <div className="mt-6 bg-surface-container-lowest rounded-lg p-6 shadow-ambient">
          <p className="font-bold mb-4 text-xs uppercase tracking-label text-on-surface-variant">{t('search.suggestions_title')}</p>
          <div className="grid gap-3">
            {results.suggesties.map((s, i) => {
              const catSlug = CATEGORIES[s.categorie]?.slugs[locale] || s.categorie
              return (
                <button
                  key={i}
                  onClick={() => s.slug
                    ? router.push(`/${locale}/${catSlug}/${s.slug}`)
                    : handleSearch(`${s.merk} ${s.modelnummer}`)
                  }
                  className="flex items-center gap-4 p-4 rounded bg-surface-container-low hover:bg-surface-container-high text-left transition-colors"
                >
                  {s.afbeelding_url ? (
                    <img src={s.afbeelding_url} alt={`${s.merk} ${s.modelnummer}`} className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="w-12 h-12 bg-surface-container-highest rounded flex items-center justify-center">
                      <Search className="w-5 h-5 text-outline" />
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-on-surface">{s.merk} {s.modelnummer}</span>
                    <span className="text-xs text-on-surface-variant ml-2 uppercase tracking-label">{s.categorie}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {results && results.type === 'ai_schatting' && results.machine && (
        <div className="mt-6 bg-surface-container-lowest rounded-lg p-6 shadow-ambient">
          <h3 className="font-bold text-lg mb-3">
            {results.machine.merk} {results.machine.modelnummer}
          </h3>
          <div className="signature-gradient text-white rounded p-5 mb-4">
            <p className="text-lg font-bold">
              {results.machine.motortype === '2-takt'
                ? t('fuel_advice.uses_mix', { ratio: results.machine.mengverhouding || '1:50' })
                : t('fuel_advice.uses_petrol', { fuel: results.machine.e10_geschikt ? 'E10' : 'Euro 95' })}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-surface-container-low rounded p-3 text-center">
              <p className="text-on-surface-variant text-xs uppercase tracking-label">{t('specs.motor_type')}</p>
              <p className="font-bold mt-1">{results.machine.motortype}</p>
            </div>
            <div className="bg-surface-container-low rounded p-3 text-center">
              <p className="text-on-surface-variant text-xs uppercase tracking-label">{t('specs.e10')}</p>
              <p className="font-bold mt-1">{results.machine.e10_geschikt ? t('specs.yes') : t('specs.no')}</p>
            </div>
          </div>
        </div>
      )}

      {results && results.type === 'niet_gevonden' && (
        <div className="mt-6 bg-surface-container-low rounded-lg p-4">
          <p className="text-on-surface-variant">{t('search.no_results')}</p>
        </div>
      )}
    </div>
  )
}
