import { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabaseServer } from "@/lib/db"
import { DoctorProfileClient } from "@/components/doctor-profile-client"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  if (!supabaseServer) return { title: "دكتور نفسي | سكون" }

  const { data: doctor } = await supabaseServer
    .from('doctors')
    .select(`
      specialization,
      users:user_id (
        name
      )
    `)
    .eq('id', id)
    .single()

  if (!doctor || !doctor.users) return { title: "دكتور غير موجود | سكون" }

  const doctorName = (doctor.users as any).name;

  return {
    title: `دكتور ${doctorName} - ${doctor.specialization} | سكون للصحة النفسية`,
    description: `احجز موعدك الآن مع دكتور ${doctorName}، متخصص في ${doctor.specialization}. جلسات أونلاين وبأفضل الأسعار على منصة سكون.`,
    keywords: [doctorName, doctor.specialization, "علاج نفسي", "دكتور نفسي مصر", "سكون"],
  }
}

export default async function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!supabaseServer) {
    return <div>Database connection missing.</div>
  }

  const { data: rawDoctor } = await supabaseServer
    .from('doctors')
    .select(`
        *,
        users:user_id (
          name,
          image_url
        )
    `)
    .eq('id', id)
    .single()

  if (!rawDoctor || !rawDoctor.users) {
    notFound()
  }

  const doctor = {
    id: rawDoctor.id,
    name: (rawDoctor.users as any).name,
    specialization: rawDoctor.specialization,
    bio: rawDoctor.bio,
    image: (rawDoctor.users as any).image_url || rawDoctor.image_url || "/placeholder.svg",
    rating: parseFloat(rawDoctor.rating as any) || 0,
    reviewCount: rawDoctor.review_count || 0,
    priceOnline: rawDoctor.price_online,
    priceOffline: rawDoctor.price_offline,
    experience: rawDoctor.experience || 0,
    gender: rawDoctor.gender,
    languages: rawDoctor.languages || [],
    availability: rawDoctor.availability || {},
    consultationType: rawDoctor.consultation_type,
    location: rawDoctor.location,
    city: rawDoctor.city
  }

  const { data: busySlots } = await supabaseServer
    .from('appointments')
    .select('date, time')
    .eq('doctor_id', id)
    .in('status', ['confirmed', 'paid'])

  return (
    <DoctorProfileClient
      doctor={doctor as any}
      doctorId={id}
      busySlotsInitial={busySlots || []}
    />
  )
}
