import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyToken } from "@/lib/jwt"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const token = req.headers.get("authorization")?.replace("Bearer ", "")
    const payload = token ? verifyToken(token) : null

    if (!payload || payload.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
        .from("promo_codes")
        .delete()
        .eq("id", params.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
