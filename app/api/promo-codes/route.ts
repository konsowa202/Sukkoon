import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyToken } from "@/lib/jwt"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
    const token = req.headers.get("authorization")?.replace("Bearer ", "")
    const payload = token ? verifyToken(token) : null

    if (!payload || payload.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
        .from("promo_codes")
        .select("*, doctor:doctor_id(name)")
        .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
    const token = req.headers.get("authorization")?.replace("Bearer ", "")
    const payload = token ? verifyToken(token) : null

    if (!payload || payload.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { code, discount_percent, doctor_id, max_uses, expires_at } = body

    const { data, error } = await supabase
        .from("promo_codes")
        .insert([
            {
                code: code.toUpperCase(),
                discount_percent,
                doctor_id: doctor_id || null,
                max_uses: max_uses || 100,
                expires_at: expires_at || null,
            },
        ])
        .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data[0])
}
