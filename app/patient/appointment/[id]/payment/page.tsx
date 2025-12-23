"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HeaderNav } from "@/components/header-nav"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { CreditCard, Building, Smartphone, Upload, Loader2 } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const appointmentId = Array.isArray(params.id) ? params.id[0] : (params.id as string)
  const { user, isLoading: authLoading } = useAuth()
  const { t } = useLanguage()

  const [selectedMethod, setSelectedMethod] = useState<'bank_transfer' | 'vodafone_cash' | 'instapay' | null>(null)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofUrl, setProofUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [appointment, setAppointment] = useState<any>(null)
  const [amount, setAmount] = useState<number>(0)
  const [originalAmount, setOriginalAmount] = useState<number>(0)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromoId, setAppliedPromoId] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [promoError, setPromoError] = useState<string | null>(null)
  const [applyingPromo, setApplyingPromo] = useState(false)

  useEffect(() => {
    fetchAppointment()
  }, [appointmentId])

  const fetchAppointment = async () => {
    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch(`/api/appointments`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      if (response.ok) {
        const appointments = await response.json()
        const apt = appointments.find((a: any) => a.id === appointmentId)
        if (apt) {
          setAppointment(apt)
          // Get doctor to get price
          const doctorResponse = await fetch(`/api/doctors/${apt.doctorId}`)
          if (doctorResponse.ok) {
            const doctor = await doctorResponse.json()
            const basePrice = apt.type === 'online' ? doctor.priceOnline : doctor.priceOffline
            setAmount(basePrice)
            setOriginalAmount(basePrice)
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch appointment:', error)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('File must be an image')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // Increased to 10MB
      setError('File size must be less than 10MB')
      return
    }

    // 1. Immediate Base64 preview and fallback
    const reader = new FileReader()
    reader.onloadend = () => {
      setProofUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
    setProofFile(file)

    setUploading(true)
    setError(null)

    try {
      const token = localStorage.getItem('sukoon_token')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'payment-proofs')
      formData.append('bucket', 'payment-proofs')

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        // 2. If upload succeeded, use the cloud URL (better performance)
        setProofUrl(data.url)
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error: any) {
      console.error("Storage upload failed, using Base64 fallback:", error)
      // Keep the Base64 from step 1
      // We don't show a destructive error because Base64 will work
    } finally {
      setUploading(false)
    }
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return
    setApplyingPromo(true)
    setPromoError(null)
    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ code: promoCode, appointmentId })
      })

      const data = await response.json()
      if (response.ok) {
        const discount = Math.round((originalAmount * data.discount_percent) / 100)
        setDiscountAmount(discount)
        setAmount(originalAmount - discount)
        setAppliedPromoId(data.id)
      } else {
        setPromoError(data.error)
      }
    } catch (err) {
      setPromoError('Failed to validate promo code')
    } finally {
      setApplyingPromo(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method')
      return
    }

    if (!proofUrl && !proofFile) {
      setError('Please upload payment proof')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('sukoon_token')

      // Upload file if not uploaded yet
      let finalProofUrl = proofUrl
      if (!finalProofUrl && proofFile) {
        const formData = new FormData()
        formData.append('file', proofFile)
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: formData
        })
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          finalProofUrl = uploadData.url
        }
      }

      // Create payment
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          appointmentId,
          amount,
          method: selectedMethod,
          proofImageUrl: finalProofUrl,
          promo_code_id: appliedPromoId,
          original_amount: originalAmount,
          discount_amount: discountAmount
        })
      })

      if (response.ok) {
        router.push('/patient/dashboard?payment=success')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to submit payment')
      }
    } catch (error: any) {
      setError('Failed to submit payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const paymentMethods = [
    // Bank transfer disabled for now
    // {
    //   id: 'bank_transfer' as const,
    //   name: 'Bank Transfer',
    //   icon: Building,
    //   details: 'Transfer to Account: 1234567890 - Bank: CIB'
    // },
    {
      id: 'vodafone_cash' as const,
      name: 'Vodafone Cash',
      icon: Smartphone,
      details: 'Send to Number: 01006119365'
    },
    {
      id: 'instapay' as const,
      name: 'InstaPay',
      icon: CreditCard,
      details: 'Transfer to Number: 01102553741'
    }
  ]

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'patient')) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  if (authLoading || !user || user.role !== 'patient') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav showAuth={false} />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Payment</h1>
            <p className="text-muted-foreground">
              Complete payment for your appointment
            </p>
          </div>

          {appointment && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-medium">{appointment.doctorName}</p>
              <p className="text-sm text-muted-foreground">
                {appointment.date} at {appointment.time} - {appointment.type === 'online' ? 'Online' : 'In-Person'}
              </p>
              <p className="text-lg font-bold text-primary mt-2">
                Amount: {amount} {t('currency.egp')}
                {discountAmount > 0 && (
                  <span className="text-sm font-normal text-muted-foreground line-through ml-2">
                    {originalAmount}
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Label>Promo Code (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter code"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                disabled={!!appliedPromoId}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleApplyPromo}
                disabled={applyingPromo || !!appliedPromoId || !promoCode}
              >
                {applyingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : appliedPromoId ? 'Applied' : 'Apply'}
              </Button>
            </div>
            {promoError && <p className="text-xs text-destructive">{promoError}</p>}
            {appliedPromoId && <p className="text-xs text-green-500">Promo code applied!</p>}
          </div>

          <div className="space-y-4">
            <Label>Payment Method</Label>
            <div className="grid gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 border rounded-lg text-left hover:border-primary transition ${selectedMethod === method.id ? 'border-primary bg-primary/5' : ''
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <div className="flex-1">
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.details}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <div className="w-5 h-5 rounded-full bg-primary" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Payment Proof (Screenshot)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="proof-upload"
                disabled={uploading}
              />
              <label
                htmlFor="proof-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </>
                ) : proofUrl || proofFile ? (
                  <>
                    <Upload className="w-8 h-8 text-primary" />
                    <p className="text-sm font-medium">File uploaded successfully</p>
                    <p className="text-xs text-muted-foreground">{proofFile?.name}</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Click to upload screenshot</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  </>
                )}
              </label>
            </div>
            {proofUrl && (
              <img src={proofUrl} alt="Proof" className="max-w-full h-auto rounded-lg border" />
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full"
            size="lg"
            disabled={loading || uploading || !selectedMethod || (!proofUrl && !proofFile)}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Payment'
            )}
          </Button>
        </Card>
      </div>
    </div>
  )
}

