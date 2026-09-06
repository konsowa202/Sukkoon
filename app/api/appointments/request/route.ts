import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'
import { sendAdminNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized. Please login first.' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token. Please login again.' }, { status: 401 })
    }

    const { phone, type, service, request_type, request_message, amount, proofUrl, paymentMethod } = await request.json()

    if (!useSupabase || !supabaseServer) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    // Insert the appointment linked to the real logged-in patient
    const { data: apptData, error: apptError } = await supabaseServer
      .from('appointments')
      .insert({
        patient_id: payload.userId,
        date: new Date().toISOString().split('T')[0], // Today's date
        time: '00:00',
        type: type || 'online',
        status: 'pending',
        service: service || 'Consultation',
        request_type: request_type || 'easy_book',
        request_message: `${request_message || 'Quick request'}\nPhone: ${phone}`
      })
      .select(`
        *,
        patient:patient_id (name, email)
      `)
      .single()

    if (apptError) {
      console.error('Quick request appointment error:', apptError)
      return NextResponse.json({ error: apptError.message }, { status: 400 })
    }

    // Create payment record using the uploaded proof
    if (apptData && apptData.id) {
       const { error: paymentError } = await supabaseServer.from('payments').insert({
          appointment_id: apptData.id,
          amount: amount || 0,
          status: 'pending',
          method: paymentMethod || 'vodafone_cash',
          proof_image_url: proofUrl || null
       })
       
       if(paymentError) {
           console.error('Quick request payment error:', paymentError)
           // We don't fail the whole request, but we log it.
       }
    }

    // Send email notification to Admin
    try {
      const patientName = apptData.patient?.name || payload.email || 'مريض';
      const emailHtml = `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #0b5c5c;">🎉 طلب حجز جديد (فريق سكون)!</h2>
          <p>أهلاً، لقد وصلك طلب حجز جلسة جديد على منصة سكون.</p>
          <hr />
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>الاسم:</strong> ${patientName}</li>
            <li><strong>رقم الهاتف:</strong> ${phone || 'غير متوفر'}</li>
            <li><strong>الخدمة المطلوبة:</strong> ${service || 'استشارة'}</li>
            <li><strong>النوع:</strong> ${type === 'online' ? 'أونلاين' : 'في العيادة'}</li>
            <li><strong>المبلغ:</strong> ${amount || 0} ج.م</li>
            <li><strong>طريقة الدفع:</strong> ${paymentMethod || 'فودافون كاش'}</li>
          </ul>
          <p>
            يرجى الدخول إلى 
            <a href="https://www.suukoon.com/admin/dashboard" style="color: #0b5c5c; font-weight: bold;">لوحة تحكم الإدارة</a> 
            لمراجعة إيصال الدفع وتأكيد الحجز.
          </p>
        </div>
      `;
      // Don't wait for email to finish sending before responding to user
      sendAdminNotification(`طلب حجز جديد من ${patientName}`, emailHtml).catch(console.error);
    } catch (e) {
      console.error('Failed to trigger email', e);
    }

    return NextResponse.json(apptData, { status: 201 })
  } catch (error: any) {
    console.error('Quick request server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
