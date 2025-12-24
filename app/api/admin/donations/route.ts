import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

export async function GET(request: NextRequest) {
    try {
        const token = getTokenFromRequest(request)
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        if (!useSupabase || !supabaseServer) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
        }

        const { data, error } = await supabaseServer
            .from('donations')
            .select(`
        *,
        doctors (
          id,
          users:user_id (
            name
          )
        )
      `)
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('List admin donations error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
