import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { patientName, phone, type, service, request_type, request_message } = await request.json()

    if (!useSupabase || !supabaseServer) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    // Since this is a quick request, we need a dummy doctor to satisfy schema if it's required
    const { data: firstDoctor } = await supabaseServer
      .from('doctors')
      .select('id')
      .limit(1)
      .single()

    // Create a pending appointment request
    const { data, error } = await supabaseServer
      .from('appointments')
      .insert({
        patient_name: patientName,
        doctor_id: firstDoctor?.id || null, // Fallback to null if no doctors exist
        date: new Date().toISOString().split('T')[0], // Today's date
        time: 'TBD',
        type: type || 'online',
        status: 'pending',
        service: service || 'Consultation',
        request_type: request_type || 'easy_book',
        request_message: `${request_message || 'Quick request'}\nPhone: ${phone}`
      })
      .select()
      .single()

    if (error) {
      console.error('Quick request error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Quick request server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
