import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. Please login first.' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token. Please login again.' }, { status: 401 })
    }

    const { phone, type, service, request_type, request_message, amount, proofUrl, paymentMethod } = await request.json()

    if (!useSupabase || !supabaseServer) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    // Insert the appointment linked to the real logged-in patient
    const { data: apptData, error: apptError } = await supabaseServer
      .from('appointments')
      .insert({
        patient_id: payload.userId,
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

    if (apptError) {
      console.error('Quick request appointment error:', apptError)
      return NextResponse.json({ error: apptError.message }, { status: 400 })
    }

    // Create payment record using the uploaded proof
    if (apptData && apptData.id) {
       const { error: paymentError } = await supabaseServer.from('payments').insert({
          appointment_id: apptData.id,
          amount: amount || 0,
          status: 'pending',
          method: paymentMethod || 'vodafone_cash',
          proof_image_url: proofUrl || null
       })
       
       if(paymentError) {
           console.error('Quick request payment error:', paymentError)
           // We don't fail the whole request, but we log it.
       }
    }

    return NextResponse.json(apptData, { status: 201 })
  } catch (error: any) {
    console.error('Quick request server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
