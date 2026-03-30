'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { countryToRegion } from '@/lib/geo'
import ProductCards from '@/components/ProductCards'
import BrandProducts from '@/components/BrandProducts'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function getCookie(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

export default function GeoProductSection({ motortype, merk }) {
  const [products, setProducts] = useState([])
  const [brandProducts, setBrandProducts] = useState([])
  const [region, setRegion] = useState('amazon_com')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const country = getCookie('fg_country') || 'US'
    const r = countryToRegion(country)
    setRegion(r)

    Promise.all([
      supabase
        .from('producten')
        .select('*')
        .eq('motortype', motortype)
        .eq('regio', r)
        .order('kwaliteit', { ascending: true }),
      supabase
        .from('merk_affiliates')
        .select('*')
        .eq('merk', merk)
        .eq('regio', r),
    ]).then(([prodResult, brandResult]) => {
      setProducts(prodResult.data || [])
      setBrandProducts(brandResult.data || [])
      setLoading(false)
    })
  }, [motortype, merk])

  if (loading) {
    return (
      <div className="mb-16">
        <div className="h-64 bg-surface-container-low rounded animate-pulse" />
      </div>
    )
  }

  return (
    <>
      <div className="mb-16">
        <ProductCards products={products} region={region} />
      </div>
      <div className="mb-16">
        <BrandProducts products={brandProducts} brand={merk} region={region} />
      </div>
    </>
  )
}
