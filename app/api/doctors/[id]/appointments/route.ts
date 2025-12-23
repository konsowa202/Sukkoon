import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'

// GET /api/doctors/[id]/appointments - Get public appointment slots for a doctor
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const resolvedParams = await Promise.resolve(params)
        const { id } = resolvedParams

        if (!useSupabase || !supabaseServer) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
        }

        // Get appointments that are not cancelled
        const { data, error } = await supabaseServer
            .from('appointments')
            .select('date, time')
            .eq('doctor_id', id)
            .not('status', 'eq', 'cancelled')

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json(data || [])
    } catch (error: any) {
        console.error('Get doctor appointments error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
