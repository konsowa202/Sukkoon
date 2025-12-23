import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyToken } from "@/lib/jwt"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
    const token = req.headers.get("authorization")?.replace("Bearer ", "")
    const payload = token ? verifyToken(token) : null

    if (!payload) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { code, appointmentId } = await req.json()

    if (!code || !appointmentId) {
        return NextResponse.json({ error: "Code and Appointment ID are required" }, { status: 400 })
    }

    // 1. Get Promo Code
    const { data: promo, error: promoError } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", code.toUpperCase())
        .eq("is_active", true)
        .single()

    if (promoError || !promo) {
        return NextResponse.json({ error: "Invalid or expired promo code" }, { status: 404 })
    }

    // 2. Check Expiry
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
        return NextResponse.json({ error: "Promo code has expired" }, { status: 400 })
    }

    // 3. Check Usage
    if (promo.current_uses >= promo.max_uses) {
        return NextResponse.json({ error: "Promo code usage limit reached" }, { status: 400 })
    }

    // 4. Check Doctor Restriction
    if (promo.doctor_id) {
        const { data: apt, error: aptError } = await supabase
            .from("appointments")
            .select("doctor_id")
            .eq("id", appointmentId)
            .single()

        if (aptError || !apt) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
        }

        if (apt.doctor_id !== promo.doctor_id) {
            return NextResponse.json({ error: "This promo code is not valid for this doctor" }, { status: 400 })
        }
    }

    return NextResponse.json({
        id: promo.id,
        discount_percent: promo.discount_percent,
        message: "Promo code applied successfully"
    })
}
