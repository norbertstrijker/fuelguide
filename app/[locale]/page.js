import { setRequestLocale } from 'next-intl/server'

export default async function HomePage({ params }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <div className="p-8 text-center text-gray-500">Homepage coming soon...</div>
}
