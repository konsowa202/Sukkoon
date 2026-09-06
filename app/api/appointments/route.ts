import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'
import { createGoogleMeetLink } from '@/lib/google-meet'

// GET /api/appointments - Get appointments for current user
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

    // Require Supabase in production
    if (!useSupabase || !supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase.' },
        { status: 503 }
      )
    }
    let query = supabaseServer
      .from('appointments')
      .select(`
          *,
          patient:patient_id (id, name, email),
          doctor:doctor_id (
            id,
            users:user_id (id, name, email),
            specialization,
            location,
            city,
            google_maps_link
          ),
          payments (id, status),
          reviews (id),
          request_type,
          request_message
        `)
      .order('date', { ascending: true })
      .order('time', { ascending: true })

    // Filter based on role
    if (payload.role === 'patient') {
      query = query.eq('patient_id', payload.userId)
    } else if (payload.role === 'doctor') {
      // Get doctor id from user_id
      const { data: doctorData } = await supabaseServer
        .from('doctors')
        .select('id')
        .eq('user_id', payload.userId)
        .single()

      if (doctorData) {
        query = query.eq('doctor_id', doctorData.id)
      } else {
        return NextResponse.json([])
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch appointments', details: error.message },
        { status: 500 }
      )
    }

    // Transform data
    const appointments = data?.map((a: any) => ({
      id: a.id,
      patientId: a.patient_id,
      patientName: a.patient?.name || 'Unknown',
      doctorId: a.doctor_id,
      doctorName: a.request_type === 'easy_book' ? 'فريق سكون (سيتم تحديد أخصائي)' : (a.doctor?.users?.name || 'Dr. Unknown'),
      date: a.date,
      time: a.request_type === 'easy_book' && a.time === '00:00:00' ? 'سيتم تحديده لاحقاً' : (a.time ? a.time.substring(0, 5) : ''),
      type: a.type,
      status: a.status,
      service: a.service || 'Consultation',
      notes: a.notes,
      meetLink: a.meet_link,
      location: a.doctor?.location,
      city: a.doctor?.city,
      googleMapsLink: a.doctor?.google_maps_link,
      payments: a.payments || [],
      isRated: (a.reviews && a.reviews.length > 0) || false,
      request_type: a.request_type,
      request_message: a.request_message
    })) || []

    return NextResponse.json(appointments)
  } catch (error: any) {
    console.error('Get appointments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/appointments - Create new appointment
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

    // Require Supabase in production
    if (!useSupabase || !supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase.' },
        { status: 503 }
      )
    }

    // Allow any authenticated user to book (admin, doctor, or patient)
    const { doctorId, date, time, type, service, patientName } = await request.json()

    if (!doctorId || !date || !time || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Prevent double-booking: Check if doctor has another appointment at the same slot
    const { data: existingAppt, error: checkError } = await supabaseServer
      .from('appointments')
      .select('id, status')
      .eq('doctor_id', doctorId)
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled')
      .maybeSingle()

    if (checkError) {
      console.error('Check booking error:', checkError)
    }

    if (existingAppt) {
      return NextResponse.json(
        { error: 'This doctor already has an appointment scheduled for this time slot. Please choose another time.' },
        { status: 409 }
      )
    }

    // Get doctor details for Meet link
    let doctorEmail = ''
    let patientEmail = payload.email
    // Get doctor user email
    const { data: doctorData } = await supabaseServer
      .from('doctors')
      .select(`
          users:user_id (email)
        `)
      .eq('id', doctorId)
      .single()

    if (doctorData?.users) {
      doctorEmail = (doctorData.users as any).email
    }

    // Create Jitsi Meet link if online
    let meetLink = null

    if (type === 'online') {
      // Jitsi links will be our internal /meet/[id] page
      // We'll set this to the ID of the appointment which we'll have after insertion
      // For now we set it correctly in the insert
    }

    // Create appointment
    const { data, error } = await supabaseServer
      .from('appointments')
      .insert({
        patient_id: patientName ? null : payload.userId,
        patient_name: patientName || null,
        doctor_id: doctorId,
        date,
        time,
        type,
        status: patientName ? 'completed' : 'pending',
        service: service || 'Consultation',
        meet_link: type === 'online' ? '/meet/REF' : null
      })
      .select(`
          *,
          patient:patient_id (id, name, email),
          doctor:doctor_id (
            id,
            users:user_id (id, name, email),
            specialization
          )
        `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Update the meet_link with the actual ID if it's online
    if (data.type === 'online') {
      const internalLink = `/meet/${data.id}`
      await supabaseServer
        .from('appointments')
        .update({ meet_link: internalLink })
        .eq('id', data.id)

      data.meet_link = internalLink
    }

    // Transform response
    const appointment = {
      id: data.id,
      patientId: data.patient_id,
      patientName: data.patient_name || (data.patient as any)?.name || 'Unknown',

      doctorId: data.doctor_id,
      doctorName: ((data.doctor as any)?.users as any)?.name || 'Dr. Unknown',
      date: data.date,
      time: data.time,
      type: data.type,
      status: data.status,
      service: data.service,
      meetLink: data.meet_link
    }

    return NextResponse.json(appointment, { status: 201 })
  } catch (error: any) {
    console.error('Create appointment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

