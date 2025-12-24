import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

// GET /api/doctors - Get all doctors with optional filters
export async function GET(request: NextRequest) {
  try {
    // Require Supabase
    if (!useSupabase || !supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase.' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const specialization = searchParams.get('specialization')
    const gender = searchParams.get('gender')
    const consultationType = searchParams.get('consultationType')
    const city = searchParams.get('city')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const verified = searchParams.get('verified') // New: filter by verification status
    const adminToken = searchParams.get('admin') // For admin to see all doctors

    // Check if admin token is provided (from Authorization header)
    let isAdmin = false
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '')
      if (token) {
        const { verifyToken } = await import('@/lib/jwt')
        const payload = verifyToken(token)
        isAdmin = payload?.role === 'admin'
      }
    } catch (e) {
      // Not admin
    }

    let query = supabaseServer
      .from('doctors')
      .select(`
        *,
        users!user_id (
          id,
          name,
          email,
          phone
        )
      `)

    // Only show verified doctors unless admin or verified=false explicitly requested
    if (verified === 'false' || verified === 'pending') {
      query = query.eq('is_verified', false)
    } else if (!isAdmin) {
      query = query.eq('is_verified', true)
        .or('price_online.gt.0,price_offline.gt.0')
    }

    if (specialization && specialization !== 'all') {
      query = query.eq('specialization', specialization)
    }
    if (gender && gender !== 'all') {
      query = query.eq('gender', gender)
    }
    if (consultationType && consultationType !== 'all') {
      if (consultationType === 'both') {
        query = query.eq('consultation_type', 'both')
      } else {
        query = query.or(`consultation_type.eq.${consultationType},consultation_type.eq.both`)
      }
    }
    if (city && city !== 'all') {
      query = query.eq('city', city)
    }
    if (search) {
      query = query.or(`specialization.ilike.%${search}%,bio.ilike.%${search}%`)
    }
    if (minPrice) {
      query = query.gte('price_online', parseFloat(minPrice))
    }
    if (maxPrice) {
      query = query.lte('price_online', parseFloat(maxPrice))
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch doctors', details: error.message },
        { status: 500 }
      )
    }

    // Transform data to match expected format
    const doctors = data?.map((d: any) => ({
      id: d.id,
      userId: d.users?.id,
      name: d.users?.name || 'Dr. Unknown',
      email: d.users?.email || '',
      phone: d.users?.phone || '',
      specialization: d.specialization,
      bio: d.bio,
      image: d.image_url || '/placeholder.svg',
      rating: parseFloat(d.rating) || 0,
      reviewCount: d.review_count || 0,
      priceOnline: d.price_online,
      priceOffline: d.price_offline,
      experience: d.experience || 0,
      gender: d.gender,
      languages: d.languages || [],
      availability: d.availability || {},
      consultationType: d.consultation_type,
      location: d.location,
      city: d.city,
      commissionPercent: d.commission_percent || 10
    })) || []

    return NextResponse.json(doctors)
  } catch (error: any) {
    console.error('Get doctors error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/doctors - Create a new doctor (admin only)
export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase.' },
        { status: 503 }
      )
    }

    const body = await request.json()

    const { data, error } = await supabaseServer
      .from('doctors')
      .insert({
        user_id: body.userId,
        specialization: body.specialization,
        bio: body.bio,
        image_url: body.imageUrl,
        price_online: body.priceOnline,
        price_offline: body.priceOffline,
        experience: body.experience,
        gender: body.gender,
        languages: body.languages,
        consultation_type: body.consultationType,
        location: body.location,
        city: body.city,
        availability: body.availability || {},
        is_verified: body.isVerified || false,
        commission_percent: body.commissionPercent || 10
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Create doctor error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

