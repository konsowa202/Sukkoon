"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ArrowRight, MapPin, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Doctor } from "@/lib/fallback-data"
import { useLanguage } from "@/contexts/language-context"
import { useLocation } from "@/contexts/location-context"
import { Skeleton } from "@/components/ui/skeleton"
import { EGYPTIAN_GOVERNORATES, DOCTOR_SPECIALIZATIONS } from "@/lib/constants"

export function FeaturedDoctors() {
    const { t, language } = useLanguage()
    const { formatPrice } = useLocation()
    const isAr = language === "ar"
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('/api/doctors')
                if (response.ok) {
                    const data = await response.json()
                    setDoctors(data.slice(0, 4))
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

        fetchDoctors()
    }, [])

    return (
        <section className="container mx-auto px-4 py-20">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight">{isAr ? "شركائنا من الأطباء" : "Our Partner Doctors"}</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        {isAr ? "نخبة من أفضل المتخصصين في الصحة النفسية شركاء النجاح في منصتنا." : "A selection of the best mental health specialists, our partners in success."}
                    </p>
                </div>
                <Button asChild variant="ghost" className="hidden md:flex gap-2 text-primary hover:text-primary hover:bg-primary/10 rounded-full">
                    <Link href="/patient/search" className="flex items-center gap-2">
                        {isAr ? "عرض جميع الشركاء" : "View All Partners"} <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                    </Link>
                </Button>
            </div>

            {/* Responsive Container: Horizontal Scroll on Mobile, Grid on Desktop */}
            <div className="flex -mx-4 px-4 overflow-x-auto pb-8 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:overflow-visible md:pb-0 hide-scrollbar">
                {loading ? (
                    // Skeleton Loading State
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-center">
                            <Card className="p-6 space-y-4 h-full border-none bg-card">
                                <Skeleton className="h-48 w-full rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <div className="flex gap-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-4 w-1/4" />
                                </div>
                                <div className="pt-4 border-t flex justify-between items-center">
                                    <div className="space-y-1">
                                        <Skeleton className="h-3 w-12" />
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                    <Skeleton className="h-9 w-24 rounded-md" />
                                </div>
                            </Card>
                        </div>
                    ))
                ) : (
                    doctors.map((doctor) => {
                        const gov = EGYPTIAN_GOVERNORATES.find(g => g.en.toLowerCase() === doctor.city?.toLowerCase());
                        const localizedCity = gov ? (isAr ? gov.ar : gov.en) : (doctor.city || (isAr ? "أونلاين" : "Online"));

                        const spec = DOCTOR_SPECIALIZATIONS.find(s => s.en.toLowerCase() === doctor.specialization?.toLowerCase());
                        const localizedSpec = spec ? (isAr ? spec.ar : spec.en) : doctor.specialization;

                        return (
                            <div key={doctor.id} className="min-w-[260px] sm:min-w-[300px] md:min-w-0 snap-center relative group">
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                
                                <Card className="relative h-full transition-all duration-500 hover:-translate-y-2 border border-border/50 bg-background/50 backdrop-blur-xl hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:border-primary/30 rounded-3xl overflow-hidden flex flex-col items-center text-center p-8">
                                    <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/40 transition-all duration-500 shadow-xl">
                                        <Image
                                            src={doctor.image || "/placeholder.svg"}
                                            alt={doctor.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>

                                    <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur text-foreground font-bold border border-border shadow-sm">
                                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500 mr-1" />
                                        {doctor.rating}
                                    </Badge>

                                    <div className="space-y-2 w-full">
                                        <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:to-primary transition-colors">{doctor.name}</h3>
                                        <p className="text-sm font-bold text-primary">{localizedSpec}</p>
                                    </div>

                                    <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-muted-foreground mt-6 w-full">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full">
                                            <Globe className="w-3.5 h-3.5" />
                                            {doctor.languages?.[0]} {doctor.languages?.length > 1 && `+${doctor.languages.length - 1}`}
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-full">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {localizedCity}
                                        </div>
                                    </div>
                                    
                                    {/* Removed Pricing and Booking Button completely as requested */}
                                </Card>
                            </div>
                        )
                    })
                )}
            </div>

            <div className="mt-8 md:hidden">
                <Button asChild variant="outline" className="w-full">
                    <Link href="/patient/search">{t("doctors.viewAll")}</Link>
                </Button>
            </div>

            <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </section>
    )
}
