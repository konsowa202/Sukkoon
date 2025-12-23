import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { appointmentId, rating, comment } = body

        if (!appointmentId || !rating) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload || payload.role !== 'patient') {
            return NextResponse.json({ error: 'Only patients can submit reviews' }, { status: 403 })
        }

        if (!useSupabase || !supabaseServer) {
            // Mock success
            return NextResponse.json({ success: true, message: 'Review submitted (Mock)' })
        }

        // Get appointment details to ensure patient owns it and get doctor_id
        const { data: appointment, error: apptError } = await supabaseServer
            .from('appointments')
            .select('patient_id, doctor_id, status')
            .eq('id', appointmentId)
            .single()

        if (apptError || !appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
        }

        if (appointment.patient_id !== payload.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        if (appointment.status !== 'completed') {
            return NextResponse.json({ error: 'Can only rate completed sessions' }, { status: 400 })
        }

        // Insert review
        const { data: review, error: reviewError } = await supabaseServer
            .from('reviews')
            .insert({
                appointment_id: appointmentId,
                patient_id: payload.userId,
                doctor_id: appointment.doctor_id,
                rating,
                comment
            })
            .select()
            .single()

        if (reviewError) {
            if (reviewError.code === '23505') { // Unique constraint
                return NextResponse.json({ error: 'You have already rated this session' }, { status: 400 })
            }
            return NextResponse.json({ error: reviewError.message }, { status: 500 })
        }

        return NextResponse.json(review, { status: 201 })
    } catch (error: any) {
        console.error('Review submission error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
