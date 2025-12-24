import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer, useSupabase } from '@/lib/db'
import { verifyToken, getTokenFromRequest } from '@/lib/jwt'

// POST /api/upload - Upload file (payment proof)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const bucket = formData.get('bucket') as string || 'payment-proofs'

    const token = getTokenFromRequest(request)
    let payload = null
    if (token) {
      payload = verifyToken(token)
    }

    // Allow unauthenticated uploads ONLY for payment proofs
    if (!payload && bucket !== 'payment-proofs') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = payload?.userId || 'guest'
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    if (useSupabase && supabaseServer) {
      const folder = formData.get('folder') as string || 'general'
      const bucket = formData.get('bucket') as string || 'payment-proofs'

      // Refined Validation based on context
      const isImage = file.type.startsWith('image/')
      const isDocument = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ].some(type => file.type.startsWith(type))

      if (folder.includes('profile') || folder.includes('payment')) {
        if (!isImage) {
          return NextResponse.json(
            { error: 'Profile photos and payment proofs must be images (PNG, JPG, etc.)' },
            { status: 400 }
          )
        }
      } else {
        if (!isImage && !isDocument) {
          return NextResponse.json(
            { error: 'File type not supported. Please upload an image, PDF, or document.' },
            { status: 400 }
          )
        }
      }

      // Robust Sanitization for Supabase Keys
      const sanitizedOriginalName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, '_') // Keep only alphanumeric, dots, and hyphens
        .replace(/_{2,}/g, '_')          // Collapse multiple underscores

      const fileName = `${folder}/${userId}/${Date.now()}-${sanitizedOriginalName}`
      const fileBuffer = await file.arrayBuffer()

      let { data, error } = await supabaseServer.storage
        .from(bucket)
        .upload(fileName, Buffer.from(fileBuffer), {
          contentType: file.type,
          upsert: true
        })

      if (error) {
        console.error('Supabase Storage Error:', error)

        // Try to create bucket if not found (case-insensitive check)
        const errorMessage = error.message.toLowerCase()
        if (errorMessage.includes('bucket not found') || errorMessage.includes('does not exist')) {
          console.log(`Bucket ${bucket} not found, attempting to create...`)
          try {
            const { error: createError } = await supabaseServer.storage.createBucket(bucket, {
              public: true,
              fileSizeLimit: 10 * 1024 * 1024
            })

            if (!createError || createError.message.toLowerCase().includes('already exists')) {
              console.log(`Bucket ${bucket} created or already exists, retrying upload...`)
              const retry = await supabaseServer.storage
                .from(bucket)
                .upload(fileName, Buffer.from(fileBuffer), {
                  contentType: file.type,
                  upsert: true
                })
              data = retry.data
              error = retry.error
            } else {
              console.error('Failed to create bucket:', createError)
              error = createError
            }
          } catch (createCatchError: any) {
            console.error('Exception during bucket creation:', createCatchError)
            error = createCatchError
          }
        }
      }

      if (error) {
        console.error('Supabase Storage Error after retry/check:', error)
        let customMessage = error.message
        const errorMessage = error.message.toLowerCase()

        if (errorMessage.includes('bucket not found') || errorMessage.includes('does not exist')) {
          customMessage = `Storage bucket '${bucket}' not found and could not be created automatically. Please create it manually in the Supabase dashboard and set it to public.`
        } else if (errorMessage.includes('quota exceeded')) {
          customMessage = "Storage quota exceeded. Please check your Supabase plan."
        } else if (errorMessage.includes('policy')) {
          customMessage = `Storage policy violation. Please ensure the '${bucket}' bucket has public upload/read policies configured.`
        }

        return NextResponse.json(
          { error: customMessage },
          { status: 500 }
        )
      }

      // Get public URL
      const { data: { publicUrl } } = supabaseServer.storage
        .from(bucket)
        .getPublicUrl(fileName)

      return NextResponse.json({ url: publicUrl })
    }

    // Require Supabase Storage in production
    return NextResponse.json(
      { error: 'File storage not configured. Please set up Supabase Storage.' },
      { status: 503 }
    )
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

