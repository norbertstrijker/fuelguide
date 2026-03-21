import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['nl', 'de', 'en'],
  defaultLocale: 'nl',
})
