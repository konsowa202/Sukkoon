"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { HeaderNav } from "@/components/header-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Heart, Loader2, Upload, CheckCircle2, User, Globe, Search, Copy, Check, Video, MapPin, Award, X } from "lucide-react"

export default function DonatePage() {
    const { t, language } = useLanguage()
    const { user } = useAuth()
    const { toast } = useToast()
    const router = useRouter()
    const isArabic = language === 'ar'

    const [doctors, setDoctors] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [copied, setCopied] = useState<string | null>(null)

    // Form State
    const [type, setType] = useState<"general" | "specific_doctor">("general")
    const [selectedDoctorId, setSelectedDoctorId] = useState<string>("")
    const [amount, setAmount] = useState<string>("")
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [donorName, setDonorName] = useState(user?.name || "")
    const [donorEmail, setDonorEmail] = useState(user?.email || "")
    const [proofImageUrl, setProofImageUrl] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('/api/doctors/public')
                if (response.ok) {
                    const data = await response.json()
                    setDoctors(data)
                }
            } catch (err) {
                console.error("Failed to fetch doctors", err)
            } finally {
                setLoading(false)
            }
        }
        fetchDoctors()
    }, [])

    const filteredDoctors = useMemo(() => {
        if (!searchQuery) return doctors
        return doctors.filter(doc =>
            doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [doctors, searchQuery])

    const selectedDoctor = useMemo(() => {
        return doctors.find(d => d.id === selectedDoctorId)
    }, [doctors, selectedDoctorId])

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        setCopied(label)
        toast({
            title: isArabic ? "تم النسخ" : "Copied",
            description: `${label}: ${text}`,
        })
        setTimeout(() => setCopied(null), 2000)
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('bucket', 'payment-proofs')

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (response.ok) {
                const data = await response.json()
                setProofImageUrl(data.url)
            } else {
                throw new Error("Upload failed")
            }
        } catch (err) {
            setError(isArabic ? "فشل رفع الصورة" : "Upload failed")
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async () => {
        if (!amount || !proofImageUrl) {
            setError(isArabic ? "يرجى إكمال جميع البيانات ورفع الإثبات" : "Please complete all fields and upload proof")
            return
        }

        setSubmitting(true)
        setError(null)

        try {
            const response = await fetch('/api/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId: type === 'specific_doctor' ? selectedDoctorId : null,
                    type,
                    amount: parseInt(amount),
                    proofImageUrl,
                    isAnonymous,
                    donorName: isAnonymous ? null : donorName,
                    donorEmail: isAnonymous ? null : donorEmail
                })
            })

            if (response.ok) {
                setSuccess(true)
                setTimeout(() => router.push('/'), 3000)
            } else {
                const data = await response.json()
                setError(data.error || "Submission failed")
            }
        } catch (err) {
            setError("Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background">
                <HeaderNav />
                <main className="container mx-auto px-4 py-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-3xl font-bold">{t("donate.success")}</h1>
                    <p className="text-muted-foreground">{isArabic ? "شكراً لمساهمتك الكريمة. سيتم مراجعة طلبك من قبل المشرفين." : "Thank you for your generous contribution. Your request will be reviewed by administrators."}</p>
                    <Button onClick={() => router.push('/')}>{isArabic ? "العودة للرئيسية" : "Back to Home"}</Button>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <HeaderNav />
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                        <Heart className="w-3 h-3" />
                        {t("nav.donate")}
                    </div>
                    <h1 className="text-4xl font-black tracking-tight">{t("donate.title")}</h1>
                    <p className="text-muted-foreground text-lg">{t("donate.subtitle")}</p>
                </div>

                <div className="grid md:grid-cols-12 gap-8">
                    {/* Left Side: Form */}
                    <div className="md:col-span-12 space-y-8">
                        {/* Payment Info Section */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Card className="p-6 border-primary/20 bg-primary/5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            V
                                        </div>
                                        Vodafone Cash
                                    </h3>
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCopy("01006119365", "Vodafone Cash")}>
                                        {copied === "Vodafone Cash" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                                <div className="text-2xl font-black tracking-widest text-center py-2 bg-background/50 rounded-xl">01006119365</div>
                            </Card>
                            <Card className="p-6 border-primary/20 bg-primary/5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            I
                                        </div>
                                        InstaPay
                                    </h3>
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCopy("01102553741", "InstaPay")}>
                                        {copied === "InstaPay" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                                <div className="text-xl font-black tracking-tight text-center py-2 bg-background/50 rounded-xl">01102553741</div>
                            </Card>
                        </div>

                        <Card className="p-8 border-primary/10 shadow-xl space-y-8">
                            {/* Donation Type Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant={type === 'general' ? 'default' : 'outline'}
                                    onClick={() => setType('general')}
                                    className="h-20 flex-col gap-1 rounded-2xl"
                                >
                                    <Globe className="w-5 h-5" />
                                    {t("donate.type.general")}
                                </Button>
                                <Button
                                    variant={type === 'specific_doctor' ? 'default' : 'outline'}
                                    onClick={() => setType('specific_doctor')}
                                    className="h-20 flex-col gap-1 rounded-2xl"
                                >
                                    <User className="w-5 h-5" />
                                    {t("donate.type.doctor")}
                                </Button>
                            </div>

                            {/* Specific Doctor Selection */}
                            {type === 'specific_doctor' && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>{isArabic ? "ابحث عن الطبيب" : "Search for Doctor"}</Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                className="pl-10 h-12 rounded-xl"
                                                placeholder={isArabic ? "اكتب اسم الطبيب أو تخصصه..." : "Type doctor name or specialization..."}
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {searchQuery && (
                                        <div className="max-h-60 overflow-y-auto border rounded-xl divide-y">
                                            {filteredDoctors.length > 0 ? (
                                                filteredDoctors.map(doc => (
                                                    <button
                                                        key={doc.id}
                                                        className={`w-full text-left p-4 hover:bg-muted transition-colors flex items-center justify-between ${selectedDoctorId === doc.id ? 'bg-primary/5' : ''}`}
                                                        onClick={() => {
                                                            setSelectedDoctorId(doc.id)
                                                            setSearchQuery("")
                                                        }}
                                                    >
                                                        <div>
                                                            <p className="font-bold">{doc.name}</p>
                                                            <p className="text-xs text-muted-foreground">{doc.specialization}</p>
                                                        </div>
                                                        {selectedDoctorId === doc.id && <Check className="w-4 h-4 text-primary" />}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-sm text-muted-foreground">
                                                    {isArabic ? "لا توجد نتائج" : "No results found"}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Selected Doctor Card Preview */}
                                    {selectedDoctor && (
                                        <Card className="p-4 border-primary/20 bg-primary/5 flex items-center gap-4 relative group animate-in fade-in slide-in-from-top-2">
                                            <img src={"/placeholder.svg"} className="w-16 h-16 rounded-xl object-cover" alt={selectedDoctor.name} />
                                            <div className="flex-1">
                                                <p className="font-bold text-lg">{selectedDoctor.name}</p>
                                                <p className="text-sm text-primary">{selectedDoctor.specialization}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-[10px] h-5">{selectedDoctor.priceOnline} EGP</Badge>
                                                    <Badge variant="outline" className="text-[10px] h-5">{selectedDoctor.experience} {isArabic ? "سنوات" : "Years"}</Badge>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                                                onClick={() => setSelectedDoctorId("")}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* Amount */}
                            <div className="space-y-2">
                                <Label>{t("donate.amount")} ({t("currency.egp")})</Label>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="h-12 text-lg font-bold rounded-xl"
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Donor Info */}
                            <div className="space-y-6 pt-4 border-t border-border/50">
                                <div className="flex items-center justify-between">
                                    <Label className="flex flex-col gap-1">
                                        <span>{t("donate.anonymous")}</span>
                                        <span className="text-xs text-muted-foreground font-normal">
                                            {isArabic ? "لن يظهر اسمك في قائمة المتبرعين" : "Your name won't be visible in the donor list"}
                                        </span>
                                    </Label>
                                    <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                                </div>

                                {!isAnonymous && (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>{isArabic ? "الاسم" : "Name"}</Label>
                                            <Input value={donorName} onChange={e => setDonorName(e.target.value)} className="rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{isArabic ? "البريد الإلكتروني" : "Email"}</Label>
                                            <Input type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)} className="rounded-xl" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Payment Proof */}
                            <div className="space-y-4 pt-4 border-t border-border/50">
                                <Label>{isArabic ? "إثبات الدفع (صورة التحويل)" : "Payment Proof (Screenshot)"}</Label>
                                <div className="border-2 border-dashed rounded-2xl p-8 text-center bg-muted/30 hover:bg-muted/50 transition-colors relative">
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
                                    {uploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            <p className="text-sm font-medium">{isArabic ? "جاري الرفع..." : "Uploading..."}</p>
                                        </div>
                                    ) : proofImageUrl ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                                            <p className="text-sm font-medium text-green-500">{isArabic ? "تم الرفع بنجاح" : "Uploaded successfully"}</p>
                                            <img src={proofImageUrl} className="mt-2 max-h-32 rounded-lg" alt="Proof" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <Upload className="w-8 h-8 text-muted-foreground" />
                                            <p className="text-sm font-medium">{isArabic ? "اضغط لرفع صورة التحويل" : "Click to upload transfer receipt"}</p>
                                            <p className="text-xs text-muted-foreground">InstaPay, Vodafone Cash, or Bank Transfer</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <Button
                                className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20"
                                disabled={submitting || uploading}
                                onClick={handleSubmit}
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t("donate.cta")}
                            </Button>
                        </Card>

                        <div className="bg-muted/50 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold flex items-center gap-2">
                                <Globe className="w-4 h-4 text-primary" />
                                {isArabic ? "كيف يتم التبرع؟" : "How does it work?"}
                            </h3>
                            <div className="text-sm text-muted-foreground space-y-2">
                                <p>1. {isArabic ? "اختر نوع التبرع (عام أو لطبيب محدد)." : "Choose donation type (General or Specific Doctor)."}</p>
                                <p>2. {isArabic ? "قم بتحويل المبلغ عبر فودافون كاش أو إنستا باي." : "Transfer the amount via Vodafone Cash or InstaPay."}</p>
                                <p>3. {isArabic ? "ارفع صورة التحويل واضغط على تبرع الآن." : "Upload the receipt and click Donate Now."}</p>
                                <p>4. {isArabic ? "بعد مراجعة الأدمن، سيتم إضافة رصيد جلسات مجانية للمرضى المحتاجين." : "After admin review, free session credits will be added for patients in need."}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
