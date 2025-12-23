import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'
import { createUser } from '@/lib/auth'

// POST /api/admin/doctors - Create a new doctor (Admin Only)
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

        if (!useSupabase || !supabaseServer) {
            return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 })
        }

        const body = await request.json()
        const { email, password, name, phone, specialization, bio, priceOnline, priceOffline, experience, gender, languages, city, location } = body

        if (!email || !password || !name || !phone) {
            return NextResponse.json({ error: 'Email, password, name, and phone are required' }, { status: 400 })
        }

        // 1. Create User
        const newUser = await createUser(email, password, name, 'doctor', phone)
        if (!newUser) {
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
        }

        // 2. Create Doctor Profile
        const { data: doctor, error: doctorError } = await supabaseServer
            .from('doctors')
            .insert({
                user_id: newUser.id,
                specialization: specialization || '',
                bio: bio || '',
                price_online: Number(priceOnline) || 0,
                price_offline: Number(priceOffline) || 0,
                experience: Number(experience) || 0,
                gender: gender || 'male',
                languages: languages || ['Arabic', 'English'],
                city: city || '',
                location: location || '',
                is_verified: true // Admin-created doctors are verified by default
            })
            .select()
            .single()

        if (doctorError) {
            // Cleanup user if doctor profile creation fails
            await supabaseServer.from('users').delete().eq('id', newUser.id)
            return NextResponse.json({ error: `Failed to create doctor profile: ${doctorError.message}` }, { status: 400 })
        }

        return NextResponse.json({
            message: 'Doctor created successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                phone: newUser.phone
            },
            doctor
        })
    } catch (error: any) {
        console.error('Admin create doctor error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
