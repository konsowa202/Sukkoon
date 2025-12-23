import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'
import { createGoogleMeetLink } from '@/lib/google-meet'

// POST /api/google-meet/create - Create Google Meet link
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { doctorEmail, patientEmail, startTime, duration, summary } = await request.json()

    if (!doctorEmail || !patientEmail || !startTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const meetLink = await createGoogleMeetLink({
      doctorEmail,
      patientEmail,
      startTime: new Date(startTime),
      duration: duration || 60,
      summary: summary || 'Therapy Session - Sukoon'
    })

    if (!meetLink) {
      return NextResponse.json(
        { error: 'Failed to create Meet link' },
        { status: 500 }
      )
    }

    return NextResponse.json({ meetLink })
  } catch (error: any) {
    console.error('Create Meet link error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

