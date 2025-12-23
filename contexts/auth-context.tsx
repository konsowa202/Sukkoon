"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"

type UserRole = "admin" | "doctor" | "patient" | null

interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, role: "doctor" | "patient", phone: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Note: Mock users removed - now using Supabase only

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // CRITICAL: All hooks must be called before any conditional logic
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Helper function to set cookie (for client-side fallback)
  const setCookie = (name: string, value: string, days: number) => {
    if (typeof document !== 'undefined') {
      const expires = new Date()
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
      const isProduction = window.location.hostname.includes('suukoon.com')
      const secure = isProduction ? '; Secure' : ''
      const domain = isProduction ? '; domain=.suukoon.com' : ''
      document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax${secure}${domain}`
    }
  }

  // Always provide default context value to prevent hooks order issues
  const defaultContextValue = {
    user: null,
    login: async () => false,
    register: async () => false,
    logout: async () => { },
    isLoading: true
  }

  // Sync function to load user from localStorage
  const syncUserFromStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem("sukoon_user")
        const storedToken = localStorage.getItem("sukoon_token")
        
        // Sync cookie with localStorage token
        if (storedToken) {
          setCookie('sukoon_token', storedToken, 7)
        }
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          // Only update if user actually changed to avoid unnecessary re-renders
          setUser(prevUser => {
            if (JSON.stringify(prevUser) !== JSON.stringify(parsedUser)) {
              console.log('[Auth] Synced user from localStorage:', parsedUser.email)
              return parsedUser
            }
            return prevUser
          })
        } else {
          // Only clear if user was set before
          setUser(prevUser => {
            if (prevUser !== null) {
              console.log('[Auth] No user in localStorage, clearing auth state')
              return null
            }
            return prevUser
          })
        }
      } catch (e) {
        console.error('[Auth] Failed to sync from localStorage:', e)
        setUser(null)
      }
    }
  }, [])

  // Check for stored user on mount and sync regularly
  useEffect(() => {
    setMounted(true)
    syncUserFromStorage()
    setIsLoading(false)

    // Listen for storage events (when localStorage changes in other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sukoon_user') {
        syncUserFromStorage()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    // Also sync on focus (in case user navigated away and came back)
    const handleFocus = () => {
      syncUserFromStorage()
    }
    window.addEventListener('focus', handleFocus)

    // Sync on visibility change (when tab becomes visible)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncUserFromStorage()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [syncUserFromStorage])

  // Sync user state on pathname changes (navigation)
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      // Small delay to ensure localStorage is accessible after navigation
      const timeoutId = setTimeout(() => {
        syncUserFromStorage()
      }, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [mounted, pathname, syncUserFromStorage])

  const register = async (
    email: string,
    password: string,
    name: string,
    role: "doctor" | "patient",
    phone: string,
  ): Promise<boolean> => {
    console.log('[Register] Attempting registration for:', email)

    // Use API only (Supabase)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role, phone }),
      })

      if (response.ok) {
        const data = await response.json()
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
        }
        setUser(userData)
        if (typeof window !== 'undefined') {
          localStorage.setItem("sukoon_user", JSON.stringify(userData))
          if (data.token) {
            localStorage.setItem("sukoon_token", data.token)
          }
        }

        const redirectPath = role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"
        if (typeof window !== 'undefined' && data.token) {
          // Also set cookie for server-side middleware
          setCookie('sukoon_token', data.token, 7)
        }
        router.push(redirectPath)
        return true
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Registration failed' }))
        console.log('[Register] API returned error:', errorData)
        return false
      }
    } catch (error) {
      console.error('[Register] API request failed:', error)
      return false
    }
  }

  const login = async (identifier: string, password: string): Promise<boolean> => {
    console.log('[Login] Attempting login for:', identifier)

    // Use API only (Supabase)
    console.log('[Login] Using API authentication...')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })

      if (response.ok) {
        const data = await response.json()
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
        }
        setUser(userData)
        if (typeof window !== 'undefined') {
          localStorage.setItem("sukoon_user", JSON.stringify(userData))
          if (data.token) {
            localStorage.setItem("sukoon_token", data.token)
            // Also set cookie for server-side middleware
            setCookie('sukoon_token', data.token, 7)
          }
        }

        const redirectPath =
          userData.role === "admin" ? "/admin/dashboard" :
            userData.role === "doctor" ? "/doctor/dashboard" :
              "/patient/dashboard"

        // Use router.push for better navigation
        router.push(redirectPath)
        return true
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.log('[Login] API returned error:', errorData.error)
        return false
      }
    } catch (error) {
      console.log('[Login] API request failed (this is OK if no backend):', error)
      return false
    }
  }

  const logout = async () => {
    // Call API logout
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout API failed:', error)
    }

    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("sukoon_user")
      localStorage.removeItem("sukoon_token")
      // Clear cookie
      setCookie('sukoon_token', '', -1)
      router.push("/login")
    }
  }

  // Always return the same Provider structure to prevent hooks order issues
  // Use mounted state only to determine the value, not the Provider structure
  const contextValue = mounted
    ? { user, login, register, logout, isLoading }
    : { user: null, login, register, logout, isLoading: true }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
