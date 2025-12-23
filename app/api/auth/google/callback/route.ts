import { NextRequest, NextResponse } from 'next/server'
import { getTokensFromCode } from '@/lib/google-meet'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

// GET /api/auth/google/callback - OAuth callback
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // Can contain userId/doctorId

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', request.url))
    }

    // Get tokens
    const tokens = await getTokensFromCode(code)

    if (!tokens.refresh_token) {
      return NextResponse.redirect(new URL('/login?error=no_refresh_token', request.url))
    }

    // If state contains doctorId, save refresh token to doctor profile
    if (state && useSupabase && supabaseServer) {
      const [type, id] = state.split(':')
      
      if (type === 'doctor') {
        await supabaseServer
          .from('doctors')
          .update({
            google_calendar_enabled: true,
            google_refresh_token: tokens.refresh_token
          })
          .eq('user_id', id)
      }
    }

    // Redirect to success page
    return NextResponse.redirect(new URL('/doctor/profile?google_connected=true', request.url))
  } catch (error: any) {
    console.error('Google callback error:', error)
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
  }
}

