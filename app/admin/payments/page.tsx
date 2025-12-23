"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HeaderNav } from "@/components/header-nav"
import { Check, X, Eye, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface Payment {
  id: string
  appointmentId: string
  amount: number
  method: 'bank_transfer' | 'vodafone_cash' | 'instapay'
  status: 'pending' | 'approved' | 'rejected'
  proofImageUrl?: string
  createdAt: string
  patientName?: string
  doctorName?: string
  appointmentDate?: string
  appointmentTime?: string
  appointment?: {
    id: string
    patientName: string
    doctorName: string
    date: string
    time: string
    service: string
  }
}

export default function PaymentsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showProof, setShowProof] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchPayments()
    }
  }, [user])

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch('/api/payments', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const [meetLinks, setMeetLinks] = useState<Record<string, string>>({})

  const handleApprove = async (paymentId: string) => {
    setProcessing(paymentId)
    try {
      const token = localStorage.getItem('sukoon_token')
      const payment = payments.find(p => p.id === paymentId)
      const meetLink = meetLinks[payment?.appointmentId || '']

      // 1. Approve payment
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ status: 'approved' })
      })

      if (response.ok) {
        // 2. Update appointment with meet link if provided
        if (meetLink && payment?.appointmentId) {
          await fetch(`/api/appointments/${payment.appointmentId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : ''
            },
            body: JSON.stringify({ meetLink })
          })
        }
        await fetchPayments()
        // Clear meet link state for this appointment
        if (payment?.appointmentId) {
          const newLinks = { ...meetLinks }
          delete newLinks[payment.appointmentId]
          setMeetLinks(newLinks)
        }
      }
    } catch (error) {
      console.error('Failed to approve payment:', error)
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (paymentId: string) => {
    setProcessing(paymentId)
    try {
      const token = localStorage.getItem('sukoon_token')
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ status: 'rejected' })
      })

      if (response.ok) {
        await fetchPayments()
      }
    } catch (error) {
      console.error('Failed to reject payment:', error)
    } finally {
      setProcessing(null)
    }
  }

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading || !user || user.role !== 'admin') {
    return null
  }

  const pendingPayments = payments.filter(p => p.status === 'pending')
  const approvedPayments = payments.filter(p => p.status === 'approved')
  const rejectedPayments = payments.filter(p => p.status === 'rejected')

  return (
    <div className="min-h-screen bg-background">
      <HeaderNav showAuth={false} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Payment Verification</h1>
          <p className="text-muted-foreground">Review and verify payment proofs</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-bold">{pendingPayments.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-600">{approvedPayments.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{rejectedPayments.length}</p>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading payments...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingPayments.length === 0 && !loading ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No pending payments</p>
              </Card>
            ) : (
              pendingPayments.map((payment) => (
                <Card key={payment.id} className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Pending</Badge>
                        <Badge variant="secondary" className="capitalize">
                          {payment.method.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Patient</p>
                          <p className="font-medium">{payment.patientName || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">Amount: {payment.amount} EGP</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Session</p>
                          <p className="font-medium">{payment.doctorName || 'Dr. Unknown'}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.appointmentDate} at {payment.appointmentTime}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Meeting Link (Optional)</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://meet.google.com/xxx-xxxx-xxx"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={meetLinks[payment.appointmentId] || ''}
                            onChange={(e) => setMeetLinks({ ...meetLinks, [payment.appointmentId]: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto pt-4 md:pt-0">
                      {payment.proofImageUrl && (
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setSelectedPayment(payment)
                            setShowProof(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Proof
                        </Button>
                      )}
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApprove(payment.id)}
                        disabled={processing === payment.id}
                      >
                        {processing === payment.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleReject(payment.id)}
                        disabled={processing === payment.id}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Proof Image Dialog */}
      <Dialog open={showProof} onOpenChange={setShowProof}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Proof - {selectedPayment?.patientName}</DialogTitle>
          </DialogHeader>
          {selectedPayment?.proofImageUrl && (
            <div className="mt-4 flex justify-center bg-muted rounded-lg p-2">
              <img
                src={selectedPayment.proofImageUrl}
                alt="Payment proof"
                className="max-w-full h-auto rounded-lg shadow-lg border-4 border-white"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

