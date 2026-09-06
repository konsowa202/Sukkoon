"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useLanguage } from "./language-context"

export type CountryCode = "EG" | "GULF" | "EU" | "OTHER"

export interface LocationContextType {
  countryCode: CountryCode
  currency: string
  formatPrice: (basePriceEgp: number, specialization?: string) => string
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

// Helper to determine the pricing region based on IP country code
const getPricingRegion = (isoCode: string): CountryCode => {
  const gulfCountries = ["SA", "AE", "QA", "KW", "BH", "OM"]
  const euCountries = [
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", 
    "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", 
    "RO", "SK", "SI", "ES", "SE", "GB", "CH", "NO", "US", "CA", "AU"
  ]
  
  if (isoCode === "EG") return "EG"
  if (gulfCountries.includes(isoCode)) return "GULF"
  if (euCountries.includes(isoCode)) return "EU"
  return "OTHER"
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [countryCode, setCountryCode] = useState<CountryCode>("EG")
  const [currency, setCurrency] = useState("EGP")
  const { language } = useLanguage()
  const isAr = language === "ar"

  useEffect(() => {
    // Check if we already have it in localStorage
    const storedRegion = localStorage.getItem("sukoon_pricing_region") as CountryCode | null
    const storedCurrency = localStorage.getItem("sukoon_currency")
    
    if (storedRegion && storedCurrency) {
      setCountryCode(storedRegion)
      setCurrency(storedCurrency)
    } else {
      // Fetch from a free IP location API
      fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(data => {
          if (data && data.country_code) {
            const region = getPricingRegion(data.country_code)
            let curr = "EGP"
            
            if (region === "GULF") curr = "SAR" // Standardizing on SAR or we could use USD
            if (region === "EU" || region === "OTHER") curr = "USD"
            
            setCountryCode(region)
            setCurrency(curr)
            
            localStorage.setItem("sukoon_pricing_region", region)
            localStorage.setItem("sukoon_currency", curr)
          }
        })
        .catch(err => {
          console.error("Failed to fetch location:", err)
        })
    }
  }, [])

  // The formatPrice function ensures minimums and applies regional multipliers
  const formatPrice = (basePriceEgp: number, specialization: string = ""): string => {
    // 1. Enforce minimums as requested by user
    let adjustedBasePrice = basePriceEgp
    const isPsychiatrist = specialization.toLowerCase().includes("psychiatrist") || specialization.toLowerCase().includes("طبيب") || specialization.toLowerCase().includes("طبيب نفسي")
    
    // Therapist minimum = 450, Psychiatrist minimum = 650
    if (isPsychiatrist) {
      adjustedBasePrice = Math.max(adjustedBasePrice, 650)
    } else {
      // Therapist or default minimum
      adjustedBasePrice = Math.max(adjustedBasePrice, 450)
    }

    // 2. Apply regional pricing
    if (countryCode === "EG") {
      return `${adjustedBasePrice} ${isAr ? "جنيه مصري" : "EGP"}`
    } else if (countryCode === "GULF") {
      // Convert EGP to SAR (roughly 1 SAR = 13 EGP, but we apply a premium multiplier for Gulf)
      // Let's assume a premium multiplier of 2x for Gulf in base value, then convert to SAR
      // Example: 450 EGP -> 900 EGP equivalent -> ~150 SAR
      const gulfPriceSar = Math.round((adjustedBasePrice * 1.5) / 13 / 5) * 5 // Round to nearest 5
      return `${gulfPriceSar} ${isAr ? "ريال سعودي" : "SAR"}`
    } else {
      // EU / US / OTHER
      // Convert EGP to USD (roughly 1 USD = 50 EGP, applying premium)
      const euPriceUsd = Math.round((adjustedBasePrice * 1.5) / 50 / 5) * 5 // Round to nearest 5
      return `$${euPriceUsd}`
    }
  }

  return (
    <LocationContext.Provider value={{ countryCode, currency, formatPrice }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}
