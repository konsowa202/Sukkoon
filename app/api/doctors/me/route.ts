import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

export async function GET(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'doctor') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        if (!useSupabase || !supabaseServer) {
            return NextResponse.json(
                { error: 'Database not configured' },
                { status: 503 }
            )
        }

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
            .eq('user_id', payload.userId)
            .single()

        if (error || !data) {
            return NextResponse.json(
                { error: 'Doctor profile not found' },
                { status: 404 }
            )
        }

        const doctor = {
            id: data.id,
            userId: data.user_id,
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
            phone: data.users?.phone || "",
            isVerified: data.is_verified
        }

        return NextResponse.json(doctor)
    } catch (error: any) {
        console.error('Get profile error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
