import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim().toLowerCase()
  const taal = searchParams.get('taal') || 'nl'

  if (!q) {
    return NextResponse.json({ error: 'Geen zoekopdracht' }, { status: 400 })
  }

  // Splits invoer in woorden: "honda hrg 416" → merk=honda, model=hrg 416
  const woorden = q.split(' ')
  const merk = woorden[0]
  const model = woorden.slice(1).join(' ')

  // Zoek machine in database
  let query = supabase
    .from('machines')
    .select('*')

  if (model) {
    // Merk + model opgegeven
    query = query
      .ilike('merk', `%${merk}%`)
      .ilike('modelnummer', `%${model}%`)
  } else {
    // Alleen één woord — zoek in beide velden
    query = query.or(`merk.ilike.%${merk}%,modelnummer.ilike.%${merk}%`)
  }

  const { data: machines, error } = await query.limit(3)

  // Log zoekopdracht voor data-moat
  await supabase.from('zoekopdrachten').insert({
    invoer: q,
    gevonden: machines && machines.length > 0,
    taal: taal
  })

  if (error || !machines || machines.length === 0) {
    return NextResponse.json({ gevonden: false, invoer: q })
  }

  const machine = machines[0]

  // Haal passende producten op
  const { data: producten } = await supabase
    .from('producten')
    .select('*')
    .eq('motortype', machine.motortype)
    .eq('markt', taal)
    .order('kwaliteit', { ascending: true })

  return NextResponse.json({
    gevonden: true,
    machine,
    producten: producten || []
  })
}
