import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'
import { supabaseServer, useSupabase } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json()

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/Phone and password are required' },
        { status: 400 }
      )
    }

    // Require Supabase for production
    if (!useSupabase || !supabaseServer) {
      return NextResponse.json(
        { error: 'Database not configured. Please set up Supabase.' },
        { status: 503 }
      )
    }

    console.log('[API] Login attempt for:', identifier)
    const authResult = await authenticateUser(identifier, password)

    if (!authResult) {
      console.log('[API] Authentication failed for:', identifier)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('[API] Authentication successful for:', identifier, 'Role:', authResult.user.role)

    // Get doctor profile if user is a doctor
    let doctorProfile = null
    if (authResult.user.role === 'doctor') {
      const { data } = await supabaseServer
        .from('doctors')
        .select('*')
        .eq('user_id', authResult.user.id)
        .single()
      doctorProfile = data
    }

    const response = NextResponse.json({
      user: authResult.user,
      token: authResult.token,
      doctorProfile
    })

    // Set cookie
    response.cookies.set('sukoon_token', authResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

