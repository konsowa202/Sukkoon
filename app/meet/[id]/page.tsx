/* "use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { JitsiMeet } from "@/components/jitsi-meet"
import { useAuth } from "@/contexts/auth-context"
import { HeaderNav } from "@/components/header-nav"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MeetingPage() {
    const { id } = useParams()
    const router = useRouter()
    const { user, isLoading: authLoading } = useAuth()
    const [appointment, setAppointment] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login")
            return
        }

        if (user && id) {
            fetchAppointment()
        }
    }, [user, id, authLoading])

    const fetchAppointment = async () => {
        try {
            const token = localStorage.getItem("sukoon_token")
            const response = await fetch(`/api/appointments`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (response.ok) {
                const data = await response.json()
                const appt = data.find((a: any) => a.id === id)
                if (appt) {
                    setAppointment(appt)
                }
            }
        } catch (error) {
            console.error("Failed to fetch appointment:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleLeave = () => {
        if (user?.role === "doctor") {
            router.push("/doctor/dashboard")
        } else {
            router.push("/patient/dashboard")
        }
    }

    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        )
    }

    if (!appointment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4">
                <h1 className="text-2xl font-bold text-white mb-4">Meeting not found</h1>
                <Button onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <HeaderNav />
            <div className="flex-1 container mx-auto px-4 py-6">
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white uppercase tracking-wider">{appointment.service}</h1>
                        <p className="text-slate-400 text-sm">Session with {user?.role === "doctor" ? appointment.patientName : appointment.doctorName}</p>
                    </div>
                    <Button variant="outline" className="border-slate-800 text-slate-300" onClick={handleLeave}>
                        Leave Session
                    </Button>
                </div>
                <div className="h-[calc(100vh-250px)] min-h-[500px] relative">
                    <JitsiMeet
                        roomName={`Sukoon-${appointment.id}`}
                        userName={user?.name || "User"}
                        onLeave={handleLeave}
                    />
                    {user?.role === 'doctor' && (
                        <div className="absolute top-2 right-2 z-10 opacity-50 hover:opacity-100 transition-opacity">
                            <div className="bg-slate-900/80 backdrop-blur p-2 rounded text-[10px] text-slate-400 border border-slate-800 max-w-[200px]">
                                Note: If prompted for moderator login, please use your Google/GitHub account to start the session.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
*/
