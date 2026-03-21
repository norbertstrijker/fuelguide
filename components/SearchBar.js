'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
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

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => { e.preventDefault(); handleSearch() }}
        className="flex gap-2"
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={size === 'large' ? t('hero.search_placeholder') : t('header.search_placeholder')}
          className={size === 'large' ? 'h-12 text-base' : 'h-10'}
        />
        <Button
          type="submit"
          disabled={loading}
          className={`bg-oranje hover:bg-oranje/90 text-white ${size === 'large' ? 'h-12 px-6' : 'h-10 px-4'}`}
        >
          {loading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <>
              <Search className="w-4 h-4 mr-1" />
              {size === 'large' && t('hero.search_button')}
            </>
          )}
        </Button>
      </form>

      {size === 'large' && (
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="text-sm text-white/70">{t('search.try_examples')}</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => { setQuery(ex); handleSearch(ex) }}
              className="text-sm bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {results && results.type === 'suggesties' && (
        <div className="mt-4 bg-white rounded-lg p-4 shadow">
          <p className="font-medium mb-3">{t('search.suggestions_title')}</p>
          <div className="grid gap-2">
            {results.suggesties.map((s, i) => {
              const catSlug = CATEGORIES[s.categorie]?.slugs[locale] || s.categorie
              return (
                <button
                  key={i}
                  onClick={() => s.slug
                    ? router.push(`/${locale}/${catSlug}/${s.slug}`)
                    : handleSearch(`${s.merk} ${s.modelnummer}`)
                  }
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 text-left"
                >
                  {s.afbeelding_url ? (
                    <img src={s.afbeelding_url} alt={`${s.merk} ${s.modelnummer}`} className="w-12 h-12 object-contain" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-lg">🔧</div>
                  )}
                  <div>
                    <span className="font-medium">{s.merk} {s.modelnummer}</span>
                    <span className="text-sm text-gray-500 ml-2">{s.categorie}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {results && results.type === 'ai_schatting' && results.machine && (
        <div className="mt-4 bg-white rounded-lg p-6 shadow">
          <h3 className="font-bold text-lg mb-2">
            {results.machine.merk} {results.machine.modelnummer}
          </h3>
          <div className="bg-gradient-to-r from-groen to-groen-light text-white rounded-xl p-5 mb-4">
            <p className="text-lg font-bold">
              {results.machine.motortype === '2-takt'
                ? t('fuel_advice.uses_mix', { ratio: results.machine.mengverhouding || '1:50' })
                : t('fuel_advice.uses_petrol', { fuel: results.machine.e10_geschikt ? 'E10' : 'Euro 95' })}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded p-3 text-center">
              <p className="text-gray-500">{t('specs.motor_type')}</p>
              <p className="font-semibold">{results.machine.motortype}</p>
            </div>
            <div className="bg-gray-50 rounded p-3 text-center">
              <p className="text-gray-500">{t('specs.e10')}</p>
              <p className="font-semibold">{results.machine.e10_geschikt ? t('specs.yes') : t('specs.no')}</p>
            </div>
          </div>
        </div>
      )}

      {results && results.type === 'niet_gevonden' && (
        <div className="mt-4 bg-white rounded-lg p-4 shadow">
          <p className="text-gray-600">{t('search.no_results')}</p>
        </div>
      )}
    </div>
  )
}
