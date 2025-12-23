import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'
// Removed fallback data import - using Supabase only

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const appointmentId = searchParams.get('appointmentId')

        if (!appointmentId) {
            return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 })
        }

        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        // Require Supabase
        if (!useSupabase || !supabaseServer) {
            return NextResponse.json(
                { error: 'Database not configured. Please set up Supabase.' },
                { status: 503 }
            )
        }

        // Verify user participates in this appointment
        const { data: appointment, error: apptError } = await supabaseServer
            .from('appointments')
            .select('patient_id, doctor:doctor_id(user_id)')
            .eq('id', appointmentId)
            .single()

        if (apptError || !appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
        }

        // Only allow patients, doctors involved, or admins
        const isParticipant =
            appointment.patient_id === payload.userId ||
            (appointment.doctor as any)?.user_id === payload.userId ||
            payload.role === 'admin'

        if (!isParticipant) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { data: messages, error } = await supabaseServer
            .from('messages')
            .select('*')
            .eq('appointment_id', appointmentId)
            .order('created_at', { ascending: true })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(messages)
    } catch (error: any) {
        console.error('Fetch messages error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { appointmentId, content, fileUrl, fileName, fileType } = body

        if (!appointmentId || (!content && !fileUrl)) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        // Require Supabase
        if (!useSupabase || !supabaseServer) {
            return NextResponse.json(
                { error: 'Database not configured. Please set up Supabase.' },
                { status: 503 }
            )
        }

        // Security check for POST
        const { data: appointment, error: apptError } = await supabaseServer
            .from('appointments')
            .select('patient_id, doctor:doctor_id(user_id)')
            .eq('id', appointmentId)
            .single()

        if (apptError || !appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
        }

        const isParticipant =
            appointment.patient_id === payload.userId ||
            (appointment.doctor as any)?.user_id === payload.userId ||
            payload.role === 'admin'

        if (!isParticipant) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { data, error } = await supabaseServer
            .from('messages')
            .insert({
                appointment_id: appointmentId,
                sender_id: payload.userId,
                content: content || '',
                file_url: fileUrl,
                file_name: fileName,
                file_type: fileType
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Send message error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
