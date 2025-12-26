"use client"

import { useState, useEffect } from "react"
import { format, addDays, startOfToday } from "date-fns"
import { type Doctor } from "@/lib/fallback-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, Video, MapPin, Award } from "lucide-react"
import { HeaderNav } from "@/components/header-nav"
import { useRouter, usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function DoctorProfileClient({ doctor, doctorId, busySlotsInitial }: { doctor: Doctor, doctorId: string, busySlotsInitial: any[] }) {
    const router = useRouter()
    const pathname = usePathname()
    const languageContext = useLanguage()
    const authContext = useAuth()

    const [bookingStep, setBookingStep] = useState<"type" | "date" | "time" | null>(null)
    const [selectedType, setSelectedType] = useState<"online" | "offline" | null>(null)
    const [selectedDayName, setSelectedDayName] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [bookingLoading, setBookingLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [busySlots, setBusySlots] = useState<{ date: string, time: string }[]>(busySlotsInitial)

    const t = languageContext?.t ?? ((key: string) => key)
    const user = authContext?.user ?? null

    const handleBooking = () => {
        if (!user) {
            const message = encodeURIComponent("Please sign in to book an appointment.")
            router.push(`/login?redirect=${encodeURIComponent(pathname || '')}&message=${message}`)
            return
        }
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
        if (!selectedType || !selectedDate || !user) return
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
        } finally {
            setBookingLoading(false)
        }
    }

    const getAvailableDates = () => {
        if (!doctor.availability) return []
        const today = startOfToday()
        const dates = []
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
        const now = new Date()
        const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

        return rawSlots.filter(slot => {
            const formattedSlot = slot.includes(':') ? slot : `${slot}:00`
            const [hour, minute] = formattedSlot.split(':').map(Number)
            const slotDate = new Date(dateStr)
            slotDate.setHours(hour, minute, 0, 0)

            // 1. Check if it's at least 24 hours in the future
            if (slotDate < twentyFourHoursFromNow) return false

            // 2. Check if it's already booked
            return !busySlots.some(busy =>
                busy.date === dateStr &&
                busy.time.startsWith(formattedSlot.split(':')[0])
            )
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
                    <Card className="p-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            <img src={doctor.image || "/placeholder.svg"} alt={doctor.name} className="w-32 h-32 rounded-2xl object-cover ring-4 ring-background shadow-xl" />
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h1 className="text-3xl font-bold">{doctor.name}</h1>
                                    <p className="text-lg text-primary">{doctor.specialization}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                        <span className="font-medium">{doctor.rating}</span>
                                        <span className="text-sm text-muted-foreground">({doctor.reviewCount} reviews)</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {doctor.languages.map((lang) => <Badge key={lang} variant="secondary">{lang}</Badge>)}
                                </div>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <Award className="w-5 h-5 text-primary" />
                                        <span className="text-sm">{doctor.experience} years experience</span>
                                    </div>
                                    {showOnlineOption && <Badge variant="outline" className="gap-1"><Video className="w-3 h-3" /> Online</Badge>}
                                    {showOfflineOption && <Badge variant="outline" className="gap-1"><MapPin className="w-3 h-3" /> In-Person</Badge>}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">About</h2>
                        <p className="text-muted-foreground">{doctor.bio}</p>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Consultation Fees</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {showOnlineOption && (
                                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                    <Video className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="font-medium">Online Consultation</p>
                                        <p className="text-2xl font-bold text-primary">{doctor.priceOnline} {t("currency.egp")}</p>
                                    </div>
                                </div>
                            )}
                            {showOfflineOption && (
                                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="font-medium">In-Person Visit</p>
                                        <p className="text-2xl font-bold text-primary">{doctor.priceOffline} {t("currency.egp")}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-4">{error}</div>}
                    <Button size="lg" className="w-full text-lg" onClick={handleBooking} disabled={availableDates.length === 0}>
                        {availableDates.length === 0 ? "No Availability Currently" : "Book Appointment"}
                    </Button>
                </div>
            </div>

            {/* Dialogs */}
            <Dialog open={bookingStep === "type"} onOpenChange={(open) => !open && setBookingStep(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Select Consultation Type</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Button variant="outline" className="h-32 flex-col gap-2 bg-transparent" onClick={() => handleTypeSelect("online")}>
                            <Video className="w-8 h-8" /><p className="font-semibold">Online</p>
                            <p className="text-sm text-muted-foreground">{doctor.priceOnline} EGP</p>
                        </Button>
                        <Button variant="outline" className="h-32 flex-col gap-2 bg-transparent" onClick={() => handleTypeSelect("offline")}>
                            <MapPin className="w-8 h-8" /><p className="font-semibold">In-Person</p>
                            <p className="text-sm text-muted-foreground">{doctor.priceOffline} EGP</p>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={bookingStep === "date"} onOpenChange={(open) => !open && setBookingStep(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Select Date</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-4">
                        {availableDates.map((item) => {
                            const slots = getFilteredSlots(item.dayName, item.dateStr)
                            const isFull = slots.length === 0
                            return (
                                <Button key={item.dateStr} variant={selectedDate === item.dateStr ? "default" : "outline"}
                                    className={`h-auto py-3 px-1 flex-col gap-0.5 rounded-xl ${isFull ? 'opacity-40 pointer-events-none' : ''}`}
                                    onClick={() => !isFull && handleDateSelect(item.dayName, item.dateStr)}
                                    disabled={isFull}
                                >
                                    <span className="text-lg font-black">{format(item.date, 'dd')}</span>
                                    <span className="text-[9px] font-medium">{item.dayName.substring(0, 3)}</span>
                                </Button>
                            )
                        })}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={bookingStep === "time"} onOpenChange={(open) => !open && setBookingStep(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Select Time Slot</DialogTitle></DialogHeader>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4">
                        {availableSlots.map((slot) => {
                            const [hourStr] = slot.split(':')
                            const hour = parseInt(hourStr)
                            const isPM = hour >= 12
                            const hour12 = hour % 12 || 12
                            const displayTime = `${hour12}:00 ${isPM ? (languageContext?.language === 'ar' ? 'م' : 'PM') : (languageContext?.language === 'ar' ? 'ص' : 'AM')}`

                            return (
                                <Button
                                    key={slot}
                                    variant={selectedTime === slot ? "default" : "outline"}
                                    onClick={() => handleTimeSelect(slot)}
                                    disabled={bookingLoading}
                                    className="text-xs py-4 h-auto"
                                >
                                    {displayTime}
                                </Button>
                            )
                        })}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent className="text-center">
                    <DialogHeader><DialogTitle className="text-2xl">Booking Confirmed!</DialogTitle></DialogHeader>
                    <div className="py-6"><p>Your appointment has been successfully booked</p></div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
