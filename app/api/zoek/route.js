import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Regel-gebaseerde fallback: merk + categorie → motortype
// Dekt 90%+ van de gevallen correct zonder externe API
const MERK_REGELS = {
  // 4-takt merken (grasmaaiers)
  honda: { grasmaaier: '4-takt', default: '4-takt' },
  stiga: { grasmaaier: '4-takt', default: '4-takt' },
  mountfield: { grasmaaier: '4-takt', default: '4-takt' },
  cobra: { grasmaaier: '4-takt', default: '4-takt' },
  mtd: { grasmaaier: '4-takt', default: '4-takt' },
  // Gemengde merken
  husqvarna: { grasmaaier: '4-takt', kettingzaag: '2-takt', bosmaaier: '2-takt', bladblazer: '2-takt', default: '2-takt' },
  stihl: { grasmaaier: '4-takt', kettingzaag: '2-takt', bosmaaier: '2-takt', bladblazer: '2-takt', default: '2-takt' },
  makita: { grasmaaier: '4-takt', kettingzaag: '2-takt', bosmaaier: '2-takt', bladblazer: '2-takt', default: '2-takt' },
  echo: { grasmaaier: '4-takt', kettingzaag: '2-takt', bosmaaier: '2-takt', bladblazer: '2-takt', default: '2-takt' },
  bosch: { grasmaaier: '4-takt', default: '4-takt' },
  flymo: { grasmaaier: '4-takt', default: '4-takt' },
}

// Categorie keywords in de zoekopdracht
const CATEGORIE_KEYWORDS = {
  grasmaaier: 'grasmaaier',
  maaier: 'grasmaaier',
  lawnmower: 'grasmaaier',
  rasenmäher: 'grasmaaier',
  kettingzaag: 'kettingzaag',
  chainsaw: 'kettingzaag',
  kettensäge: 'kettingzaag',
  bosmaaier: 'bosmaaier',
  trimmer: 'bosmaaier',
  motorsense: 'bosmaaier',
  bladblazer: 'bladblazer',
  blower: 'bladblazer',
  gebläse: 'bladblazer',
  generator: 'generator',
}

// Mengverhoudingen per merk (2-takt)
const MENGVERHOUDING = {
  stihl: '50:1',
  husqvarna: '50:1',
  makita: '50:1',
  echo: '50:1',
  default: '50:1'
}

function detecteerCategorie(tekst) {
  const lower = tekst.toLowerCase()
  for (const [keyword, categorie] of Object.entries(CATEGORIE_KEYWORDS)) {
    if (lower.includes(keyword)) return categorie
  }
  return null
}

function regelFallback(invoer) {
  const woorden = invoer.toLowerCase().split(' ')
  const merk = woorden[0]
  const categorie = detecteerCategorie(invoer)
  
  const merkRegels = MERK_REGELS[merk]
  let motortype = 'onbekend'
  
  if (merkRegels) {
    motortype = categorie && merkRegels[categorie] 
      ? merkRegels[categorie] 
      : merkRegels.default
  } else if (categorie) {
    // Geen bekend merk maar wel categorie
    motortype = ['kettingzaag', 'bosmaaier', 'bladblazer'].includes(categorie) 
      ? '2-takt' 
      : '4-takt'
  }

  const mengverhouding = motortype === '2-takt' 
    ? (MENGVERHOUDING[merk] || MENGVERHOUDING.default)
    : null

  const adviezen = {
    '4-takt': 'Vul gewone benzine (Euro 95 of hoger) in het brandstoftankje. Geen menging met olie nodig — de motor heeft een aparte oliekar.',
    '2-takt': `Meng benzine met 2-takt olie in verhouding ${mengverhouding || '50:1'}. Gebruik altijd verse benzine en goede 2-takt olie voor de beste motorprestaties.`,
    'onbekend': 'Controleer het typeplaatje op je machine of de handleiding voor de juiste brandstofspecificatie.'
  }

  return {
    motortype,
    categorie: categorie || 'onbekend',
    mengverhouding,
    e10_geschikt: motortype === '4-takt' ? true : false,
    brandstof_advies: adviezen[motortype],
    betrouwbaarheid: merkRegels ? 'hoog' : (categorie ? 'middel' : 'laag')
  }
}

export async function GET(request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim().toLowerCase()
  const taal = searchParams.get('taal') || 'nl'

  if (!q) {
    return NextResponse.json({ error: 'Geen zoekopdracht' }, { status: 400 })
  }

  const woorden = q.split(' ')
  const merk = woorden[0]
  const model = woorden.slice(1).join(' ')

  // 1. DETECTEER OF INVOER EEN CATEGORIE BEVAT
  const categorieMatch = detecteerCategorie(q)
  
  // 1a. ZOEK OP MERK + CATEGORIE (bijv. "makita bladblazer")
  let machines = null
  if (merk && categorieMatch) {
    const { data } = await supabase
      .from('machines')
      .select('*')
      .ilike('merk', `%${merk}%`)
      .eq('categorie', categorieMatch)
      .limit(5)
    machines = data
  }

  // 1b. ZOEK OP MERK + MODELNUMMER (bijv. "honda hrg 416")  
  if (!machines || machines.length === 0) {
    let query = supabase.from('machines').select('*')
    if (model && !categorieMatch) {
      query = query.ilike('merk', `%${merk}%`).ilike('modelnummer', `%${model}%`)
    } else if (!categorieMatch) {
      query = query.or(`merk.ilike.%${merk}%,modelnummer.ilike.%${merk}%`)
    }
    const { data } = await query.limit(5)
    if (data && data.length > 0) machines = data
  }

  // 2. MEERDERE TREFFERS → suggesties teruggeven
  if (machines && machines.length > 1 && (!model || categorieMatch)) {
    await supabase.from('zoekopdrachten').insert({ invoer: q, gevonden: true, taal })
    return NextResponse.json({
      gevonden: true,
      bron: 'database',
      type: 'suggesties',
      suggesties: machines.map(m => ({
        id: m.id,
        merk: m.merk,
        modelnummer: m.modelnummer,
        categorie: m.categorie,
        motortype: m.motortype
      }))
    })
  }

  // 3. EXACTE TREFFER → volledig resultaat
  if (machines && machines.length === 1) {
    const machine = machines[0]
    const { data: producten } = await supabase
      .from('producten').select('*')
      .eq('motortype', machine.motortype).eq('markt', taal)
      .order('kwaliteit', { ascending: true })

    await supabase.from('zoekopdrachten').insert({ invoer: q, gevonden: true, taal })
    return NextResponse.json({
      gevonden: true,
      bron: 'database',
      type: 'resultaat',
      machine,
      producten: producten || []
    })
  }

  // 4. NIET GEVONDEN → regel-gebaseerde fallback
  const fallback = regelFallback(q)
  await supabase.from('zoekopdrachten').insert({ invoer: q, gevonden: fallback.motortype !== 'onbekend', taal })

  if (fallback.motortype === 'onbekend') {
    return NextResponse.json({ gevonden: false, invoer: q })
  }

  const { data: producten } = await supabase
    .from('producten').select('*')
    .eq('motortype', fallback.motortype).eq('markt', taal)
    .order('kwaliteit', { ascending: true })

  return NextResponse.json({
    gevonden: true,
    bron: 'schatting',
    type: 'resultaat',
    machine: {
      merk: woorden[0],
      modelnummer: woorden.slice(1).join(' ') || null,
      categorie: fallback.categorie,
      motortype: fallback.motortype,
      mengverhouding: fallback.mengverhouding,
      e10_geschikt: fallback.e10_geschikt
    },
    brandstof_advies: fallback.brandstof_advies,
    betrouwbaarheid: fallback.betrouwbaarheid,
    producten: producten || []
  })
}
