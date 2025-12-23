"use client"

import { useState, useEffect, use } from "react"
import { format, addDays, startOfToday, getDay, isAfter, parse } from "date-fns"
import { type Doctor } from "@/lib/fallback-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, Video, MapPin, Calendar, Clock, Award } from "lucide-react"
import { HeaderNav } from "@/components/header-nav"
import { useRouter, usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const pathname = usePathname()
  const languageContext = useLanguage()
  const authContext = useAuth()

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingStep, setBookingStep] = useState<"type" | "date" | "time" | null>(null)
  const [selectedType, setSelectedType] = useState<"online" | "offline" | null>(null)
  const [selectedDayName, setSelectedDayName] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busySlots, setBusySlots] = useState<{ date: string, time: string }[]>([])

  // 4. Extract values (NOT hooks - safe to extract after all hooks are called)
  const t = (languageContext && typeof languageContext.t === 'function')
    ? languageContext.t
    : ((key: string) => key)
  const user = authContext?.user ?? null
  const doctorId = resolvedParams?.id?.toString() ?? ""

  // 5. All useEffect hooks (always called in same order)
  // Fetch doctor useEffect
  useEffect(() => {
    if (!doctorId) {
      setLoading(false)
      return
    }

    const fetchDoctor = async () => {
      try {
        const [doctorRes, appointmentsRes] = await Promise.all([
          fetch(`/api/doctors/${doctorId}`),
          fetch(`/api/doctors/${doctorId}/appointments`)
        ])

        if (doctorRes.ok) {
          const data = await doctorRes.json()
          setDoctor(data)
        } else {
          setDoctor(null)
        }

        if (appointmentsRes.ok) {
          const appointmentsData = await appointmentsRes.json()
          setBusySlots(appointmentsData)
        }
      } catch (error) {
        console.error('Failed to fetch doctor details:', error)
        setDoctor(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [doctorId])

  // Debug useEffect
  useEffect(() => {
    console.log('[DoctorProfilePage] User state:', {
      user,
      userRole: user?.role,
      isPatient: user?.role === "patient",
      doctorId,
      authContextUser: authContext?.user
    })
  }, [user, doctorId, authContext])

  // NOW ALL HOOKS ARE CALLED - Safe to do early returns
  // IMPORTANT: HeaderNav uses hooks, but React handles each component's hooks separately
  // So calling HeaderNav here is safe because all our hooks are already called
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNav showAuth={false} />
        <div className="container mx-auto px-4 py-20 text-center">
          <p>Loading doctor profile...</p>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <HeaderNav showAuth={false} />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Doctor not found</h1>
          <p className="text-muted-foreground mb-6">The doctor you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/patient/search")}>Back to Search</Button>
        </div>
      </div>
    )
  }

  const handleBooking = () => {
    // Debug: Log user state
    console.log('[Booking] Current user state:', {
      user,
      userRole: user?.role,
      authContext: authContext
    })

    // Check if user is logged in (any role can book now)
    if (!user) {
      console.log('[Booking] No user found, redirecting to login')
      // Redirect to login with message
      const message = encodeURIComponent("Please sign in to book an appointment.")
      router.push(`/login?redirect=${encodeURIComponent(pathname || '')}&message=${message}`)
      return
    }

    console.log('[Booking] User logged in, proceeding with booking. Role:', user.role)
    // Clear any previous errors
    setError(null)

    if (doctor.consultationType !== "both") {
      setSelectedType(doctor.consultationType)
      setBookingStep("date")
    } else {
      setBookingStep("type")
    }
  }

  const handleTypeSelect = (type: "online" | "offline") => {
    setSelectedType(type)
    setBookingStep("date")
  }

  const handleDateSelect = (dayName: string, dateStr: string) => {
    setSelectedDayName(dayName)
    setSelectedDate(dateStr)
    setBookingStep("time")
  }

  const handleTimeSelect = async (time: string) => {
    if (!selectedType || !selectedDate) return

    // Check if user is logged in (any role can book now)
    if (!user) {
      setError("Please sign in to book an appointment")
      const redirectUrl = encodeURIComponent(pathname || '')
      router.push(`/login?redirect=${redirectUrl}&message=${encodeURIComponent("Please sign in to book an appointment.")}`)
      return
    }

    setSelectedTime(time)
    setBookingLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          doctorId,
          date: selectedDate,
          time,
          type: selectedType,
          service: 'Consultation'
        })
      })

      if (response.ok) {
        const appointmentData = await response.json()
        setBookingStep(null)
        setShowSuccess(true)
        // Redirect to payment page after booking
        setTimeout(() => {
          setShowSuccess(false)
          router.push(`/patient/appointment/${appointmentData.id}/payment`)
        }, 1500)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to book appointment')
      }
    } catch (error: any) {
      setError('Failed to book appointment. Please try again.')
      console.error('Booking error:', error)
    } finally {
      setBookingLoading(false)
    }
  }

  const DAYS_MAP: Record<string, number> = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6
  }

  const getAvailableDates = () => {
    if (!doctor.availability) return []
    const today = startOfToday()
    const dates = []

    // Generate dates for the next 14 days and check if doctor is available on those days
    for (let i = 0; i < 14; i++) {
      const date = addDays(today, i)
      const dayName = format(date, 'EEEE')
      if (doctor.availability[dayName] && doctor.availability[dayName].length > 0) {
        dates.push({
          date: date,
          dateStr: format(date, 'yyyy-MM-dd'),
          dayName: dayName,
          display: format(date, 'EEE, MMM d')
        })
      }
    }
    return dates
  }

  const availableDates = getAvailableDates()

  const getFilteredSlots = (dayName: string, dateStr: string) => {
    const rawSlots = doctor.availability?.[dayName] || []
    return rawSlots.filter(slot => {
      const formattedSlot = slot.includes(':') ? slot : `${slot}:00`
      // Check if slot is booked
      const isBooked = busySlots.some(busy =>
        busy.date === dateStr &&
        busy.time.startsWith(formattedSlot.split(':')[0]) // Match hour
      )
      return !isBooked
    })
  }

  const availableSlots = selectedDayName && selectedDate ? getFilteredSlots(selectedDayName, selectedDate) : []

  const showOnlineOption = doctor.consultationType === "online" || doctor.consultationType === "both"
  const showOfflineOption = doctor.consultationType === "offline" || doctor.consultationType === "both"

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav showAuth={false} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Doctor Profile Card */}
          <Card className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative group mx-auto md:mx-0">
                <img
                  src={doctor.image || "/placeholder.svg"}
                  alt={doctor.name}
                  className="w-32 h-32 rounded-2xl object-cover ring-4 ring-background shadow-xl scale-100 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-background" title="Available Now"></div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{doctor.name}</h1>
                  <p className="text-lg text-primary">{doctor.specialization}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">{doctor.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({doctor.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map((lang) => (
                    <Badge key={lang} variant="secondary">
                      {lang}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <span className="text-sm">{doctor.experience} years experience</span>
                  </div>
                  {showOnlineOption && (
                    <Badge variant="outline" className="gap-1">
                      <Video className="w-3 h-3" />
                      Online
                    </Badge>
                  )}
                  {showOfflineOption && (
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="w-3 h-3" />
                      In-Person
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* About */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground">{doctor.bio}</p>
          </Card>

          {showOfflineOption && doctor.location && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Clinic Location</h2>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div className="flex-1">
                  <p className="font-medium">{doctor.location}</p>
                  {doctor.city && <p className="text-sm text-muted-foreground">{doctor.city}</p>}
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-2 text-primary"
                    onClick={() => {
                      if ((doctor as any).googleMapsLink) {
                        window.open((doctor as any).googleMapsLink, '_blank')
                      } else {
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${doctor.location}, ${doctor.city || ''}`)}`, '_blank')
                      }
                    }}
                  >
                    View on Google Maps
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Pricing */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Consultation Fees</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {showOnlineOption && (
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Video className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Online Consultation</p>
                    <p className="text-2xl font-bold text-primary">
                      {doctor.priceOnline} {t("currency.egp")}
                    </p>
                  </div>
                </div>
              )}
              {showOfflineOption && (
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">In-Person Visit</p>
                    <p className="text-2xl font-bold text-primary">
                      {doctor.priceOffline} {t("currency.egp")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Book Button */}
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-4">
              {error}
              {!user && (
                <div className="mt-2">
                  <Link href={`/login?redirect=${encodeURIComponent(pathname || '')}&message=${encodeURIComponent("Only patients can book appointments. Please sign in or create an account.")}`} className="underline font-semibold">
                    Sign in here
                  </Link>
                </div>
              )}
            </div>
          )}
          <Button
            size="lg"
            className="w-full text-lg"
            onClick={handleBooking}
            disabled={availableDates.length === 0}
          >
            {availableDates.length === 0 ? "No Availability Currently" : "Book Appointment"}
          </Button>
        </div>
      </div>

      {/* Booking Dialogs */}
      {doctor.consultationType === "both" && (
        <Dialog open={bookingStep === "type"} onOpenChange={(open) => !open && setBookingStep(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Consultation Type</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                variant="outline"
                className="h-32 flex-col gap-2 bg-transparent"
                onClick={() => handleTypeSelect("online")}
              >
                <Video className="w-8 h-8" />
                <div className="text-center">
                  <p className="font-semibold">Online</p>
                  <p className="text-sm text-muted-foreground">
                    {doctor.priceOnline} {t("currency.egp")}
                  </p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-32 flex-col gap-2 bg-transparent"
                onClick={() => handleTypeSelect("offline")}
              >
                <MapPin className="w-8 h-8" />
                <div className="text-center">
                  <p className="font-semibold">In-Person</p>
                  <p className="text-sm text-muted-foreground">
                    {doctor.priceOffline} {t("currency.egp")}
                  </p>
                </div>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={bookingStep === "date"} onOpenChange={(open) => !open && setBookingStep(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Date</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-4">
            {availableDates.map((item) => {
              const slots = getFilteredSlots(item.dayName, item.dateStr)
              const isFull = slots.length === 0
              return (
                <Button
                  key={item.dateStr}
                  variant={selectedDate === item.dateStr ? "default" : "outline"}
                  className={`h-auto py-3 px-1 flex-col gap-0.5 rounded-xl transition-all ${selectedDate === item.dateStr ? 'ring-2 ring-primary ring-offset-2' : 'hover:border-primary/50'} ${isFull ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                  onClick={() => !isFull && handleDateSelect(item.dayName, item.dateStr)}
                  disabled={isFull}
                >
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/80 group-select-none">
                    {format(item.date, 'MMM')}
                  </span>
                  <span className="text-lg font-black leading-none">{format(item.date, 'dd')}</span>
                  <span className="text-[9px] font-medium opacity-80">{item.dayName.substring(0, 3)}</span>
                  {isFull && <span className="text-[8px] font-bold text-destructive">FULL</span>}
                </Button>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={bookingStep === "time"} onOpenChange={(open) => !open && setBookingStep(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Time Slot</DialogTitle>
          </DialogHeader>
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-4">
            {availableSlots.map((slot) => (
              <Button
                key={slot}
                variant={selectedTime === slot ? "default" : "outline"}
                className="h-12 text-sm font-semibold rounded-lg transition-all"
                onClick={() => handleTimeSelect(slot)}
                disabled={bookingLoading}
              >
                {slot}
              </Button>
            ))}
          </div>
          {bookingLoading && (
            <p className="text-center text-sm text-muted-foreground">Booking appointment...</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">Booking Confirmed!</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-2">
            <p>Your appointment has been successfully booked</p>
            <p className="text-sm text-muted-foreground">
              {selectedType === "online" ? "Online" : "In-Person"} • {selectedDate} • {selectedTime}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
