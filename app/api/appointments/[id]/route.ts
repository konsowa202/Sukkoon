import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

// PATCH /api/appointments/[id] - Update appointment details
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const resolvedParams = await Promise.resolve(params)
        const token = getTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const body = await request.json()
        const { status, meetLink, notes, requestType, requestMessage, request_type, request_message } = body

        const finalRequestType = requestType || request_type
        const finalRequestMessage = requestMessage || request_message

        if (!useSupabase || !supabaseServer) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
        }

        // 1. Get current appointment to check permissions
        const { data: appointment, error: fetchError } = await supabaseServer
            .from('appointments')
            .select('*, doctor:doctor_id(user_id)')
            .eq('id', resolvedParams.id)
            .single()

        if (fetchError || !appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
        }

        // Check permissions: Admin, the patient, or the doctor
        const isAdmin = payload.role === 'admin'
        const isPatient = payload.role === 'patient' && payload.userId === appointment.patient_id
        const isDoctor = payload.role === 'doctor' && payload.userId === (appointment.doctor as any)?.user_id

        if (!isAdmin && !isPatient && !isDoctor) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Prepare update data
        const updateData: any = {}

        // Admins can update everything
        if (isAdmin) {
            if (status) updateData.status = status
            if (meetLink !== undefined) updateData.meet_link = meetLink
            if (notes !== undefined) updateData.notes = notes
        }
        // Doctors can update status (to completed/cancelled) and meeting link
        else if (isDoctor) {
            if (status && ['completed', 'cancelled'].includes(status)) updateData.status = status
            if (meetLink !== undefined) updateData.meet_link = meetLink
            if (notes !== undefined) updateData.notes = notes
            if (finalRequestType) updateData.request_type = finalRequestType
            if (finalRequestMessage) updateData.request_message = finalRequestMessage
        }
        // Patients can only cancel
        else if (isPatient) {
            if (status === 'cancelled') updateData.status = status
            if (finalRequestType) updateData.request_type = finalRequestType
            if (finalRequestMessage) updateData.request_message = finalRequestMessage
        }
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: 'Nothing to update or no permission for these fields' }, { status: 200 })
        }

        const { data, error } = await supabaseServer
            .from('appointments')
            .update(updateData)
            .eq('id', resolvedParams.id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Update appointment error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
