import { Metadata } from "next"
import { notFound } from "next/navigation"
import { supabaseServer } from "@/lib/db"
import { DoctorProfileClient } from "@/components/doctor-profile-client"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id
  if (!supabaseServer) return { title: "دكتور نفسي | سكون" }

  const { data: doctor } = await supabaseServer
    .from('doctors')
    .select('name, specialization')
    .eq('id', id)
    .single()

  if (!doctor) return { title: "دكتور غير موجود | سكون" }

  return {
    title: `دكتور ${doctor.name} - ${doctor.specialization} | سكون للصحة النفسية`,
    description: `احجز موعدك الآن مع دكتور ${doctor.name}، متخصص في ${doctor.specialization}. جلسات أونلاين وبأفضل الأسعار على منصة سكون.`,
    keywords: [doctor.name, doctor.specialization, "علاج نفسي", "دكتور نفسي مصر", "سكون"],
  }
}

export default async function DoctorProfilePage({ params }: { params: { id: string } }) {
  const id = params.id

  if (!supabaseServer) {
    return <div>Database connection missing.</div>
  }

  const { data: doctor } = await supabaseServer
    .from('doctors')
    .select('*')
    .eq('id', id)
    .single()

  if (!doctor) {
    notFound()
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
