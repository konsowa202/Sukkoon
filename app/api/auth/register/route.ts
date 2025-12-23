import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/auth'
import { signToken } from '@/lib/jwt'
import { supabaseServer, useSupabase } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, phone } = await request.json()

    if (!email || !password || !name || !role || !phone) {
      return NextResponse.json(
        { error: 'All fields including phone number are required' },
        { status: 400 }
      )
    }

    if (role !== 'doctor' && role !== 'patient') {
      return NextResponse.json(
        { error: 'Invalid role. Must be doctor or patient' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists (email or phone)
    const { supabaseServer, useSupabase } = await import('@/lib/db')
    if (!useSupabase || !supabaseServer) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 503 })
    }

    const { data: existingUser } = await supabaseServer
      .from('users')
      .select('id, email, phone')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .single()

    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Phone number'
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 409 }
      )
    }

    // Create user
    const newUser = await createUser(email, password, name, role, phone)

    if (!newUser) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Create doctor profile if role is doctor
    if (role === 'doctor' && useSupabase && supabaseServer) {
      await supabaseServer
        .from('doctors')
        .insert({
          user_id: newUser.id,
          specialization: '',
          bio: '',
          price_online: 0,
          consultation_type: 'both',
          is_verified: false
        })
    }

    const { password_hash, ...userWithoutPassword } = newUser
    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    })

    const response = NextResponse.json({
      user: userWithoutPassword,
      token
    })

    // Set cookie
    response.cookies.set('sukoon_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

