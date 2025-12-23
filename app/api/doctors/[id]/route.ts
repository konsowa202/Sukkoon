import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

// GET /api/doctors/[id] - Get doctor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Require Supabase
    if (!useSupabase || !supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase.' },
        { status: 503 }
      )
    }

    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams
    const { data, error } = await supabaseServer
      .from('doctors')
      .select(`
          *,
          users:user_id (
            id,
            name,
            email,
            phone
          )
        `)
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      )
    }

    // Transform to match expected format
    const doctor = {
      id: data.id,
      name: data.users?.name || 'Dr. Unknown',
      specialization: data.specialization,
      bio: data.bio,
      image: data.image_url || '/placeholder.svg',
      rating: parseFloat(data.rating) || 0,
      reviewCount: data.review_count || 0,
      priceOnline: data.price_online,
      priceOffline: data.price_offline,
      experience: data.experience || 0,
      gender: data.gender,
      languages: data.languages || [],
      availability: data.availability || {},
      consultationType: data.consultation_type,
      location: data.location,
      city: data.city,
      googleMapsLink: data.google_maps_link,
      phone: data.users?.phone || ""
    }

    return NextResponse.json(doctor)
  } catch (error: any) {
    console.error('Get doctor error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/doctors/[id] - Update doctor
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const token = getTokenFromRequest(request)

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Require Supabase
    if (!useSupabase || !supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase.' },
        { status: 503 }
      )
    }

    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams

    // Check if the doctor exists and get user_id
    const { data: existingDoctor, error: fetchError } = await supabaseServer
      .from('doctors')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingDoctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    // Authorization: Admin or the doctor themselves
    const isOwner = payload.role === 'doctor' && payload.userId === existingDoctor.user_id
    const isAdmin = payload.role === 'admin'

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, ...doctorFields } = body

    // 1. Update name and image in users table if provided
    const userUpdateFields: any = {}
    if (name) userUpdateFields.name = name
    if (doctorFields.phone) userUpdateFields.phone = doctorFields.phone
    if (doctorFields.image) userUpdateFields.image_url = doctorFields.image

    if (Object.keys(userUpdateFields).length > 0) {
      const { error: userUpdateError } = await supabaseServer
        .from('users')
        .update(userUpdateFields)
        .eq('id', existingDoctor.user_id)

      if (userUpdateError) {
        console.error('User update error:', userUpdateError)
      }
    }

    // Transform fields to match DB column names if necessary
    const dbFields: any = {}
    if (doctorFields.specialization !== undefined) dbFields.specialization = doctorFields.specialization
    if (doctorFields.bio !== undefined) dbFields.bio = doctorFields.bio
    if (doctorFields.image !== undefined) dbFields.image_url = doctorFields.image
    if (doctorFields.priceOnline !== undefined) dbFields.price_online = doctorFields.priceOnline
    if (doctorFields.priceOffline !== undefined) dbFields.price_offline = doctorFields.priceOffline
    if (doctorFields.experience !== undefined) dbFields.experience = doctorFields.experience
    if (doctorFields.gender !== undefined) dbFields.gender = doctorFields.gender
    if (doctorFields.languages !== undefined) dbFields.languages = doctorFields.languages
    if (doctorFields.availability !== undefined) dbFields.availability = doctorFields.availability
    if (doctorFields.consultationType !== undefined) dbFields.consultation_type = doctorFields.consultationType
    if (doctorFields.location !== undefined) dbFields.location = doctorFields.location
    if (doctorFields.city !== undefined) dbFields.city = doctorFields.city
    if (doctorFields.googleMapsLink !== undefined) dbFields.google_maps_link = doctorFields.googleMapsLink

    // Only allow admin to update verification status
    if (isAdmin && doctorFields.isVerified !== undefined) {
      dbFields.is_verified = doctorFields.isVerified
    }

    // 2. Update doctor table
    if (Object.keys(dbFields).length > 0) {
      const { data, error } = await supabaseServer
        .from('doctors')
        .update(dbFields)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json(data)
    }

    return NextResponse.json({ message: 'Success (no doctor fields updated)' })
  } catch (error: any) {
    console.error('Update doctor error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/doctors/[id] - Delete doctor (Admin Only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Require Supabase
    if (!useSupabase || !supabaseServer) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams

    // Get doctor to find the user_id
    const { data: doctor, error: fetchError } = await supabaseServer
      .from('doctors')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
    }

    // 1. Find all appointments for this doctor
    const { data: appointments } = await supabaseServer
      .from('appointments')
      .select('id')
      .eq('doctor_id', id)

    if (appointments && appointments.length > 0) {
      const appointmentIds = appointments.map(a => a.id)

      // 2. Delete messages for these appointments
      await supabaseServer
        .from('messages')
        .delete()
        .in('appointment_id', appointmentIds)

      // 3. Delete the appointments
      await supabaseServer
        .from('appointments')
        .delete()
        .in('id', appointmentIds)
    }

    // 4. Delete the user record. Cascading will delete the doctor record.
    const { error: deleteError } = await supabaseServer
      .from('users')
      .delete()
      .eq('id', doctor.user_id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Doctor deleted successfully' })
  } catch (error: any) {
    console.error('Delete doctor error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

