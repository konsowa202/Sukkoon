import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        if (!useSupabase || !supabaseServer) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
        }

        const { data: doctors, error } = await supabaseServer
            .from('doctors')
            .select(`
        id,
        specialization,
        price_online,
        price_offline,
        users:user_id (
          name
        )
      `)
            .eq('is_verified', true)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        const formattedDoctors = doctors.map(d => ({
            id: d.id,
            name: d.users?.name || 'Unknown Doctor',
            specialization: d.specialization,
            priceOnline: d.price_online,
            priceOffline: d.price_offline
        }))

        return NextResponse.json(formattedDoctors)
    } catch (error: any) {
        console.error('List doctors error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
