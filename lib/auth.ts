import bcrypt from 'bcryptjs'
import { signToken } from './jwt'
import { supabase, supabaseServer, useSupabase } from './db'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'doctor' | 'patient'
  phone?: string
  image_url?: string
  gender?: string
  date_of_birth?: string
  password_hash?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function findUserByIdentifier(identifier: string): Promise<User | null> {
  // Require Supabase
  if (!useSupabase || !supabaseServer) {
    return null
  }

  // Try email first
  const { data: emailData } = await supabaseServer
    .from('users')
    .select('*')
    .eq('email', identifier)
    .single()

  if (emailData) return emailData as User

  // Try phone if email fails
  const { data: phoneData } = await supabaseServer
    .from('users')
    .select('*')
    .eq('phone', identifier)
    .single()

  return phoneData as User || null
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return findUserByIdentifier(email)
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: 'doctor' | 'patient',
  phone?: string,
  image_url?: string
): Promise<User | null> {
  const password_hash = await hashPassword(password)

  // Require Supabase
  if (!useSupabase || !supabaseServer) {
    return null
  }

  const { data, error } = await supabaseServer
    .from('users')
    .insert({
      email,
      password_hash,
      name,
      role,
      phone,
      image_url
    })
    .select()
    .single()

  if (error) {
    console.error('[Auth] Create user error:', error)
    return null
  }
  return data as User
}

export async function authenticateUser(identifier: string, password: string): Promise<{ user: User; token: string } | null> {
  console.log('[Auth] Authenticating user:', identifier)
  const user = await findUserByIdentifier(identifier)

  if (!user) {
    console.log('[Auth] User not found:', identifier)
    return null
  }

  if (!user.password_hash) {
    console.log('[Auth] No password hash for user:', identifier)
    return null
  }

  console.log('[Auth] Verifying password for:', identifier)
  const isValid = await verifyPassword(password, user.password_hash)

  if (!isValid) {
    console.log('[Auth] Password verification failed for:', identifier)
    return null
  }

  console.log('[Auth] Password verified successfully for:', identifier)
  const { password_hash, ...userWithoutPassword } = user
  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role
  })

  return {
    user: userWithoutPassword,
    token
  }
}

