"use client"

import { useState, useEffect, memo } from "react"

const DoctorCard = memo(({ doctor, t, isAr, formatPrice }: { doctor: Doctor, t: any, isAr: boolean, formatPrice: (price: number, spec?: string) => string }) => {
  // Find localized governorate
  const gov = EGYPTIAN_GOVERNORATES.find(g => g.en.toLowerCase() === doctor.city?.toLowerCase());
  const localizedCity = gov ? (isAr ? gov.ar : gov.en) : doctor.city;

  // Find localized specialization
  const spec = DOCTOR_SPECIALIZATIONS.find(s => s.en.toLowerCase() === doctor.specialization?.toLowerCase());
  const localizedSpec = spec ? (isAr ? spec.ar : spec.en) : doctor.specialization;

  return (
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
            <p className="text-sm text-primary">{localizedSpec}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-medium">{doctor.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">({doctor.reviewCount} {t("search.reviews")})</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(doctor.consultationType === "online" || doctor.consultationType === "both") && (
            <Badge variant="secondary" className="gap-1 bg-primary/5 text-primary border-none">
              <Video className="w-3 h-3" />
              {t("search.online")}
            </Badge>
          )}
          {(doctor.consultationType === "offline" || doctor.consultationType === "both") && (
            <Badge variant="secondary" className="gap-1 bg-secondary/50 border-none">
              <MapPin className="w-3 h-3" />
              {t("search.offline")}
            </Badge>
          )}
          {doctor.city && (
            <Badge variant="outline" className="gap-1 border-border/50">
              <MapPin className="w-3 h-3" />
              {localizedCity}
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">{doctor.bio}</p>

        <div className="flex items-center gap-4 text-sm flex-wrap pt-2">
          {(doctor.consultationType === "online" || doctor.consultationType === "both") && (
            <div className="flex items-center gap-1">
              <Video className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">
                {formatPrice(doctor.priceOnline, doctor.specialization)}
              </span>
            </div>
          )}
          <span className="text-muted-foreground">• {doctor.experience} {t("search.exp")}</span>
        </div>

        <Button asChild className="w-full shadow-lg shadow-primary/20">
          <Link href={`/patient/doctor/${doctor.id}`}>{t("search.viewProfile")}</Link>
        </Button>
      </div>
    </Card>
  )
})
DoctorCard.displayName = "DoctorCard"

const DoctorList = memo(({ doctors, t, isAr, isFiltering, formatPrice }: { doctors: Doctor[], t: any, isAr: boolean, isFiltering: boolean, formatPrice: (price: number, spec?: string) => string }) => (
  <div className={`grid md:grid-cols-2 gap-6 ${isFiltering ? 'opacity-50 pointer-events-none transition-opacity' : ''}`}>
    {doctors.map((doctor) => (
      <DoctorCard key={doctor.id} doctor={doctor} t={t} isAr={isAr} formatPrice={formatPrice} />
    ))}
  </div>
))
DoctorList.displayName = "DoctorList"
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
import { useLocation } from "@/contexts/location-context"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { EGYPTIAN_GOVERNORATES, DOCTOR_SPECIALIZATIONS } from "@/lib/constants"

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const FilterContent = ({
  isMobile = false,
  t,
  isAr,
  searchTerm,
  setSearchTerm,
  specializationFilter,
  setSpecializationFilter,
  consultationTypeFilter,
  setConsultationTypeFilter,
  cityFilter,
  setCityFilter,
  genderFilter,
  setGenderFilter,
  priceRange,
  setPriceRange
}: {
  isMobile?: boolean,
  t: any,
  isAr: boolean,
  searchTerm: string,
  setSearchTerm: (v: string) => void,
  specializationFilter: string,
  setSpecializationFilter: (v: string) => void,
  consultationTypeFilter: string,
  setConsultationTypeFilter: (v: string) => void,
  cityFilter: string,
  setCityFilter: (v: string) => void,
  genderFilter: string,
  setGenderFilter: (v: string) => void,
  priceRange: string,
  setPriceRange: (v: string) => void
}) => (
  <div className="space-y-6">
    {!isMobile && (
      <div className="mb-2">
        <h3 className="font-semibold text-lg">{t("search.filterLabel")}</h3>
      </div>
    )}

    <div className="space-y-2">
      <Label htmlFor="search" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{t("search.nameLabel")}</Label>
      <div className="relative">
        <Search className={`${isAr ? 'right-3' : 'left-3'} absolute top-3 h-4 w-4 text-muted-foreground`} />
        <Input
          id="search"
          placeholder={t("search.namePlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${isAr ? 'pr-9' : 'pl-9'} bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary`}
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{t("search.specLabel")}</Label>
      <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
        <SelectTrigger className="bg-muted/30 border-none">
          <SelectValue placeholder={t("search.allSpec")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("search.allSpec")}</SelectItem>
          {DOCTOR_SPECIALIZATIONS.map((spec) => (
            <SelectItem key={spec.en} value={spec.en}>
              {isAr ? spec.ar : spec.en}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{t("search.typeLabel")}</Label>
      <Select value={consultationTypeFilter} onValueChange={setConsultationTypeFilter}>
        <SelectTrigger className="bg-muted/30 border-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("search.allTypes")}</SelectItem>
          <SelectItem value="online">{t("search.onlineOnly")}</SelectItem>
          <SelectItem value="offline">{t("search.offlineOnly")}</SelectItem>
          <SelectItem value="both">{t("search.bothTypes")}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {(consultationTypeFilter === "offline" ||
      consultationTypeFilter === "all" ||
      consultationTypeFilter === "both") && (
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{t("search.cityLabel")}</Label>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="bg-muted/30 border-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("search.cityLabel")} ( {t("search.anyGender")} )</SelectItem>
              {EGYPTIAN_GOVERNORATES.map((gov) => (
                <SelectItem key={gov.en} value={gov.en}>
                  {isAr ? gov.ar : gov.en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

    <div className="space-y-2">
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{t("search.genderLabel")}</Label>
      <Select value={genderFilter} onValueChange={setGenderFilter}>
        <SelectTrigger className="bg-muted/30 border-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("search.anyGender")}</SelectItem>
          <SelectItem value="male">{t("search.male")}</SelectItem>
          <SelectItem value="female">{t("search.female")}</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">{t("search.priceLabel")}</Label>
      <Select value={priceRange} onValueChange={setPriceRange}>
        <SelectTrigger className="bg-muted/30 border-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("search.allPrices")}</SelectItem>
          <SelectItem value="low">{t("search.price.budget")}</SelectItem>
          <SelectItem value="medium">{t("search.price.value")}</SelectItem>
          <SelectItem value="high">{t("search.price.premium")}</SelectItem>
          <SelectItem value="very-high">{t("search.price.specialized")}</SelectItem>
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

export default function SearchDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [specializationFilter, setSpecializationFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [consultationTypeFilter, setConsultationTypeFilter] = useState("all")
  const [cityFilter, setCityFilter] = useState("all")
  const debouncedSearchTerm = useDebounce(searchTerm, 800)
  const { t, language } = useLanguage()
  const { formatPrice } = useLocation()
  const isAr = language === "ar"
  const { user, isLoading: authLoading } = useAuth()

  const fetchDoctors = async (showMainSkeleton = false) => {
    if (showMainSkeleton) setLoading(true)
    else setIsFiltering(true)

    try {
      const params = new URLSearchParams()
      if (specializationFilter !== 'all') params.append('specialization', specializationFilter)
      if (genderFilter !== 'all') params.append('gender', genderFilter)
      if (consultationTypeFilter !== 'all') params.append('consultationType', consultationTypeFilter)
      if (cityFilter !== 'all') params.append('city', cityFilter)
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm)

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
      setIsFiltering(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchDoctors(true)
  }, [])

  // Refetch on filter change
  useEffect(() => {
    const isInitialLoad = loading && doctors.length === 0
    if (!isInitialLoad) {
      fetchDoctors(false)
    }
  }, [debouncedSearchTerm, specializationFilter, genderFilter, priceRange, consultationTypeFilter, cityFilter])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderNav showAuth={false} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:w-72">
            <Card className="p-6 sticky top-24 border-none shadow-sm bg-card/50 backdrop-blur">
              <FilterContent
                t={t}
                isAr={isAr}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                specializationFilter={specializationFilter}
                setSpecializationFilter={setSpecializationFilter}
                consultationTypeFilter={consultationTypeFilter}
                setConsultationTypeFilter={setConsultationTypeFilter}
                cityFilter={cityFilter}
                setCityFilter={setCityFilter}
                genderFilter={genderFilter}
                setGenderFilter={setGenderFilter}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </Card>
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">{t("search.title")}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                    {t("search.pricing.therapist")}
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border-none">
                    {t("search.pricing.psychiatrist")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium opacity-80">
                  {t("search.pricing.note")}
                </p>
              </div>

              {/* Mobile Filter Trigger */}
              <div className="lg:hidden w-full sm:w-auto">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto gap-2 border-primary/20 hover:border-primary/40 bg-card/50 backdrop-blur">
                      <Filter className="w-4 h-4" />
                      {t("search.filterButton")}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[80vh] rounded-t-[2rem] p-0 overflow-hidden">
                    <SheetHeader className="p-6 border-b text-left">
                      <SheetTitle className="text-2xl font-bold">{t("search.filterLabel")}</SheetTitle>
                    </SheetHeader>
                    <div className="p-6 h-full overflow-y-auto pb-24">
                      <FilterContent
                        isMobile={true}
                        t={t}
                        isAr={isAr}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        specializationFilter={specializationFilter}
                        setSpecializationFilter={setSpecializationFilter}
                        consultationTypeFilter={consultationTypeFilter}
                        setConsultationTypeFilter={setConsultationTypeFilter}
                        cityFilter={cityFilter}
                        setCityFilter={setCityFilter}
                        genderFilter={genderFilter}
                        setGenderFilter={setGenderFilter}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                      />
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
                <p className="text-muted-foreground text-lg mb-4">{t("search.noResults")}</p>
                <Button variant="outline" onClick={() => {
                  setSpecializationFilter('all')
                  setCityFilter('all')
                  setGenderFilter('all')
                  setConsultationTypeFilter('all')
                  setSearchTerm("")
                }}>
                  {t("search.clearFilters")}
                </Button>
              </div>
            ) : (
              <DoctorList doctors={doctors} t={t} isAr={isAr} isFiltering={isFiltering} formatPrice={formatPrice} />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
