const COUNTRY_TO_REGION = {
  NL: 'bol', BE: 'bol',
  DE: 'amazon_de', AT: 'amazon_de', CH: 'amazon_de',
  US: 'amazon_com', CA: 'amazon_com',
  GB: 'amazon_uk', IE: 'amazon_uk',
  FR: 'amazon_fr',
}

const REGION_CURRENCY = {
  bol: 'EUR',
  amazon_de: 'EUR',
  amazon_com: 'USD',
  amazon_uk: 'GBP',
  amazon_fr: 'EUR',
}

const REGION_LABELS = {
  bol: 'bol.com',
  amazon_de: 'Amazon.de',
  amazon_com: 'Amazon.com',
  amazon_uk: 'Amazon.co.uk',
  amazon_fr: 'Amazon.fr',
}

export function countryToRegion(countryCode) {
  return COUNTRY_TO_REGION[countryCode?.toUpperCase()] || 'amazon_com'
}

export function regionCurrency(region) {
  return REGION_CURRENCY[region] || 'EUR'
}

export function regionLabel(region) {
  return REGION_LABELS[region] || 'Amazon.com'
}

export function formatPrice(price, currency) {
  const formatter = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : currency === 'GBP' ? 'en-GB' : 'nl-NL', {
    style: 'currency',
    currency,
  })
  return formatter.format(price)
}

export const ALL_COUNTRIES = [
  { code: 'NL', name: 'Nederland' },
  { code: 'BE', name: 'België' },
  { code: 'DE', name: 'Deutschland' },
  { code: 'AT', name: 'Österreich' },
  { code: 'CH', name: 'Schweiz' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IE', name: 'Ireland' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
]
