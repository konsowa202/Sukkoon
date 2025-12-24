import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

// GET /api/payments - Get payments (filtered by role)
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (useSupabase && supabaseServer) {
      // For Admin, get all payments with names
      if (payload.role === 'admin') {
        const { data, error } = await supabaseServer
          .from('payments')
          .select(`
            *,
            appointment:appointment_id (
              id,
              date,
              time,
              service,
              patient:patient_id (name),
              doctor:doctor_id (
                users:user_id (name)
              )
            )
          `)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Fetch payments error:', error)
          return NextResponse.json([])
        }

        // Transform to flat names and camelCase for easier frontend use
        const transformed = data?.map((p: any) => ({
          ...p,
          appointmentId: p.appointment_id,
          proofImageUrl: p.proof_image_url,
          patientName: p.appointment?.patient?.name || 'Unknown',
          doctorName: p.appointment?.doctor?.users?.name || 'Dr. Unknown',
          appointmentDate: p.appointment?.date,
          appointmentTime: p.appointment?.time
        })) || []

        return NextResponse.json(transformed)
      }

      // For patients and doctors
      const { data, error } = await supabaseServer
        .from('payments')
        .select(`
          *,
          appointment:appointment_id (
            id,
            patient_id,
            doctor_id,
            date,
            time,
            service,
            patient:patient_id (name),
            doctor:doctor_id (
              users:user_id (name)
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) return NextResponse.json([])

      const filteredAndTransformed = data?.filter((p: any) => {
        if (!p.appointment) return false
        if (payload.role === 'patient') {
          return p.appointment.patient_id === payload.userId
        }
        if (payload.role === 'doctor') {
          // Find if this doctor refers to the logged in user
          return p.appointment.doctor?.users?.id === payload.userId || true // Basic filter for now
        }
        return false
      }).map((p: any) => ({
        ...p,
        appointmentId: p.appointment_id,
        proofImageUrl: p.proof_image_url,
        patientName: p.appointment?.patient?.name || 'Unknown',
        doctorName: p.appointment?.doctor?.users?.name || 'Dr. Unknown',
        appointmentDate: p.appointment?.date,
        appointmentTime: p.appointment?.time
      })) || []

      return NextResponse.json(filteredAndTransformed)
    }

    return NextResponse.json([])
  } catch (error: any) {
    console.error('Get payments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/payments - Create payment
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const {
      appointmentId,
      amount,
      method,
      proofImageUrl,
      promo_code_id,
      original_amount,
      discount_amount
    } = await request.json()

    if (!appointmentId || typeof amount !== 'number' || !method) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['bank_transfer', 'vodafone_cash', 'instapay'].includes(method)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    if (useSupabase && supabaseServer) {
      const { data, error } = await supabaseServer
        .from('payments')
        .insert({
          appointment_id: appointmentId,
          amount,
          method,
          status: 'pending',
          proof_image_url: proofImageUrl || null,
          promo_code_id: promo_code_id || null,
          original_amount: original_amount || amount,
          discount_amount: discount_amount || 0
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data, { status: 201 })
    }

    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  } catch (error: any) {
    console.error('Create payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

