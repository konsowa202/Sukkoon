import { NextRequest, NextResponse } from 'next/server'
import { getAuthUrl } from '@/lib/google-meet'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

// GET /api/auth/google/authorize - Start OAuth flow
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Only doctors can connect Google Calendar
    if (payload.role !== 'doctor') {
      return NextResponse.json(
        { error: 'Only doctors can connect Google Calendar' },
        { status: 403 }
      )
    }

    // Generate auth URL with state to identify the doctor
    const state = `doctor:${payload.userId}`
    const authUrl = getAuthUrl() + `&state=${encodeURIComponent(state)}`

    return NextResponse.json({ authUrl })
  } catch (error: any) {
    console.error('Google authorize error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

