"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { type Appointment } from "@/lib/fallback-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MapPin, LogOut, MessageCircle, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ChatWindow } from "@/components/chat-window"
import { RatingDialog } from "@/components/rating-dialog"

import { Skeleton } from "@/components/ui/skeleton"
import { HeaderNav } from "@/components/header-nav"

export default function PatientDashboard() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [activeChat, setActiveChat] = useState<Appointment | null>(null)
  const [ratingAppointment, setRatingAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user) {
      fetchAppointments()
    }
  }, [user])

  useEffect(() => {
    if (mounted && !isLoading && (!user || user.role !== "patient")) {
      router.push("/login")
    }
  }, [user, isLoading, router, mounted])

  const fetchAppointments = async () => {
    try {
      if (typeof window === 'undefined') return

      const token = localStorage.getItem('sukoon_token')
      const response = await fetch('/api/appointments', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      } else {
        setAppointments([])
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSession = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this session?")) return

    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      })

      if (response.ok) {
        fetchAppointments()
      } else {
        alert("Failed to cancel session")
      }
    } catch (error) {
      console.error("Cancel error:", error)
      alert("An error occurred")
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        if (newStatus === 'completed') {
          const appt = appointments.find(a => a.id === id)
          if (appt) setRatingAppointment(appt)
        }
        fetchAppointments()
      } else {
        alert("Failed to update status")
      }
    } catch (error) {
      console.error("Update error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Image
          src="/images/whatsapp-20image-202025-12-03-20at-201.jpeg"
          alt="Loading..."
          width={240}
          height={80}
          className="animate-pulse h-20 w-auto dark:invert-0 invert"
        />
      </div>
    )
  }

  if (isLoading || !user || user.role !== "patient") {
    return null
  }

  const upcomingAppointments = appointments.filter((a) => a.status === "upcoming" || a.status === "confirmed" || a.status === "pending")
  const pastAppointments = appointments.filter((a) => a.status === "completed")

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <p className="text-muted-foreground">Manage your appointments and health journey</p>
            </div>
            <Button asChild>
              <Link href="/patient/search">Find a Doctor</Link>
            </Button>
          </div>

          {/* Upcoming Appointments */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {loading ? (
                <>
                  <Skeleton className="h-[200px] w-full" />
                  <Skeleton className="h-[200px] w-full" />
                </>
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                        <p className="text-sm text-muted-foreground">{appointment.service}</p>
                      </div>
                      <Badge>{appointment.type}</Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>

                    {appointment.status === 'pending' && (
                      <div className="flex flex-col gap-2">
                        {(() => {
                          const hasPayment = (appointment as any).payments && (appointment as any).payments.length > 0;
                          const isPaymentPending = hasPayment && (appointment as any).payments.some((p: any) => p.status === 'pending');

                          if (isPaymentPending) {
                            return (
                              <>
                                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white" disabled>
                                  Payment Under Review
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 bg-transparent"
                                  onClick={() => handleCancelSession(appointment.id)}
                                >
                                  Cancel Request
                                </Button>
                              </>
                            );
                          }

                          return (
                            <>
                              <Button className="w-full" asChild>
                                <Link href={`/patient/appointment/${appointment.id}/payment`}>
                                  Complete Payment
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 bg-transparent"
                                onClick={() => handleCancelSession(appointment.id)}
                              >
                                Cancel Session
                              </Button>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {appointment.status !== 'pending' && (
                      <div className="space-y-2">
                        {appointment.type === "online" && (
                          <Button
                            className="w-full"
                            onClick={() => {
                              if ((appointment as any).meetLink) {
                                window.open((appointment as any).meetLink, '_blank')
                              } else {
                                alert('Meet link will be available soon')
                              }
                            }}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Join Meeting
                          </Button>
                        )}
                        {appointment.type === "offline" && (
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => {
                              if ((appointment as any).googleMapsLink) {
                                window.open((appointment as any).googleMapsLink, '_blank')
                              } else if ((appointment as any).location) {
                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${(appointment as any).location}, ${(appointment as any).city || ''}`)}`, '_blank')
                              } else {
                                alert('Location not set by doctor')
                              }
                            }}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            View Location
                          </Button>
                        )}

                        <Button
                          variant="secondary"
                          className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                          onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                        >
                          Mark as Finished
                        </Button>

                        <div className="flex gap-2">
                          {(appointment.status === 'confirmed' || appointment.status === 'upcoming') && (
                            <Button
                              variant="secondary"
                              className="flex-1 gap-2 border-primary/20 hover:border-primary/40 bg-primary/5 text-primary"
                              onClick={() => setActiveChat(appointment)}
                            >
                              <MessageCircle className="w-4 h-4" />
                              Chat
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 bg-transparent"
                            onClick={() => handleCancelSession(appointment.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center md:col-span-2 border-dashed">
                  <p className="text-muted-foreground mb-4">You have no upcoming appointments</p>
                  <Button asChild variant="outline">
                    <Link href="/patient/search">Book your first appointment</Link>
                  </Button>
                </Card>
              )}
            </div>
          </div>

          {/* Past Appointments */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
            <div className="space-y-3">
              {loading ? (
                <>
                  <Skeleton className="h-[80px] w-full" />
                  <Skeleton className="h-[80px] w-full" />
                </>
              ) : pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <Card key={appointment.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{appointment.doctorName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {appointment.date} • {appointment.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {!(appointment as any).isRated && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 border-primary/20 hover:border-primary/40 bg-primary/5 text-primary"
                            onClick={() => setRatingAppointment(appointment)}
                          >
                            <Star className="w-4 h-4 fill-primary/10" />
                            Rate Doctor
                          </Button>
                        )}
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No past appointments recorded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeChat && (
        <Dialog open={!!activeChat} onOpenChange={(open) => !open && setActiveChat(null)}>
          <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
            <DialogTitle className="sr-only">Chat with Doctor</DialogTitle>
            <ChatWindow
              appointmentId={activeChat.id}
              recipientName={activeChat.doctorName}
              recipientRole="doctor"
              onClose={() => setActiveChat(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {ratingAppointment && (
        <RatingDialog
          isOpen={!!ratingAppointment}
          onClose={() => setRatingAppointment(null)}
          appointmentId={ratingAppointment.id}
          doctorName={ratingAppointment.doctorName}
          onSuccess={() => {
            fetchAppointments()
            setRatingAppointment(null)
          }}
        />
      )}
    </div>
  )
}
