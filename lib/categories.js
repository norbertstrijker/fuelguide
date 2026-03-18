export const CATEGORIES = {
  grasmaaiers: {
    slugs: { nl: 'grasmaaiers', de: 'rasenmaeher', en: 'lawn-mowers' },
    names: { nl: 'Grasmaaiers', de: 'Rasenmäher', en: 'Lawn Mowers' },
  },
  kettingzagen: {
    slugs: { nl: 'kettingzagen', de: 'kettensaegen', en: 'chainsaws' },
    names: { nl: 'Kettingzagen', de: 'Kettensägen', en: 'Chainsaws' },
  },
  bladblazers: {
    slugs: { nl: 'bladblazers', de: 'laubblaesers', en: 'leaf-blowers' },
    names: { nl: 'Bladblazers', de: 'Laubbläser', en: 'Leaf Blowers' },
  },
  heggenscharen: {
    slugs: { nl: 'heggenscharen', de: 'heckenscheren', en: 'hedge-trimmers' },
    names: { nl: 'Heggenscharen', de: 'Heckenscheren', en: 'Hedge Trimmers' },
  },
  bosmaaiers: {
    slugs: { nl: 'bosmaaiers', de: 'freischneider', en: 'brush-cutters' },
    names: { nl: 'Bosmaaiers', de: 'Freischneider', en: 'Brush Cutters' },
  },
  generatoren: {
    slugs: { nl: 'generatoren', de: 'generatoren', en: 'generators' },
    names: { nl: 'Generatoren', de: 'Generatoren', en: 'Generators' },
  },
}

export function categoryFromSlug(slug, locale) {
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    if (cat.slugs[locale] === slug) return key
  }
  return null
}

export function categorySlug(key, locale) {
  return CATEGORIES[key]?.slugs[locale] || null
}

export function categoryName(key, locale) {
  return CATEGORIES[key]?.names[locale] || null
}

export function allCategoryKeys() {
  return Object.keys(CATEGORIES)
}

export function machineSlug(merk, modelnummer) {
  return `${merk}-${modelnummer}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}
