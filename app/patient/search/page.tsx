"use client"

import { useState, useEffect } from "react"
import { type Doctor } from "@/lib/fallback-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Search, MapPin, Video, BadgeIcon, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { HeaderNav } from "@/components/header-nav"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function SearchDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [specializationFilter, setSpecializationFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [consultationTypeFilter, setConsultationTypeFilter] = useState("all")
  const [cityFilter, setCityFilter] = useState("all")
  const { t } = useLanguage()
  const { user, isLoading: authLoading } = useAuth()

  // Debug: Log auth state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("sukoon_user")
      console.log('[SearchPage] Auth state:', {
        userFromContext: user,
        storedUser: storedUser ? JSON.parse(storedUser) : null,
        authLoading
      })
    }
  }, [user, authLoading])

  const fetchDoctors = async () => {
    try {
      const params = new URLSearchParams()
      if (specializationFilter !== 'all') params.append('specialization', specializationFilter)
      if (genderFilter !== 'all') params.append('gender', genderFilter)
      if (consultationTypeFilter !== 'all') params.append('consultationType', consultationTypeFilter)
      if (cityFilter !== 'all') params.append('city', cityFilter)
      if (searchTerm) params.append('search', searchTerm)

      if (priceRange === 'low') {
        params.append('minPrice', '150')
        params.append('maxPrice', '500')
      } else if (priceRange === 'medium') {
        params.append('minPrice', '500')
        params.append('maxPrice', '1500')
      } else if (priceRange === 'high') {
        params.append('minPrice', '1500')
      } else if (priceRange === 'very-high') {
        params.append('maxPrice', '20000')
      }

      const response = await fetch(`/api/doctors?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setDoctors(data)
      } else {
        setDoctors([])
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error)
      setDoctors([])
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch doctors when filters change
  useEffect(() => {
    fetchDoctors()
  }, [searchTerm, specializationFilter, genderFilter, priceRange, consultationTypeFilter, cityFilter])

  const specializations = Array.from(new Set(doctors.map((d) => d.specialization).filter(Boolean)))
  const cities = Array.from(new Set(doctors.map((d) => d.city).filter(Boolean))) as string[]

  const FilterContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="space-y-6">
      {!isMobile && (
        <div className="mb-2">
          <h3 className="font-semibold text-lg">Filters</h3>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="search" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Search Name</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Specialization</Label>
        <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
          <SelectTrigger className="bg-muted/30 border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Consultation Type</Label>
        <Select value={consultationTypeFilter} onValueChange={setConsultationTypeFilter}>
          <SelectTrigger className="bg-muted/30 border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="online">Online Only</SelectItem>
            <SelectItem value="offline">In-Person Only</SelectItem>
            <SelectItem value="both">Both Online & In-Person</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(consultationTypeFilter === "offline" ||
        consultationTypeFilter === "all" ||
        consultationTypeFilter === "both") && (
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">City</Label>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="bg-muted/30 border-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city!}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Gender</Label>
        <Select value={genderFilter} onValueChange={setGenderFilter}>
          <SelectTrigger className="bg-muted/30 border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Gender</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Price Range (Online)</Label>
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="bg-muted/30 border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="low">Budget (150 - 500 {t("currency.egp")})</SelectItem>
            <SelectItem value="medium">Value (500 - 1,500 {t("currency.egp")})</SelectItem>
            <SelectItem value="high">Premium (Above 1,500 {t("currency.egp")})</SelectItem>
            <SelectItem value="very-high">Specialized (Up to 20,000 {t("currency.egp")})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isMobile && (
        <div className="pt-4 lg:hidden">
          <SheetTrigger asChild>
            <Button className="w-full">View Results</Button>
          </SheetTrigger>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderNav showAuth={false} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:w-72">
            <Card className="p-6 sticky top-24 border-none shadow-sm bg-card/50 backdrop-blur">
              <FilterContent />
            </Card>
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Find Your Doctor</h1>
                <p className="text-muted-foreground mt-1">
                  {loading ? 'Discovering best doctors...' : `${doctors.length} specialists available right now`}
                </p>
              </div>

              {/* Mobile Filter Trigger */}
              <div className="lg:hidden w-full sm:w-auto">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto gap-2 border-primary/20 hover:border-primary/40 bg-card/50 backdrop-blur">
                      <Filter className="w-4 h-4" />
                      Filter Specialists
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh] rounded-t-[2rem] p-0 overflow-hidden">
                    <SheetHeader className="p-6 border-b text-left">
                      <SheetTitle className="text-2xl font-bold">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="p-6 h-full overflow-y-auto pb-24">
                      <FilterContent isMobile={true} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-6 space-y-4">
                    <div className="flex gap-4">
                      <Skeleton className="w-20 h-20 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </Card>
                ))}
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">No doctors found matching your filters.</p>
                <Button variant="outline" onClick={() => {
                  setSpecializationFilter('all')
                  setCityFilter('all')
                  setGenderFilter('all')
                  setConsultationTypeFilter('all')
                  setSearchTerm("")
                }}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {doctors.map((doctor) => (
                  <Card key={doctor.id} className="overflow-hidden hover:border-primary transition group">
                    <div className="p-6 space-y-4">
                      <div className="flex gap-4">
                        <img
                          src={doctor.image || "/placeholder.svg"}
                          alt={doctor.name}
                          className="w-20 h-20 rounded-lg object-cover ring-1 ring-border group-hover:ring-primary/50 transition-all"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{doctor.name}</h3>
                          <p className="text-sm text-primary">{doctor.specialization}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              <span className="text-sm font-medium">{doctor.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">({doctor.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {(doctor.consultationType === "online" || doctor.consultationType === "both") && (
                          <Badge variant="secondary" className="gap-1 bg-primary/5 text-primary border-none">
                            <Video className="w-3 h-3" />
                            Online
                          </Badge>
                        )}
                        {(doctor.consultationType === "offline" || doctor.consultationType === "both") && (
                          <Badge variant="secondary" className="gap-1 bg-secondary/50 border-none">
                            <MapPin className="w-3 h-3" />
                            In-Person
                          </Badge>
                        )}
                        {doctor.city && (
                          <Badge variant="outline" className="gap-1 border-border/50">
                            <BadgeIcon className="w-3 h-3" />
                            {doctor.city}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>

                      <div className="flex items-center gap-4 text-sm flex-wrap pt-2">
                        {(doctor.consultationType === "online" || doctor.consultationType === "both") && (
                          <div className="flex items-center gap-1">
                            <Video className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-foreground">
                              {doctor.priceOnline} {t("currency.egp")}
                            </span>
                          </div>
                        )}
                        <span className="text-muted-foreground">• {doctor.experience}y exp</span>
                      </div>

                      <Button asChild className="w-full shadow-lg shadow-primary/20">
                        <Link href={`/patient/doctor/${doctor.id}`}>View Profile & Book</Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
