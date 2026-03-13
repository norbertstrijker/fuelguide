import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

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

  let query = supabase.from('machines').select('*')

  if (model) {
    query = query
      .ilike('merk', `%${merk}%`)
      .ilike('modelnummer', `%${model}%`)
  } else {
    query = query.or(`merk.ilike.%${merk}%,modelnummer.ilike.%${merk}%`)
  }

  const { data: machines, error } = await query.limit(3)

  // Log zoekopdracht
  await supabase.from('zoekopdrachten').insert({
    invoer: q,
    gevonden: machines && machines.length > 0,
    taal: taal
  })

  // ✅ DATABASE TREFFER
  if (!error && machines && machines.length > 0) {
    const machine = machines[0]
    const { data: producten } = await supabase
      .from('producten')
      .select('*')
      .eq('motortype', machine.motortype)
      .eq('markt', taal)
      .order('kwaliteit', { ascending: true })

    return NextResponse.json({
      gevonden: true,
      bron: 'database',
      machine,
      producten: producten || []
    })
  }

  // 🤖 AI FALLBACK
  try {
    const prompt = `Je bent een expert in buitenmachines en motoren. Een gebruiker zoekt brandstofadvies voor: "${q}"

Geef een JSON antwoord (alleen JSON, geen uitleg erbuiten) met deze structuur:
{
  "merk": "gevonden merk of null",
  "modelnummer": "model of null", 
  "categorie": "grasmaaier|kettingzaag|bosmaaier|bladblazer|generator|onbekend",
  "motortype": "2-takt|4-takt|elektrisch|onbekend",
  "mengverhouding": "50:1 of 25:1 of null (alleen bij 2-takt)",
  "e10_geschikt": true|false|null,
  "brandstof_advies": "Korte uitleg in het Nederlands wat voor brandstof deze machine gebruikt",
  "betrouwbaarheid": "hoog|middel|laag"
}

Regels:
- Grasmaaiers zijn bijna altijd 4-takt (geen mengverhouding)
- Kettingzagen, bosmaaiers, bladblazers zijn vrijwel altijd 2-takt (mix 50:1)
- Honda, Stihl, Husqvarna grasmaaiers: altijd 4-takt
- Als je het merk/model niet kent: schat op basis van categorie
- E10: moderne machines (na 2010) zijn vaak geschikt, oudere niet`

    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const aiData = await aiResponse.json()
    const rawText = aiData.content?.[0]?.text || '{}'
    
    // Strip eventuele markdown code blocks
    const cleanText = rawText.replace(/```json|```/g, '').trim()
    const aiResult = JSON.parse(cleanText)

    // Haal producten op op basis van AI motortype
    let producten = []
    if (aiResult.motortype && aiResult.motortype !== 'onbekend') {
      const { data } = await supabase
        .from('producten')
        .select('*')
        .eq('motortype', aiResult.motortype)
        .eq('markt', taal)
        .order('kwaliteit', { ascending: true })
      producten = data || []
    }

    return NextResponse.json({
      gevonden: true,
      bron: 'ai',
      machine: {
        merk: aiResult.merk || woorden[0],
        modelnummer: aiResult.modelnummer || woorden.slice(1).join(' '),
        categorie: aiResult.categorie || 'onbekend',
        motortype: aiResult.motortype || 'onbekend',
        mengverhouding: aiResult.mengverhouding || null,
        e10_geschikt: aiResult.e10_geschikt ?? null
      },
      brandstof_advies: aiResult.brandstof_advies,
      betrouwbaarheid: aiResult.betrouwbaarheid,
      producten
    })

  } catch (aiError) {
    return NextResponse.json({ gevonden: false, invoer: q })
  }
}
