"use client"

import { useState, useEffect, Suspense } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Users, Calendar, LogOut, Clock, Loader2, Video, MapPin, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChatWindow } from "@/components/chat-window"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AvailabilityGrid } from "@/components/availability-grid"

interface Appointment {
  id: string
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  date: string
  time: string
  type: 'online' | 'offline'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  service?: string
  meetLink?: string
  location?: string
  city?: string
  request_type?: string
  request_message?: string
}

import { Skeleton } from "@/components/ui/skeleton"
import { HeaderNav } from "@/components/header-nav"

function DoctorDashboardContent() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<{ id: string, name: string, appointments: Appointment[] } | null>(null)
  const [doctorData, setDoctorData] = useState<any>(null)
  const [isSavingAvailability, setIsSavingAvailability] = useState(false)
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || "appointments"
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [activeChat, setActiveChat] = useState<Appointment | null>(null)
  const [activeView, setActiveView] = useState<'overview' | 'earnings' | 'patients' | 'reports'>('overview')
  const [payments, setPayments] = useState<any[]>([])
  const [isAddingPatient, setIsAddingPatient] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const [newPatientData, setNewPatientData] = useState({
    name: "",
    phone: "",
    service: "Consultation",
    type: "offline" as "online" | "offline",
    date: new Date().toISOString().split('T')[0],
    time: "10:00"
  })

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) setActiveTab(tab)
  }, [searchParams])

  useEffect(() => {
    if (mounted && !isLoading && (!user || user.role !== "doctor")) {
      router.push("/login")
    }
  }, [user, isLoading, router, mounted])

  useEffect(() => {
    if (user && user.role === 'doctor') {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('sukoon_token')
      const headers = { 'Authorization': token ? `Bearer ${token}` : '' }

      const [appointmentsRes, paymentsRes, profileRes] = await Promise.all([
        fetch('/api/appointments', { headers }),
        fetch('/api/payments', { headers }),
        fetch('/api/doctors/me', { headers })
      ])

      let profile = null
      if (profileRes.ok) {
        profile = await profileRes.json()
        setDoctorData(profile)
      }

      let appointmentData: Appointment[] = []
      if (appointmentsRes.ok) {
        appointmentData = await appointmentsRes.json()
        setAppointments(appointmentData)
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json()
        setPayments(paymentsData)
        const totalEarnings = paymentsData
          .filter((p: any) => p.status === 'approved')
          .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0)

        const commissionPercent = profile?.commissionPercent || 10
        const netEarnings = totalEarnings * (1 - commissionPercent / 100)

        const uniquePatients = new Set(appointmentData.map(a => a.patientId)).size

        setStats({
          totalEarnings,
          netEarnings,
          totalPatients: uniquePatients,
          thisMonthSessions: appointmentData.filter(a => {
            const date = new Date(a.date)
            const now = new Date()
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
          }).length,
          completedSessions: appointmentData.filter(a => a.status === 'completed').length
        })
      }
    } catch (error) {
      console.error('Failed to fetch doctor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const [stats, setStats] = useState({ totalEarnings: 0, netEarnings: 0, totalPatients: 0, thisMonthSessions: 0, completedSessions: 0 })

  const calculateCompletion = (data: any) => {
    if (!data) return 0
    const fields = [
      { key: 'specialization', weight: 15 },
      { key: 'bio', weight: 15 },
      { key: 'image', weight: 15, custom: (v: any) => v && v !== '/placeholder.svg' },
      { key: 'gender', weight: 10 },
      { key: 'city', weight: 10 },
      { key: 'languages', weight: 10, custom: (v: any) => v && v.length > 0 },
      { key: 'availability', weight: 10, custom: (v: any) => v && Object.keys(v).length > 0 },
    ]

    const type = data.consultationType || "both"
    const typeConfigs: any = {
      online: [
        { key: 'priceOnline', weight: 15, custom: (v: any) => Number(v) > 0 }
      ],
      offline: [
        { key: 'priceOffline', weight: 10, custom: (v: any) => Number(v) > 0 },
        { key: 'location', weight: 5 }
      ],
      both: [
        { key: 'priceOnline', weight: 5, custom: (v: any) => Number(v) > 0 },
        { key: 'priceOffline', weight: 5, custom: (v: any) => Number(v) > 0 },
        { key: 'location', weight: 5 }
      ]
    }

    const modeFields = typeConfigs[type] || typeConfigs.both
    const allFields = [...fields, ...modeFields]

    let score = 0
    allFields.forEach(f => {
      const val = data[f.key]
      const isValid = f.custom ? f.custom(val) : (val !== undefined && val !== null && val !== "")
      if (isValid) score += f.weight
    })
    return score
  }

  const completionScore = calculateCompletion(doctorData)

  if (isLoading || !user || user.role !== "doctor") {
    return null
  }

  const renderStatsSkeletons = () => (
    <div className="grid md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  const renderAppointmentSkeletons = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  )

  const handleUpdateAppointmentStatus = async (id: string, newStatus: string) => {
    if (newStatus === 'cancelled' && !confirm("Are you sure you want to cancel this session?")) return

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
        setSelectedAppointment(null)
        fetchDashboardData()
      } else {
        alert("Failed to update status")
      }
    } catch (error) {
      console.error("Update error:", error)
    }
  }

  const todayAppointments = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0])
  const upcomingAppointments = appointments.filter(apt =>
    apt.status === 'pending' || apt.status === 'confirmed'
  )

  const handleSaveAvailability = async () => {
    if (!doctorData) return
    setIsSavingAvailability(true)
    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch(`/api/doctors/${doctorData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ availability: doctorData.availability })
      })

      if (response.ok) {
        alert("Availability updated successfully!")
      } else {
        throw new Error("Failed to update availability")
      }
    } catch (error) {
      console.error(error)
      alert("Error saving availability")
    } finally {
      setIsSavingAvailability(false)
    }
  }

  const handleManualAddPatient = async () => {
    if (!newPatientData.name || !newPatientData.phone) {
      alert("Please provide patient name and phone")
      return
    }

    try {
      const token = localStorage.getItem('sukoon_token')
      // We simulate this by creating a special appointment entry or a guest patient
      // For now, we'll use the existing appointment API but mark it as a manual entry (maybe in notes)
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: doctorData.id,
          patientName: newPatientData.name, // The backend needs to support this or we create a guest user
          date: newPatientData.date,
          time: newPatientData.time,
          type: newPatientData.type,
          service: `${newPatientData.service} (Clinic Case)`,
          notes: `Clinic Patient: ${newPatientData.phone}`
        })
      })

      if (response.ok) {
        alert("Patient record added successfully!")
        setIsAddingPatient(false)
        fetchDashboardData()
      } else {
        const err = await response.json()
        alert(err.error || "Failed to add patient")
      }
    } catch (e) {
      console.error(e)
      alert("Error adding record")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderNav />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
              <p className="text-muted-foreground">Manage your practice and appointments</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/doctor/profile">Edit Profile</Link>
            </Button>
          </div>

          {/* Profile Completion Bar */}
          <Card className="p-6 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Profile Completion: {completionScore}%</span>
                  {completionScore < 100 && (
                    <Badge variant="destructive" className="animate-pulse">Incomplete</Badge>
                  )}
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-1000"
                    style={{ width: `${completionScore}%` }}
                  />
                </div>
              </div>
              {completionScore < 100 ? (
                <div className="text-sm text-destructive font-medium bg-destructive/5 p-3 rounded-lg border border-destructive/20">
                  ⚠️ Your profile is hidden from patients until it reaches 100%!
                </div>
              ) : (
                <div className="text-sm text-green-500 font-medium bg-green-500/5 p-3 rounded-lg border border-green-500/20">
                  ✅ Your profile is fully visible in search results.
                </div>
              )}
            </div>
          </Card>

          {/* Stats */}
          {loading ? renderStatsSkeletons() : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Card
                className={`p-6 cursor-pointer transition-all hover:shadow-md ${activeView === 'earnings' ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                onClick={() => setActiveView(activeView === 'earnings' ? 'overview' : 'earnings')}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due to you (Net)</p>
                    <p className="text-2xl font-bold">${stats.netEarnings.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Total Revenue: ${stats.totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card
                className={`p-6 cursor-pointer transition-all hover:shadow-md ${activeView === 'patients' ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                onClick={() => setActiveView(activeView === 'patients' ? 'overview' : 'patients')}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Patients</p>
                    <p className="text-2xl font-bold">{stats.totalPatients}</p>
                  </div>
                </div>
              </Card>

              <Card
                className={`p-6 cursor-pointer transition-all hover:shadow-md ${activeView === 'reports' ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                onClick={() => setActiveView(activeView === 'reports' ? 'overview' : 'reports')}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">{stats.thisMonthSessions} Sessions</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeView === 'earnings' && (
            <Card className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Earnings Details</h2>
                <Button variant="ghost" onClick={() => setActiveView('overview')}>Back to Overview</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Amount (Gross)</th>
                      <th className="text-left p-2">Your Share (Net)</th>
                      <th className="text-left p-2">Method</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr><td colSpan={4} className="text-center p-4 text-muted-foreground">No payment records found</td></tr>
                    ) : (
                      payments.map(p => (
                        <tr key={p.id} className="border-b">
                          <td className="p-2 text-sm">{new Date(p.created_at).toLocaleDateString()}</td>
                          <td className="p-2 font-medium text-muted-foreground">${Number(p.amount).toLocaleString()}</td>
                          <td className="p-2 font-bold text-green-500">${(Number(p.amount) * (1 - (doctorData?.commissionPercent || 10) / 100)).toLocaleString()}</td>
                          <td className="p-2 text-sm uppercase">{p.method.replace('_', ' ')}</td>
                          <td className="p-2">
                            <Badge variant={p.status === 'approved' ? 'default' : p.status === 'pending' ? 'secondary' : 'destructive'}>
                              {p.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeView === 'patients' && (
            <Card className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Patient List</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsAddingPatient(true)}>
                    + Add Patient
                  </Button>
                  <Button variant="ghost" onClick={() => setActiveView('overview')}>Back to Overview</Button>
                </div>
              </div>
              <div className="grid gap-4">
                {Array.from(new Set(appointments.map(a => a.patientId))).map(pid => {
                  const patientAppointments = appointments.filter(a => a.patientId === pid)
                  const pName = patientAppointments[0]?.patientName
                  return (
                    <Card key={pid} className="p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
                      <div>
                        <h3 className="font-bold">{pName}</h3>
                        <p className="text-sm text-muted-foreground">{patientAppointments.filter(a => a.doctorId === (doctorData?.id || doctorData?.doctorId)).length} Sessions with you</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedPatient({ id: pid, name: pName, appointments: patientAppointments })
                      }}>
                        View Profile
                      </Button>
                    </Card>
                  )
                })}
              </div>
            </Card>
          )}

          {activeView === 'reports' && (
            <Card className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Monthly Report</h2>
                <Button variant="ghost" onClick={() => setActiveView('overview')}>Back to Overview</Button>
              </div>
              <div className="p-4 bg-muted rounded-lg flex gap-4 items-center">
                <div>
                  <p className="text-sm font-bold">Month Analysis</p>
                  <p className="text-xs text-muted-foreground">Reviewing your performance for the current month</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold text-primary">{stats.thisMonthSessions}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Completed Sessions</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold">Growth & Suggestions</p>
                <p className="text-sm text-muted-foreground">
                  Based on your {stats.thisMonthSessions} sessions this month, you are performing {stats.thisMonthSessions > 5 ? 'excellently' : 'steadily'}.
                  Consider opening more slots in the evening to attract more patients.
                </p>
              </div>
            </Card>
          )}

          {activeView === 'overview' && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="availability">Availability</TabsTrigger>
              </TabsList>

              <TabsContent value="appointments" className="space-y-4">
                <h2 className="text-xl font-semibold">Appointments</h2>
                {loading ? renderAppointmentSkeletons() : upcomingAppointments.length === 0 ? (
                  <Card className="p-8 text-center border-dashed">
                    <p className="text-muted-foreground">No appointments scheduled</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment) => (
                      <Card key={appointment.id} className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h3 className="font-semibold">{appointment.patientName}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.service}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {appointment.time}
                              </span>
                              <Badge variant={appointment.type === "online" ? "default" : "secondary"}>
                                {appointment.type}
                              </Badge>
                            </div>
                          </div>
                          <Button onClick={() => setSelectedAppointment(appointment)}>View Details</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="availability" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Weekly Schedule</h2>
                  <Button
                    onClick={handleSaveAvailability}
                    disabled={isSavingAvailability}
                  >
                    {isSavingAvailability ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : "Save Changes"}
                  </Button>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground md:hidden">Scroll horizontally to see all days</p>
                  <div className="overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0">
                    <div className="min-w-[800px] md:min-w-0">
                      <AvailabilityGrid
                        availability={doctorData?.availability || {}}
                        onChange={(newAvailability) => setDoctorData({ ...doctorData, availability: newAvailability })}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
                  <p className="font-semibold">{selectedAppointment.patientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Service</p>
                  <p className="font-semibold">{selectedAppointment.service}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-semibold">{selectedAppointment.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Time</p>
                  <p className="font-semibold">{selectedAppointment.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <Badge variant={selectedAppointment.type === "online" ? "default" : "secondary"}>
                    {selectedAppointment.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge
                    variant={
                      selectedAppointment.status === "confirmed"
                        ? "default"
                        : selectedAppointment.status === "completed"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {selectedAppointment.status}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {selectedAppointment.type === "online" && (
                  <Button
                    className="w-full"
                    onClick={() => {
                      if (selectedAppointment.meetLink) {
                        if (selectedAppointment.meetLink.startsWith('/')) {
                          router.push(selectedAppointment.meetLink)
                        } else {
                          window.open(selectedAppointment.meetLink, '_blank')
                        }
                      } else {
                        alert('Meeting link not available')
                      }
                    }}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join Meeting
                  </Button>
                )}
                {selectedAppointment.type === "offline" && (
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      if (selectedAppointment.location) {
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedAppointment.location}, ${selectedAppointment.city || ''}`)}`, '_blank')
                      } else {
                        alert('Location not set in your profile')
                      }
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    View Location
                  </Button>
                )}
                <div className="flex gap-3">
                  {selectedAppointment.status === 'confirmed' && (
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleUpdateAppointmentStatus(selectedAppointment.id, 'completed')}
                    >
                      Complete Session
                    </Button>
                  )}
                  {(selectedAppointment.status === 'confirmed' || selectedAppointment.status === 'pending') && (
                    <Button
                      variant="secondary"
                      className="flex-1 gap-2 border-primary/20 hover:border-primary/40 bg-primary/5 text-primary"
                      onClick={() => {
                        setActiveChat(selectedAppointment)
                        setSelectedAppointment(null)
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={async () => {
                      const msg = prompt("Please provide a reason for rescheduling and your preferred new time:", "I need to reschedule this session. My preferred new time is...")
                      if (msg) {
                        try {
                          const token = localStorage.getItem('sukoon_token')
                          // 1. Update appointment request fields
                          await fetch(`/api/appointments/${selectedAppointment.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({
                              requestType: 'reschedule',
                              request_type: 'reschedule',
                              requestMessage: msg,
                              request_message: msg
                            })
                          })

                          // 2. Send system message to chat
                          await fetch(`/api/chat`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({
                              appointmentId: selectedAppointment.id,
                              content: `[SYSTEM] Doctor requested a RESCHEDULE: "${msg}"`
                            })
                          })

                          alert("Your reschedule request has been sent and recorded in the chat.")
                          setActiveChat(selectedAppointment)
                          setSelectedAppointment(null)
                          fetchDashboardData()
                        } catch (e) {
                          alert("Failed to send request")
                        }
                      }
                    }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={async () => {
                      const msg = prompt("Please provide a reason for cancellation:", "I need to cancel this session because...")
                      if (msg) {
                        try {
                          const token = localStorage.getItem('sukoon_token')
                          // 1. Update appointment request fields
                          await fetch(`/api/appointments/${selectedAppointment.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({
                              requestType: 'cancel',
                              request_type: 'cancel',
                              requestMessage: msg,
                              request_message: msg
                            })
                          })

                          // 2. Send system message to chat
                          await fetch(`/api/chat`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({
                              appointmentId: selectedAppointment.id,
                              content: `[SYSTEM] Doctor requested a CANCELLATION: "${msg}"`
                            })
                          })

                          alert("Your cancellation request has been sent and recorded in the chat.")
                          setActiveChat(selectedAppointment)
                          setSelectedAppointment(null)
                          fetchDashboardData()
                        } catch (e) {
                          alert("Failed to send request")
                        }
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                {selectedAppointment.request_type && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-xs text-yellow-600 font-bold uppercase">Pending {selectedAppointment.request_type} Request</p>
                    <p className="text-sm italic text-muted-foreground mt-1">"{selectedAppointment.request_message}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {activeChat && (
        <Dialog open={!!activeChat} onOpenChange={(open) => !open && setActiveChat(null)}>
          <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
            <DialogTitle className="sr-only">Chat with Patient</DialogTitle>
            <ChatWindow
              appointmentId={activeChat.id}
              recipientName={activeChat.patientName}
              recipientRole="patient"
              onClose={() => setActiveChat(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isAddingPatient} onOpenChange={setIsAddingPatient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Clinic Patient Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Patient Name</Label>
              <Input
                value={newPatientData.name}
                onChange={e => setNewPatientData({ ...newPatientData, name: e.target.value })}
                placeholder="Full Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={newPatientData.phone}
                onChange={e => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                placeholder="01xxxxxxxxx"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newPatientData.date}
                  onChange={e => setNewPatientData({ ...newPatientData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={newPatientData.time}
                  onChange={e => setNewPatientData({ ...newPatientData, time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Service</Label>
              <Select
                value={newPatientData.service}
                onValueChange={v => setNewPatientData({ ...newPatientData, service: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Therapy Session">Therapy Session</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full mt-4" onClick={handleManualAddPatient}>
              Add Patient Record
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Patient History: {selectedPatient?.name}</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-sm font-semibold">Summary</p>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-muted-foreground">Total Sessions</span>
                  <span className="text-xs font-bold">{selectedPatient.appointments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Completed</span>
                  <span className="text-xs font-bold text-green-600">{selectedPatient.appointments.filter(a => a.status === 'completed').length}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2">Session History</p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {selectedPatient.appointments.map(a => (
                    <div key={a.id} className="p-3 bg-muted/30 rounded-lg text-xs flex justify-between items-center">
                      <div>
                        <p className="font-medium">{new Date(a.date).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">{a.service}</p>
                      </div>
                      <Badge variant={a.status === 'completed' ? 'default' : 'secondary'}>
                        {a.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function DoctorDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <DoctorDashboardContent />
    </Suspense>
  )
}

