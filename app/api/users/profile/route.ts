import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

// GET /api/users/profile - Get current user profile
export async function GET(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const payload = verifyToken(token)
        if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

        if (useSupabase && supabaseServer) {
            const { data, error } = await supabaseServer
                .from('users')
                .select('*')
                .eq('id', payload.userId)
                .single()

            if (error) return NextResponse.json({ error: error.message }, { status: 400 })

            // Count completed sessions
            const { count: sessionsCount } = await supabaseServer
                .from('appointments')
                .select('*', { count: 'exact', head: true })
                .eq('patient_id', payload.userId)
                .eq('status', 'completed')

            // Remove sensitive data
            const { password_hash, ...profile } = data
            return NextResponse.json({
                ...profile,
                totalSessions: sessionsCount || 0
            })
        }

        return NextResponse.json({ error: 'DB not configured' }, { status: 503 })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH /api/users/profile - Update current user profile
export async function PATCH(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const payload = verifyToken(token)
        if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

        const body = await request.json()
        const { name, phone, date_of_birth, gender, image_url } = body

        if (useSupabase && supabaseServer) {
            const { data, error } = await supabaseServer
                .from('users')
                .update({
                    name,
                    phone,
                    date_of_birth,
                    gender,
                    image_url,
                    updated_at: new Date().toISOString()
                })
                .eq('id', payload.userId)
                .select()
                .single()

            if (error) return NextResponse.json({ error: error.message }, { status: 400 })

            const { password_hash, ...profile } = data
            return NextResponse.json(profile)
        }

        return NextResponse.json({ error: 'DB not configured' }, { status: 503 })
    } catch (error: any) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
