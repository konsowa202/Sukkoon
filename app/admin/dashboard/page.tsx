"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
// Mock data removed - using API only
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DollarSign, Users, UserPlus, LogOut, Check, X, Edit, Trash2, Plus, Search, FileText, MessageCircle, Copy, Key, UserCheck, ShieldAlert, Phone, MapPin, Globe, CreditCard, Gift, Heart, Camera, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChatWindow } from "@/components/chat-window"
import { useToast } from "@/components/ui/use-toast"

import { Skeleton } from "@/components/ui/skeleton"
import { HeaderNav } from "@/components/header-nav"

export default function AdminDashboard() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  const [pendingDoctors, setPendingDoctors] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [cases, setCases] = useState<any[]>([])
  const [topics, setTopics] = useState<any[]>([])
  const [promoCodes, setPromoCodes] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, activeCases: 0, revenue: 0 })
  const [loading, setLoading] = useState(true)

  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [dialogType, setDialogType] = useState<"view" | "edit" | "delete" | "add" | "promo" | null>(null)
  const [entityType, setEntityType] = useState<"doctor" | "patient" | "case" | "topic" | "promo" | null>(null)
  const [activeChat, setActiveChat] = useState<any>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState<any>({ availability: {}, languages: ['Arabic', 'English'], gender: 'male', consultationType: 'both', commissionPercent: 10, image: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [generatedCredentials, setGeneratedCredentials] = useState<{ email: string, password: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user && user.role === 'admin' && !isLoading) {
      fetchAllData()
    }
  }, [user, isLoading])

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('sukoon_token')
      const headers = {
        'Authorization': token ? `Bearer ${token}` : ''
      }

      // Fetch all needed data
      const [pendingRes, doctorsRes, patientsRes, appointmentsRes, paymentsRes, promoRes] = await Promise.all([
        fetch('/api/doctors?verified=false', { headers }),
        fetch('/api/doctors?verified=true', { headers }),
        fetch('/api/users?role=patient', { headers }),
        fetch('/api/appointments', { headers }),
        fetch('/api/payments', { headers }),
        fetch('/api/promo-codes', { headers })
      ])

      const [pendingData, doctorsData, patientsData, appointmentsData, paymentsData, promoData] = await Promise.all([
        pendingRes.ok ? pendingRes.json() : [],
        doctorsRes.ok ? doctorsRes.json() : [],
        patientsRes.ok ? patientsRes.json() : [],
        appointmentsRes.ok ? appointmentsRes.json() : [],
        paymentsRes.ok ? paymentsRes.json() : [],
        promoRes.ok ? promoRes.json() : []
      ])

      setPendingDoctors(pendingData.map((d: any) => ({
        id: d.id,
        name: d.name,
        specialization: d.specialization,
        email: d.users?.email || '',
        appliedDate: new Date(d.created_at || Date.now()).toISOString().split('T')[0],
        status: 'pending'
      })))

      setDoctors(doctorsData)
      setPromoCodes(promoData)
      setPayments(paymentsData)

      setPatients(patientsData.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || 'N/A',
        totalSessions: appointmentsData.filter((a: any) => a.patientId === u.id && a.status === 'completed').length,
        status: 'active'
      })))

      setCases(appointmentsData.map((a: any) => ({
        id: a.id,
        title: a.service || 'Consultation',
        patientName: a.patientName,
        doctorName: a.doctorName,
        date: a.date,
        time: a.time,
        sessions: 1,
        status: a.status,
        description: `${a.type} session on ${a.date} at ${a.time}`,
        request_type: a.request_type || a.requestType,
        request_message: a.request_message || a.requestMessage
      })))

      const totalRevenue = paymentsData
        .filter((p: any) => p.status === 'approved')
        .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0)

      setStats({
        totalDoctors: doctorsData.length,
        totalPatients: patientsData.length,
        activeCases: appointmentsData.filter((a: any) => a.status === 'pending' || a.status === 'confirmed').length,
        revenue: totalRevenue
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCaseStatus = async (id: string, newStatus: string) => {
    if (newStatus === 'cancelled' && !confirm("Are you sure you want to cancel this session?")) return

    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setDialogType(null)
        fetchAllData()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== "admin") {
    return null
  }

  const renderStatsSkeletons = () => (
    <div className="grid md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
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

  const renderTableSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  )

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch(`/api/doctors/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ isVerified: true })
      })

      if (response.ok) {
        // Remove from pending and add to doctors
        const approved = pendingDoctors.find(d => d.id === id)
        if (approved) {
          setPendingDoctors(pendingDoctors.filter(d => d.id !== id))
          fetchAllData() // Refresh data
        }
      }
    } catch (error) {
      console.error('Failed to approve doctor:', error)
    }
  }

  const handleReject = async (id: string) => {
    setPendingDoctors(pendingDoctors.filter(d => d.id !== id))
  }

  const handleViewEntity = (entity: any, type: "doctor" | "patient" | "case" | "topic" | "promo") => {
    setSelectedEntity(entity)
    setEntityType(type)
    setDialogType("view")
  }

  const handleEditEntity = (entity: any, type: "doctor" | "patient" | "case" | "topic" | "promo") => {
    setSelectedEntity(entity)
    setFormData({
      name: entity.name,
      email: entity.email || entity.users?.email,
      phone: entity.phone,
      specialization: entity.specialization,
      bio: entity.bio,
      priceOnline: entity.priceOnline,
      priceOffline: entity.priceOffline,
      experience: entity.experience,
      gender: entity.gender,
      languages: entity.languages || ['Arabic', 'English'],
      city: entity.city,
      location: entity.location,
      consultationType: entity.consultationType,
      commissionPercent: entity.commissionPercent || 10,
      image: entity.image || entity.image_url || ""
    })
    setEntityType(type)
    setDialogType("edit")
  }

  const handleDeleteEntity = (entity: any, type: "doctor" | "patient" | "case" | "topic" | "promo") => {
    setSelectedEntity(entity)
    setEntityType(type)
    setDialogType("delete")
  }

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let pass = ""
    for (let i = 0; i < 10; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length))
    setFormData({ ...formData, password: pass })
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied", description: `${label} copied to clipboard` })
  }

  const handleImpersonate = async (targetUserId: string) => {
    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ userId: targetUserId })
      })

      if (response.ok) {
        const { token: impToken } = await response.json()
        localStorage.setItem('sukoon_token', impToken)
        toast({ title: "Success", description: "Logged in as doctor. Redirecting..." })
        setTimeout(() => window.location.href = '/doctor/dashboard', 1000)
      } else {
        const text = await response.text()
        let errorData = { error: 'Unknown error' }
        try {
          if (text) errorData = JSON.parse(text)
        } catch (e) { }
        toast({ variant: "destructive", title: "Error", description: errorData.error || "Failed to impersonate" })
      }
    } catch (error) {
      console.error('Impersonation error:', error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Immediate Base64 preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev: any) => ({ ...prev, image: reader.result as string }))
    }
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const token = localStorage.getItem('sukoon_token')
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'doctor-profiles')
      uploadFormData.append('bucket', 'payment-proofs')

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        body: uploadFormData
      })

      const data = await response.json()
      if (response.ok) {
        setFormData((prev: any) => ({ ...prev, image: data.url }))
        toast({ title: "Success", description: "Image uploaded successfully" })
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (error: any) {
      console.error('Image upload error:', error)
      toast({ variant: "destructive", title: "Upload Failed", description: error.message || "Using preview only" })
    } finally {
      setUploading(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedEntity || !entityType) return

    try {
      const token = localStorage.getItem('sukoon_token')
      let url = ''
      if (entityType === 'doctor') url = `/api/doctors/${selectedEntity.id}`
      else if (entityType === 'patient') url = `/api/users/${selectedEntity.id}`
      else if (entityType === 'case') url = `/api/appointments/${selectedEntity.id}`
      else if (entityType === 'promo') url = `/api/promo-codes/${selectedEntity.id}`

      if (!url) {
        toast({ variant: "destructive", title: "Wait", description: "Delete not available for this type yet" })
        setDialogType(null)
        setSelectedEntity(null)
        return
      }

      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      })

      if (response.ok) {
        toast({ title: "Deleted", description: `${entityType} removed successfully` })
        fetchAllData()
        setDialogType(null)
        setSelectedEntity(null)
      } else {
        const text = await response.text()
        let errorData = { error: 'Unknown error' }
        try {
          if (text) errorData = JSON.parse(text)
        } catch (e) {
          console.error('Failed to parse error response:', text)
        }
        toast({ variant: "destructive", title: "Error", description: errorData.error || "Failed to delete" })
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({ title: "Success", description: "Doctor created successfully" })
        setGeneratedCredentials({ email: formData.email, password: formData.password })
        fetchAllData()
      } else {
        const error = await response.json()
        toast({ variant: "destructive", title: "Error", description: error.error || "Failed to create doctor" })
      }
    } catch (error) {
      console.error('Add doctor error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('sukoon_token')
      let url = ''
      if (entityType === 'doctor') url = `/api/doctors/${selectedEntity.id}`

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({ title: "Success", description: "Updated successfully" })
        setDialogType(null)
        fetchAllData()
      } else {
        const error = await response.json()
        toast({ variant: "destructive", title: "Error", description: error.error || "Failed to update" })
      }
    } catch (error) {
      console.error('Edit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Platform overview and management</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/payments">
                <DollarSign className="w-4 h-4 mr-2" />
                Payment Verification
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/5">
              <Link href="/admin/donations">
                <Heart className="w-4 h-4 mr-2 text-primary" />
                Donations Management
              </Link>
            </Button>
          </div>

          {/* Stats */}
          {loading ? renderStatsSkeletons() : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 text-foreground bg-card">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                    <UserPlus className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Doctors</p>
                    <p className="text-2xl font-bold">{stats.totalDoctors}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 text-foreground bg-card">
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

              <Card className="p-6 text-foreground bg-card">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Cases</p>
                    <p className="text-2xl font-bold">{stats.activeCases}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 text-foreground bg-card cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => {
                const trigger = document.querySelector('[value="revenue"]') as HTMLElement;
                if (trigger) trigger.click();
              }}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-8">
              <TabsTrigger value="pending" className="py-2">Pending</TabsTrigger>
              <TabsTrigger value="doctors" className="py-2">Doctors</TabsTrigger>
              <TabsTrigger value="patients" className="py-2">Patients</TabsTrigger>
              <TabsTrigger value="cases" className="py-2">Cases</TabsTrigger>
              <TabsTrigger value="topics" className="py-2">Topics</TabsTrigger>
              <TabsTrigger value="requests" className="py-2 relative">
                Requests
                {cases.filter(c => c.request_type).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="promo" className="py-2">Promo Codes</TabsTrigger>
              <TabsTrigger value="revenue" className="py-2">Revenue</TabsTrigger>
            </TabsList>

            {/* Pending Doctor Approvals */}
            <TabsContent value="pending" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Pending Doctor Applications</h2>
              </div>
              {loading ? renderTableSkeleton() : pendingDoctors.length === 0 ? (
                <Card className="p-8 text-center border-dashed">
                  <p className="text-muted-foreground">No pending doctor applications</p>
                </Card>
              ) : (
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="text-left p-4 font-semibold">Name</th>
                          <th className="text-left p-4 font-semibold">Specialization</th>
                          <th className="text-left p-4 font-semibold">Email</th>
                          <th className="text-left p-4 font-semibold">Applied Date</th>
                          <th className="text-left p-4 font-semibold">Status</th>
                          <th className="text-right p-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingDoctors.map((doctor) => (
                          <tr key={doctor.id} className="border-b border-border">
                            <td className="p-4 font-medium">{doctor.name}</td>
                            <td className="p-4 text-sm text-muted-foreground">{doctor.specialization}</td>
                            <td className="p-4 text-sm text-muted-foreground">{doctor.email}</td>
                            <td className="p-4 text-sm text-muted-foreground">{doctor.appliedDate}</td>
                            <td className="p-4">
                              <Badge
                                variant={
                                  doctor.status === "active"
                                    ? "default"
                                    : doctor.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {doctor.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              {doctor.status === "pending" && (
                                <div className="flex justify-end gap-2">
                                  <Button size="sm" variant="default" onClick={() => handleApprove(doctor.id)}>
                                    <Check className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleReject(doctor.id)}>
                                    <X className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="doctors" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Doctors</h2>
                <Button onClick={() => {
                  setFormData({ availability: {}, languages: ['Arabic', 'English'], gender: 'male', consultationType: 'both' })
                  setEntityType('doctor')
                  setDialogType('add')
                  setGeneratedCredentials(null)
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Doctor
                </Button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-semibold">Name</th>
                        <th className="text-left p-4 font-semibold">Specialization</th>
                        <th className="text-left p-4 font-semibold">Experience</th>
                        <th className="text-left p-4 font-semibold">Rating</th>
                        <th className="text-left p-4 font-semibold">Price (EGP)</th>
                        <th className="text-right p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doctor) => (
                        <tr key={doctor.id} className="border-b border-border">
                          <td className="p-4 font-medium">{doctor.name}</td>
                          <td className="p-4 text-sm text-muted-foreground">{doctor.specialization}</td>
                          <td className="p-4 text-sm text-muted-foreground">{doctor.experience} years</td>
                          <td className="p-4 text-sm text-muted-foreground">{doctor.rating}</td>
                          <td className="p-4 text-sm text-muted-foreground">{doctor.priceOnline} EGP</td>
                          <td className="p-4">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" title="Login as Doctor" onClick={() => handleImpersonate(doctor.userId || doctor.user_id)}>
                                <UserCheck className="w-4 h-4 text-primary" />
                              </Button>
                              <Button size="sm" variant="ghost" title="Generate Free Session Code" onClick={() => {
                                const random = 'FREE-' + Math.random().toString(36).substring(7).toUpperCase()
                                setFormData({ code: random, discount_percent: 100, doctor_id: doctor.id, max_uses: 1 })
                                setEntityType('promo')
                                setDialogType('promo')
                              }}>
                                <Gift className="w-4 h-4 text-orange-500" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleViewEntity(doctor, "doctor")}>
                                View
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleEditEntity(doctor, "doctor")}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteEntity(doctor, "doctor")}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="patients" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Patients</h2>
                <div className="flex gap-2">
                  <Input placeholder="Search patients..." className="w-64" />
                  <Button variant="outline">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-semibold">Name</th>
                        <th className="text-left p-4 font-semibold">Email</th>
                        <th className="text-left p-4 font-semibold">Phone</th>
                        <th className="text-left p-4 font-semibold">Total Sessions</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-right p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id} className="border-b border-border">
                          <td className="p-4 font-medium">{patient.name}</td>
                          <td className="p-4 text-sm text-muted-foreground">{patient.email}</td>
                          <td className="p-4 text-sm text-muted-foreground">{patient.phone}</td>
                          <td className="p-4 text-sm text-muted-foreground">{patient.totalSessions}</td>
                          <td className="p-4">
                            <Badge variant={patient.status === "active" ? "default" : "secondary"}>
                              {patient.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleViewEntity(patient, "patient")}>
                                View
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleEditEntity(patient, "patient")}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteEntity(patient, "patient")}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="cases" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Cases</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Case
                </Button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-semibold">Title</th>
                        <th className="text-left p-4 font-semibold">Patient</th>
                        <th className="text-left p-4 font-semibold">Doctor</th>
                        <th className="text-left p-4 font-semibold">Sessions</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-right p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cases.map((caseItem) => (
                        <tr key={caseItem.id} className="border-b border-border">
                          <td className="p-4 font-medium">{caseItem.title}</td>
                          <td className="p-4 text-sm text-muted-foreground">{caseItem.patientName}</td>
                          <td className="p-4 text-sm text-muted-foreground">{caseItem.doctorName}</td>
                          <td className="p-4 text-sm text-muted-foreground">{caseItem.sessions}</td>
                          <td className="p-4">
                            <Badge
                              variant={
                                caseItem.status === "active"
                                  ? "default"
                                  : caseItem.status === "resolved"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {caseItem.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" title="Monitor Chat" onClick={() => setActiveChat(caseItem)}>
                                <MessageCircle className="w-4 h-4 text-primary" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleViewEntity(caseItem, "case")}>
                                View
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleEditEntity(caseItem, "case")}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteEntity(caseItem, "case")}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="topics" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Manage Topics</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Topic
                </Button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-semibold">Name</th>
                        <th className="text-left p-4 font-semibold">Category</th>
                        <th className="text-left p-4 font-semibold">Resources</th>
                        <th className="text-left p-4 font-semibold">Views</th>
                        <th className="text-right p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topics.map((topic) => (
                        <tr key={topic.id} className="border-b border-border">
                          <td className="p-4 font-medium">{topic.name}</td>
                          <td className="p-4 text-sm text-muted-foreground">{topic.category}</td>
                          <td className="p-4 text-sm text-muted-foreground">{topic.resourceCount}</td>
                          <td className="p-4 text-sm text-muted-foreground">{topic.viewCount.toLocaleString()}</td>
                          <td className="p-4">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleViewEntity(topic, "topic")}>
                                View
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleEditEntity(topic, "topic")}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteEntity(topic, "topic")}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Special Requests (Reschedule/Cancel)</h2>
              </div>
              {cases.filter(c => c.request_type).length === 0 ? (
                <Card className="p-8 text-center border-dashed">
                  <p className="text-muted-foreground">No active reschedule or cancellation requests</p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {cases.filter(c => c.request_type).map((c) => (
                    <Card key={c.id} className="p-6 border-l-4 border-l-destructive">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">{c.request_type}</Badge>
                            <span className="text-sm text-muted-foreground">{c.date} at {c.time}</span>
                          </div>
                          <h3 className="font-semibold text-lg">{c.title}</h3>
                          <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Users className="w-4 h-4" /> Patient: {c.patientName}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <UserCheck className="w-4 h-4" /> Doctor: {c.doctorName}
                            </span>
                          </div>
                          <p className="text-sm bg-muted p-3 rounded-md italic">
                            &quot;{c.request_message}&quot;
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm" onClick={() => setActiveChat(c)}>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Open Chat
                          </Button>
                          <Button variant="default" size="sm" onClick={() => handleUpdateCaseStatus(c.id, 'cancelled')}>
                            <Check className="w-4 h-4 mr-2" />
                            Approve {c.request_type}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="promo" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Promo Codes</h2>
                <Button onClick={() => {
                  setFormData({ discount_percent: 25, max_uses: 100 })
                  setEntityType('promo')
                  setDialogType('promo')
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Promo Code
                </Button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-semibold">Code</th>
                        <th className="text-left p-4 font-semibold">Discount</th>
                        <th className="text-left p-4 font-semibold">Restrictions</th>
                        <th className="text-left p-4 font-semibold">Usage</th>
                        <th className="text-left p-4 font-semibold">Status</th>
                        <th className="text-right p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promoCodes.map((promo) => (
                        <tr key={promo.id} className="border-b border-border">
                          <td className="p-4 font-bold">{promo.code}</td>
                          <td className="p-4">{promo.discount_percent}% OFF</td>
                          <td className="p-4 text-sm">
                            {promo.doctor_id ? `Only for Dr. ${promo.doctor?.name}` : "All Doctors"}
                          </td>
                          <td className="p-4 text-sm">{promo.current_uses} / {promo.max_uses}</td>
                          <td className="p-4">
                            <Badge variant={promo.is_active ? "default" : "secondary"}>
                              {promo.is_active ? "Active" : "Disabled"}
                            </Badge>
                          </td>
                          <td className="p-4 text-right">
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteEntity(promo, "promo")}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Revenue Breakdown by Doctor</h2>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Platform Revenue</p>
                  <p className="text-xl font-bold text-primary">${stats.revenue.toLocaleString()}</p>
                </div>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-semibold">Doctor Name</th>
                        <th className="text-left p-4 font-semibold">Commission %</th>
                        <th className="text-left p-4 font-semibold">Total Earned (Gross)</th>
                        <th className="text-left p-4 font-semibold">Platform Share</th>
                        <th className="text-left p-4 font-semibold">Net to Doctor</th>
                        <th className="text-right p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doctor) => {
                        const doctorPayments = payments.filter(p => p.status === 'approved' && p.appointment?.doctor?.id === doctor.id)
                        const grossEarned = doctorPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
                        const platformShare = (grossEarned * (doctor.commissionPercent || 10)) / 100
                        const netToDoctor = grossEarned - platformShare

                        return (
                          <tr key={doctor.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                            <td className="p-4 font-medium">{doctor.name}</td>
                            <td className="p-4 text-sm font-semibold text-primary">{doctor.commissionPercent || 10}%</td>
                            <td className="p-4 text-sm font-bold">${grossEarned.toLocaleString()}</td>
                            <td className="p-4 text-sm text-orange-500 font-bold">${platformShare.toLocaleString()}</td>
                            <td className="p-4 text-sm text-green-500 font-bold">${netToDoctor.toLocaleString()}</td>
                            <td className="p-4 text-right">
                              <Button size="sm" variant="outline" onClick={() => handleEditEntity(doctor, "doctor")}>
                                Update Commission
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="p-8 text-center bg-muted/20">
                  <p className="text-sm text-muted-foreground">
                    <ShieldAlert className="w-4 h-4 inline mr-2 text-orange-500" />
                    Individual doctor revenue tracking is being initialized. Please ensure all payments are approved in the Payment Verification section.
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={dialogType === "view"} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{entityType?.toUpperCase()} Details</DialogTitle>
          </DialogHeader>
          {selectedEntity && (
            <div className="space-y-6">
              {entityType === "doctor" && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Name</p>
                    <p className="font-semibold">{selectedEntity.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Specialization</p>
                    <p className="font-semibold">{selectedEntity.specialization}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Globe className="w-4 h-4" /> Email</p>
                    <p className="font-semibold">{selectedEntity.email || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</p>
                    <p className="font-semibold">{selectedEntity.phone || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> City</p>
                    <p className="font-semibold">{selectedEntity.city || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><Globe className="w-4 h-4" /> Languages</p>
                    <div className="flex gap-1 flex-wrap">
                      {selectedEntity.languages?.map((l: string) => <Badge key={l} variant="outline">{l}</Badge>)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-2"><CreditCard className="w-4 h-4" /> Prices (Online/Offline)</p>
                    <p className="font-semibold">{selectedEntity.priceOnline} / {selectedEntity.priceOffline} EGP</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-sm border p-2 rounded bg-muted/30">{selectedEntity.location || 'N/A'}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-sm text-muted-foreground">Bio</p>
                    <p className="text-sm whitespace-pre-line border p-3 rounded">{selectedEntity.bio}</p>
                  </div>
                </div>
              )}
              {entityType === "patient" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{selectedEntity.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{selectedEntity.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold">{selectedEntity.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                    <p className="font-semibold">{selectedEntity.totalSessions}</p>
                  </div>
                </div>
              )}
              {entityType === "case" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Case Title</p>
                      <p className="font-semibold">{selectedEntity.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge>{selectedEntity.status}</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-semibold">{selectedEntity.description}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add / Edit Doctor Dialog */}
      <Dialog open={dialogType === "add" || dialogType === "edit"} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogType === "add" ? "Add New Doctor" : "Edit Doctor Profile"}</DialogTitle>
          </DialogHeader>
          {generatedCredentials && dialogType === "add" ? (
            <div className="p-6 space-y-4 bg-muted/50 rounded-lg text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Doctor Created Successfully!</h3>
              <p className="text-muted-foreground">Please copy and share these credentials with the doctor.</p>
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Email / Username</p>
                    <p className="font-mono">{generatedCredentials.email}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedCredentials.email, "Email")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Password</p>
                    <p className="font-mono">••••••••</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(generatedCredentials.password, "Password")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button className="w-full mt-6" onClick={() => {
                setDialogType(null)
                setGeneratedCredentials(null)
              }}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={dialogType === "add" ? handleAddDoctor : handleSaveEdit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="Dr. Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email / Username</label>
                  <Input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} required placeholder="email@example.com" disabled={dialogType === 'edit'} />
                </div>
                {dialogType === "add" && (
                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="flex gap-2">
                      <Input value={formData.password || ''} onChange={e => setFormData({ ...formData, password: e.target.value })} required placeholder="Automatically generated or type here" />
                      <Button type="button" variant="outline" onClick={generatePassword}><Key className="w-4 h-4 mr-2" /> Gen</Button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} required placeholder="+20..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Specialization</label>
                  <Input value={formData.specialization || ''} onChange={e => setFormData({ ...formData, specialization: e.target.value })} required placeholder="Therapist, Psychiatrist..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Input value={formData.city || ''} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="Cairo, Alexandria..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience (Years)</label>
                  <Input type="number" value={formData.experience || ''} onChange={e => setFormData({ ...formData, experience: e.target.value })} placeholder="10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Online (EGP)</label>
                  <Input type="number" value={formData.priceOnline || ''} onChange={e => setFormData({ ...formData, priceOnline: e.target.value })} placeholder="500" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Offline (EGP)</label>
                  <Input type="number" value={formData.priceOffline || ''} onChange={e => setFormData({ ...formData, priceOffline: e.target.value })} placeholder="700" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Commission % (Platform Share)</label>
                  <Input type="number" value={formData.commissionPercent || 10} onChange={e => setFormData({ ...formData, commissionPercent: parseInt(e.target.value) })} placeholder="10" min="0" max="100" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Location / Address</label>
                  <Input value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="Clinic address details" />
                </div>
                <div className="col-span-2 space-y-4">
                  <label className="text-sm font-medium">Profile Image</label>
                  <div className="flex items-center gap-6">
                    <div className="relative group w-24 h-24">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-muted bg-muted flex items-center justify-center relative">
                        {formData.image ? (
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-10 h-10 text-muted-foreground" />
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full w-8 h-8 shadow-md border"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Change Photo</p>
                      <p className="text-xs text-muted-foreground">Standard size 400x400px recommended. JPG or PNG.</p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Bio</label>
                  <textarea
                    className="w-full min-h-[100px] p-2 rounded-md border bg-background text-sm"
                    value={formData.bio || ''}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Doctor's biography and professional background..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : (dialogType === "add" ? "Create Doctor" : "Save Changes")}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === "delete"} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="w-5 h-5" /> Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <p>Are you sure you want to delete this {entityType}?</p>
            <p className="font-semibold text-lg">{selectedEntity?.name || selectedEntity?.title}</p>
            <p className="text-sm text-muted-foreground">This action cannot be undone and will remove all associated data.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promo Code Dialog */}
      <Dialog open={dialogType === "promo"} onOpenChange={(open) => !open && setDialogType(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Promo Code</DialogTitle>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            try {
              const token = localStorage.getItem('sukoon_token');
              const response = await fetch('/api/promo-codes', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(formData)
              });

              if (response.ok) {
                toast({ title: "Success", description: "Promo code created" });
                setDialogType(null);
                fetchAllData();
              } else {
                const err = await response.json();
                toast({ variant: "destructive", title: "Error", description: err.error || "Failed to create" });
              }
            } catch (error) {
              console.error('Promo creation error:', error);
            } finally {
              setIsSubmitting(false);
            }
          }} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Code</label>
              <Input
                value={formData.code || ''}
                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                placeholder="PROMO25"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Discount Percentage</label>
              <Input
                type="number"
                value={formData.discount_percent || ''}
                onChange={e => setFormData({ ...formData, discount_percent: parseInt(e.target.value) })}
                required
                min="1"
                max="100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Uses</label>
              <Input
                type="number"
                value={formData.max_uses || ''}
                onChange={e => setFormData({ ...formData, max_uses: parseInt(e.target.value) })}
                required
              />
            </div>
            {formData.doctor_id && (
              <p className="text-xs text-muted-foreground italic">Restricted to selected doctor</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Code"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {
        activeChat && (
          <Dialog open={!!activeChat} onOpenChange={(open) => !open && setActiveChat(null)}>
            <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
              <DialogTitle className="sr-only">Chat Monitoring</DialogTitle>
              <ChatWindow
                appointmentId={activeChat.id}
                recipientName={`${activeChat.patientName} & ${activeChat.doctorName}`}
                recipientRole="admin"
                onClose={() => setActiveChat(null)}
              />
            </DialogContent>
          </Dialog>
        )
      }
    </div >
  )
}
