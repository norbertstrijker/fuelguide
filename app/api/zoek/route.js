import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request) {
  // Lazy init: binnen de functie zodat env vars beschikbaar zijn op request-time
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
