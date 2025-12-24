"use client"

import { useState, useEffect } from "react"
import { HeaderNav } from "@/components/header-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Loader2, Check, X, Eye, ExternalLink, Heart } from "lucide-react"

export default function AdminDonationsPage() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [donations, setDonations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/login')
        } else if (user?.role === 'admin') {
            fetchDonations()
        }
    }, [user, authLoading])

    const fetchDonations = async () => {
        try {
            const token = localStorage.getItem('sukoon_token')
            const response = await fetch('/api/admin/donations', { // Note: I need to create this admin-specific GET or reuse general GET if it handles auth
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setDonations(data)
            }
        } catch (err) {
            console.error("Failed to fetch donations", err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
        setActionLoading(id)
        try {
            const token = localStorage.getItem('sukoon_token')
            const response = await fetch(`/api/donations/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            })
            if (response.ok) {
                setDonations(prev => prev.map(d => d.id === id ? { ...d, status } : d))
            }
        } catch (err) {
            console.error("Failed to update status", err)
        } finally {
            setActionLoading(null)
        }
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <HeaderNav />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Heart className="w-8 h-8 text-primary" />
                            Donations Management
                        </h1>
                        <p className="text-muted-foreground">Review and approve community contributions</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {donations.length === 0 ? (
                        <Card className="p-12 text-center text-muted-foreground">
                            No donations found.
                        </Card>
                    ) : (
                        donations.map((donation) => (
                            <Card key={donation.id} className="p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Badge variant={donation.status === 'approved' ? 'default' : donation.status === 'rejected' ? 'destructive' : 'secondary'}>
                                                {donation.status.toUpperCase()}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {new Date(donation.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase font-bold">Donor</p>
                                                <p className="font-medium">{donation.is_anonymous ? "Anonymous" : (donation.donor_name || "Guest")}</p>
                                                {!donation.is_anonymous && donation.donor_email && <p className="text-xs text-muted-foreground">{donation.donor_email}</p>}
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase font-bold">Target</p>
                                                <p className="font-medium">{donation.type === 'general' ? 'General Fund' : (donation.doctors?.users?.name || 'Specific Doctor')}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase font-bold">Amount</p>
                                                <p className="font-bold text-primary">{donation.amount} EGP</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase font-bold">Proof</p>
                                                <a
                                                    href={donation.proof_image_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                                >
                                                    View Image <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {donation.status === 'pending' && (
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                className="border-green-500 text-green-500 hover:bg-green-500/10"
                                                onClick={() => handleUpdateStatus(donation.id, 'approved')}
                                                disabled={!!actionLoading}
                                            >
                                                {actionLoading === donation.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="border-destructive text-destructive hover:bg-destructive/10"
                                                onClick={() => handleUpdateStatus(donation.id, 'rejected')}
                                                disabled={!!actionLoading}
                                            >
                                                {actionLoading === donation.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}
