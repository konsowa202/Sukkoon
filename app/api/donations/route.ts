import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

export async function POST(request: NextRequest) {
    try {
        if (!useSupabase || !supabaseServer) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
        }

        const body = await request.json()
        const {
            doctorId,
            type,
            amount,
            proofImageUrl,
            isAnonymous,
            donorName,
            donorEmail
        } = body

        if (!type || !amount || !proofImageUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Optional: Get donor ID from token if logged in
        const token = getTokenFromRequest(request)
        let authenticatedDonorId = null
        if (token) {
            const payload = verifyToken(token)
            if (payload) {
                authenticatedDonorId = payload.userId
            }
        }

        const { data, error } = await supabaseServer
            .from('donations')
            .insert({
                donor_id: authenticatedDonorId,
                doctor_id: doctorId || null,
                type,
                amount,
                proof_image_url: proofImageUrl,
                is_anonymous: isAnonymous || false,
                donor_name: donorName || null,
                donor_email: donorEmail || null,
                status: 'pending'
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json({ success: true, donation: data })
    } catch (error: any) {
        console.error('Create donation error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
