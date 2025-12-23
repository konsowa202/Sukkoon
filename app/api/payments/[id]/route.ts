import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

// PATCH /api/payments/[id] - Update payment status (admin only)
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
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { status } = await request.json()

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    if (useSupabase && supabaseServer) {
      const updateData: any = {
        status,
        verified_at: status !== 'pending' ? new Date().toISOString() : null,
        verified_by: status !== 'pending' ? payload.userId : null
      }

      // If approved, also update appointment status to confirmed
      if (status === 'approved') {
        // Get appointment ID from payment
        const { data: payment } = await supabaseServer
          .from('payments')
          .select('appointment_id')
          .eq('id', resolvedParams.id)
          .single()

        if (payment) {
          await supabaseServer
            .from('appointments')
            .update({ status: 'confirmed' })
            .eq('id', payment.appointment_id)
        }
      }

      const { data, error } = await supabaseServer
        .from('payments')
        .update(updateData)
        .eq('id', resolvedParams.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      return NextResponse.json(data)
    }

    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 500 }
    )
  } catch (error: any) {
    console.error('Update payment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

