"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogOut, Edit, Save, X, Star, Award, MapPin, Video, Loader2, Camera, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { HeaderNav } from "@/components/header-nav"
import { Skeleton } from "@/components/ui/skeleton"

export default function DoctorProfilePage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [doctorData, setDoctorData] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    bio: "",
    priceOnline: 0,
    priceOffline: 0,
    consultationType: "both",
    location: "",
    city: "",
    experience: 0,
    gender: "male",
    image: "",
    availability: {} as Record<string, string[]>,
    languages: [] as string[],
    googleMapsLink: "",
    phone: ""
  })

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch('/api/doctors/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setDoctorData(data)
        setFormData({
          name: data.name || "",
          specialization: data.specialization || "",
          bio: data.bio || "",
          priceOnline: data.priceOnline || 0,
          priceOffline: data.priceOffline || 0,
          consultationType: data.consultationType || "both",
          location: data.location || "",
          city: data.city || "",
          experience: data.experience || 0,
          gender: data.gender || "male",
          image: data.image || "",
          availability: data.availability || {},
          languages: data.languages || [],
          googleMapsLink: data.googleMapsLink || "",
          phone: data.phone || ""
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        })
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "doctor") {
        router.push("/login")
      } else {
        fetchProfile()
      }
    }
  }, [user, authLoading, router])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('sukoon_token')
      // Make sure we have the doctor ID
      if (!doctorData?.id) throw new Error("Doctor ID not found")

      const response = await fetch(`/api/doctors/${doctorData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone // Ensure phone is sent
        })
      })

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated",
        })
        fetchProfile() // Refresh data
        setIsEditing(false)
      } else {
        const err = await response.json()
        throw new Error(err.error || "Failed to update profile")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (doctorData) {
      setFormData({
        name: doctorData.name || "",
        specialization: doctorData.specialization || "",
        bio: doctorData.bio || "",
        priceOnline: doctorData.priceOnline || 0,
        priceOffline: doctorData.priceOffline || 0,
        consultationType: doctorData.consultationType || "both",
        location: doctorData.location || "",
        city: doctorData.city || "",
        experience: doctorData.experience || 0,
        gender: doctorData.gender || "male",
        image: doctorData.image || "",
        availability: doctorData.availability || {},
        languages: doctorData.languages || [],
        googleMapsLink: doctorData.googleMapsLink || "",
        phone: doctorData.phone || ""
      })
    }
    setIsEditing(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Create immediate Base64 preview and fallback
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setFormData(prev => ({ ...prev, image: base64String }))
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
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadFormData
      })

      const data = await response.json()

      if (response.ok) {
        // 2. If upload succeeded, use the cloud URL (better performance)
        setFormData(prev => ({ ...prev, image: data.url }))
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
      // We keep the Base64 from step 1
    } finally {
      setUploading(false)
    }
  }

  if (authLoading || loading || !user || user.role !== 'doctor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const showOnlineFields = formData.consultationType === "online" || formData.consultationType === "both"
  const showOfflineFields = formData.consultationType === "offline" || formData.consultationType === "both"

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const addTimeSlot = (day: string) => {
    const time = prompt("Enter time (e.g. 10:00 AM)")
    if (time) {
      const currentSlots = formData.availability[day] || []
      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          [day]: [...currentSlots, time].sort()
        }
      })
    }
  }

  const removeTimeSlot = (day: string, index: number) => {
    const currentSlots = formData.availability[day] || []
    const newSlots = currentSlots.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: newSlots
      }
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your professional information</p>
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
              <div className="relative group">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt={formData.name}
                  className="w-32 h-32 rounded-lg object-cover ring-2 ring-border"
                />
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

              {!isEditing ? (
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold">{formData.name || "Dr. " + user?.name}</h2>
                    <p className="text-lg text-primary">{formData.specialization || "General Specialist"}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{doctorData?.rating || 4.8}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({doctorData?.reviewCount || 10} reviews)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="text-sm">{formData.experience || 0} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-primary" />
                      <span className="text-sm">{formData.phone || "No phone set"}</span>
                    </div>
                    {showOnlineFields && (
                      <Badge variant="outline" className="gap-1">
                        <Video className="w-3 h-3" />
                        Online
                      </Badge>
                    )}
                    {showOfflineFields && (
                      <Badge variant="outline" className="gap-1">
                        <MapPin className="w-3 h-3" />
                        In-Person
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(formData.languages || ["English", "Arabic"]).map((lang: string) => (
                      <Badge key={lang} variant="secondary">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      placeholder="Psychiatrist"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value: any) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="01xxxxxxxxx"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="languages">Languages (comma separated)</Label>
                    <Input
                      id="languages"
                      value={formData.languages.join(", ")}
                      onChange={(e) => setFormData({ ...formData, languages: e.target.value.split(",").map(lang => lang.trim()).filter(lang => lang !== "") })}
                      placeholder="Arabic, English, French"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Bio */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">About</h3>
            {!isEditing ? (
              <p className="text-muted-foreground">{formData.bio}</p>
            ) : (
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                placeholder="Tell patients about your expertise and approach..."
              />
            )}
          </Card>

          {/* Consultation Type */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Consultation Settings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="consultationType">Consultation Type</Label>
                {!isEditing ? (
                  <p className="text-muted-foreground mt-2 capitalize">{formData.consultationType}</p>
                ) : (
                  <Select
                    value={formData.consultationType}
                    onValueChange={(value: "online" | "offline" | "both") =>
                      setFormData({ ...formData, consultationType: value })
                    }
                  >
                    <SelectTrigger id="consultationType" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online Only</SelectItem>
                      <SelectItem value="offline">In-Person Only</SelectItem>
                      <SelectItem value="both">Both Online and In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {showOfflineFields && (
                <>
                  <div>
                    <Label htmlFor="location">Clinic Address</Label>
                    {!isEditing ? (
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">{formData.location || "Not set"}</p>
                            {formData.city && <p className="text-sm text-muted-foreground">{formData.city}</p>}
                          </div>
                        </div>
                        {formData.googleMapsLink && (
                          <Button variant="link" className="p-0 h-auto text-primary w-fit" onClick={() => window.open(formData.googleMapsLink, '_blank')}>
                            View on Google Maps
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4 mt-2">
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-xs uppercase font-bold text-muted-foreground">Address</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="123 Medical Center, Nasr City"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-xs uppercase font-bold text-muted-foreground">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Cairo"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="googleMapsLink" className="text-xs uppercase font-bold text-muted-foreground">Google Maps Link</Label>
                          <Input
                            id="googleMapsLink"
                            value={formData.googleMapsLink}
                            onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                            placeholder="https://maps.google.com/..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Pricing */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Consultation Fees</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {showOnlineFields && (
                <div>
                  <Label htmlFor="priceOnline">Online Consultation (EGP)</Label>
                  {!isEditing ? (
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg mt-2">
                      <Video className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Online Consultation</p>
                        <p className="text-2xl font-bold text-primary">{formData.priceOnline} EGP</p>
                      </div>
                    </div>
                  ) : (
                    <Input
                      id="priceOnline"
                      type="number"
                      value={formData.priceOnline}
                      onChange={(e) => setFormData({ ...formData, priceOnline: Number(e.target.value) })}
                      className="mt-2"
                    />
                  )}
                </div>
              )}

              {showOfflineFields && (
                <div>
                  <Label htmlFor="priceOffline">In-Person Consultation (EGP)</Label>
                  {!isEditing ? (
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg mt-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">In-Person Visit</p>
                        <p className="text-2xl font-bold text-primary">{formData.priceOffline} EGP</p>
                      </div>
                    </div>
                  ) : (
                    <Input
                      id="priceOffline"
                      type="number"
                      value={formData.priceOffline}
                      onChange={(e) => setFormData({ ...formData, priceOffline: Number(e.target.value) })}
                      className="mt-2"
                    />
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Availability Hint */}
          <Card className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Weekly Schedule</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage your appointment slots and availability</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/doctor/dashboard?tab=availability">Manage Schedule</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
