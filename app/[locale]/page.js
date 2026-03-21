import { setRequestLocale } from 'next-intl/server'
import { supabaseServer } from '@/lib/supabase-server'
import { allCategoryKeys } from '@/lib/categories'
import HomeContent from '@/components/HomeContent'

export default async function HomePage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)

  const { data: machines } = await supabaseServer
    .from('machines')
    .select('categorie')

  const counts = {}
  for (const key of allCategoryKeys()) {
    counts[key] = machines?.filter((m) => m.categorie === key).length || 0
  }

  return <HomeContent locale={locale} counts={counts} />
}
