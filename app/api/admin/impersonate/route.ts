import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest, signToken } from '@/lib/jwt'
import { supabaseServer, useSupabase } from '@/lib/db'

// POST /api/admin/impersonate - Admin login as doctor
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

        const { userId } = await request.json()
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        if (!useSupabase || !supabaseServer) {
            return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 })
        }

        // Verify user exists and is a doctor
        const { data: targetUser, error } = await supabaseServer
            .from('users')
            .select('id, email, role')
            .eq('id', userId)
            .single()

        if (error || !targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        if (targetUser.role !== 'doctor') {
            return NextResponse.json({ error: 'Can only impersonate doctors' }, { status: 400 })
        }

        // Generate new token for the target doctor
        const impersonationToken = signToken({
            userId: targetUser.id,
            email: targetUser.email,
            role: 'doctor'
        })

        return NextResponse.json({
            token: impersonationToken,
            message: `Impersonating ${targetUser.email}`
        })
    } catch (error: any) {
        console.error('Impersonation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
