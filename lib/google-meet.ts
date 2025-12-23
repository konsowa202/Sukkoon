import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

// Google OAuth configuration
const clientId = process.env.GOOGLE_CLIENT_ID || ''
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || ''
const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'

// Create OAuth2 client
export const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri)

// Scopes needed for Google Calendar and Meet
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
]

export function getAuthUrl(): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: GOOGLE_SCOPES,
    prompt: 'consent'
  })
}

export async function getTokensFromCode(code: string) {
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)
  return tokens
}

export async function setCredentials(refreshToken: string) {
  oauth2Client.setCredentials({
    refresh_token: refreshToken
  })
}

export interface CreateMeetingOptions {
  doctorEmail: string
  patientEmail: string
  startTime: Date
  duration?: number // in minutes
  summary?: string
}

export async function createGoogleMeetLink(options: CreateMeetingOptions): Promise<string | null> {
  try {
    // Get refresh token from environment (admin's Google account)
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
    if (!refreshToken) {
      console.warn('GOOGLE_REFRESH_TOKEN not set, using manual link generation')
      // Return a generated Meet link manually
      return generateManualMeetLink()
    }
    
    setCredentials(refreshToken)
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    
    const { startTime, duration = 60, doctorEmail, patientEmail, summary = 'Therapy Session - Sukoon' } = options
    
    const endTime = new Date(startTime.getTime() + duration * 60000)
    
    const event = {
      summary,
      description: 'Mental health consultation session via Sukoon platform',
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'Africa/Cairo',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Africa/Cairo',
      },
      attendees: [
        { email: doctorEmail },
        { email: patientEmail }
      ],
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 15 } // 15 minutes before
        ]
      }
    }
    
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    })
    
    const meetLink = response.data.conferenceData?.entryPoints?.[0]?.uri || null
    
    if (!meetLink) {
      // Fallback to manual link
      return generateManualMeetLink()
    }
    
    return meetLink
  } catch (error: any) {
    console.error('Error creating Google Meet link:', error.message)
    // Fallback to manual link generation
    return generateManualMeetLink()
  }
}

// Fallback: Generate a Google Meet link manually
function generateManualMeetLink(): string {
  // Google Meet allows creating links manually
  // Format: https://meet.google.com/xxx-xxxx-xxx
  // For now, return a placeholder that can be replaced manually
  const randomCode = Math.random().toString(36).substring(2, 15)
  return `https://meet.google.com/new?authuser=0` // Admin will need to create and update
}

// Alternative: Create a reusable Meet link
export async function createReusableMeetLink(doctorId: string): Promise<string> {
  // This can be stored in doctor profile for reuse
  return generateManualMeetLink()
}

