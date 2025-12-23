"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
// Removed fallback data import - using API only
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogOut, Edit, Save, X, User, Mail, Phone, CalendarIcon, Camera, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { HeaderNav } from "@/components/header-nav"

export default function PatientProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    image_url: ""
  })
  const [accountInfo, setAccountInfo] = useState({
    joinedDate: "",
    totalSessions: 0,
    status: "active",
    id: ""
  })

  useEffect(() => {
    if (!user || user.role !== "patient") {
      if (typeof window !== 'undefined') {
        window.location.href = "/login"
      }
    } else {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          dateOfBirth: data.date_of_birth || "",
          gender: data.gender || "",
          image_url: data.image_url || ""
        })
        setAccountInfo({
          joinedDate: new Date(data.created_at).toLocaleDateString(),
          totalSessions: data.totalSessions || 0,
          status: "active",
          id: data.id
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== "patient" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          image_url: formData.image_url
        })
      })

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated",
        })
        setIsEditing(false)
        fetchProfile()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update profile")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleCancel = () => {
    fetchProfile()
    setIsEditing(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Create immediate Base64 preview and fallback
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setFormData(prev => ({ ...prev, image_url: base64String }))
    }
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const token = localStorage.getItem('sukoon_token')
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'patient-profiles')
      uploadFormData.append('bucket', 'payment-proofs') // Use existing bucket or create a new one

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        body: uploadFormData
      })

      const data = await response.json()

      if (response.ok) {
        // 2. If upload succeeded, use the cloud URL
        setFormData(prev => ({ ...prev, image_url: data.url }))
        toast({
          title: "Success",
          description: "Image uploaded to cloud. Save changes to persist.",
        })
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (error: any) {
      console.error("Storage upload failed, using Base64 fallback:", error)
      toast({
        variant: "destructive",
        title: "Cloud Upload Failed",
        description: `${error.message}. The image will be saved directly to the database instead. Don't forget to click 'Save Changes'.`,
      })
      // Base64 is already in state
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your personal information</p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline" className="gap-2 bg-transparent">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <Card className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden border">
                    {formData.image_url ? (
                      <img
                        src={formData.image_url}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-primary" />
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-32 mt-2 bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Change Photo"}
                  </Button>
                )}
              </div>

              <div className="flex-1 space-y-4">
                {!isEditing ? (
                  <>
                    <div>
                      <h2 className="text-3xl font-bold">{formData.name}</h2>
                      <p className="text-muted-foreground mt-1 capitalize">Patient</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span>{formData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{formData.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                        <span>{formData.dateOfBirth}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="capitalize">{formData.gender}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value: "male" | "female" | "other") =>
                          setFormData({ ...formData, gender: value })
                        }
                      >
                        <SelectTrigger id="gender">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Account Info */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Account Information</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Member Since</p>
                <p className="font-medium">{accountInfo.joinedDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Total Sessions</p>
                <p className="font-medium">{accountInfo.totalSessions}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Account Status</p>
                <p className="font-medium capitalize">{accountInfo.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Patient ID</p>
                <p className="font-medium">#{accountInfo.id.slice(0, 8)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
