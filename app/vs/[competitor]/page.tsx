import { Metadata } from 'next'
import { HeaderNav } from "@/components/header-nav"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Check, X, Shield, Zap, Heart } from "lucide-react"
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ competitor: string }> }): Promise<Metadata> {
    const { competitor: competitorParam } = await params
    const competitor = competitorParam.charAt(0).toUpperCase() + competitorParam.slice(1)
    const competitorAr = competitorParam === 'shezlong' ? 'شيزلونج' : competitorParam === 'labayh' ? 'لبيه' : competitorParam === 'otida' ? 'أوتبا' : competitor

    return {
        title: `أفضل بديل لـ ${competitorAr} في مصر | سكون للصحة النفسية`,
        description: `هل تبحث عن أسعار ${competitorAr}؟ اكتشف لماذا يعتبر سكون هو البديل الأفضل والأكثر توفيراً وخصوصية في مصر. جلسات علاج نفسي أونلاين مع أفضل الأطباء.`,
        keywords: [
            `${competitor} alternative`,
            `${competitorAr} بديل`,
            `أسعار ${competitorAr}`,
            `مميزات ${competitorAr}`,
            "أفضل منصة علاج نفسي",
            "دكتور نفسي شاطر"
        ],
    }
}

export default async function ComparisonPage({ params }: { params: Promise<{ competitor: string }> }) {
    const { competitor: competitorParam } = await params
    const competitor = competitorParam.charAt(0).toUpperCase() + competitorParam.slice(1)
    const competitorAr = competitorParam === 'shezlong' ? 'شيزلونج' : competitorParam === 'labayh' ? 'لبيه' : competitorParam === 'otida' ? 'أوتبا' : competitor

    // JSON-LD for Search Engines
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Sukoon Mental Health Platform",
        "description": `The best alternative to ${competitor} in Egypt. Offers personalized library and lower prices.`,
        "brand": {
            "@type": "Brand",
            "name": "Sukoon"
        },
        "offers": {
            "@type": "Offer",
            "url": "https://www.suukoon.com/signup",
            "priceCurrency": "EGP",
            "availability": "https://schema.org/InStock"
        }
    }

    const features = [
        { name: "Verified Doctors (أطباء معتمدون)", sukoon: true, competitor: true },
        { name: "Online Video Sessions (جلسات فيديو)", sukoon: true, competitor: true },
        { name: "Personalized Library (مكتبة مخصصة)", sukoon: true, competitor: false },
        { name: "Post-Session Chat (دردشة بعد الجلسة)", sukoon: true, competitor: false },
        { name: "Total Privacy (خصوصية تامة)", sukoon: true, competitor: true },
        { name: "No Hidden Fees (بدون رسوم مخفية)", sukoon: true, competitor: false },
        { name: "Fast Support (دعم فني سريع)", sukoon: true, competitor: false },
    ]

    return (
        <div className="min-h-screen bg-background text-pretty">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HeaderNav />
            <main className="container mx-auto px-4 py-16 max-w-5xl">
                <div className="text-center mb-16 space-y-6">
                    <div className="flex justify-center">
                        <span className="px-4 py-1 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-full animate-pulse">
                            أفضل بديل في مصر لعام 2025
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        سكون (Sukoon) vs <span className="text-primary">{competitorAr}</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        بتدور على بديل لـ <span className="font-bold text-foreground">{competitorAr}</span>؟
                        اكتشف ليه "سكون" هي الاختيار الأول لآلاف المرضى. خصوصية أكتر، تجربة أسهل، وأسعار عادلة.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <Card className="p-8 flex flex-col items-center text-center space-y-4 border-primary/20 bg-primary/5 hover:border-primary/40 transition-all">
                        <Zap className="w-12 h-12 text-primary" />
                        <h3 className="text-xl font-bold">تجربة أسرع وأذكى</h3>
                        <p className="text-sm text-muted-foreground">مش بس جلسة فيديو، سكون بتوفرلك نظام كامل بيتابع رحلتك وبيطور من حالة مكتبتك الخاصة.</p>
                    </Card>
                    <Card className="p-8 flex flex-col items-center text-center space-y-4 border-primary/20 bg-primary/5 hover:border-primary/40 transition-all">
                        <Shield className="w-12 h-12 text-primary" />
                        <h3 className="text-xl font-bold">خصوصية 100%</h3>
                        <p className="text-sm text-muted-foreground">بياناتك وجلساتك مشفرة بالكامل. سرية المريض هي أهم أولوياتنا، مفيش أي طرف تالت يقدر يوصل لكلامك.</p>
                    </Card>
                    <Card className="p-8 flex flex-col items-center text-center space-y-4 border-primary/20 bg-primary/5 hover:border-primary/40 transition-all">
                        <Heart className="w-12 h-12 text-primary" />
                        <h3 className="text-xl font-bold">دكاترة متخصصين</h3>
                        <p className="text-sm text-muted-foreground">بنختار الدكاترة بعناية فائقة، وبنضمن لك أفضل مستوى طبي ونفسي في مصر.</p>
                    </Card>
                </div>

                <div className="space-y-8">
                    <h2 className="text-3xl font-bold text-center">جدول المقارنة التفصيلي</h2>
                    <Card className="overflow-hidden border-2 border-primary/10 shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left md:text-center" dir="rtl">
                                <thead>
                                    <tr className="bg-muted/80">
                                        <th className="p-6 text-lg font-bold text-right">الميزة</th>
                                        <th className="p-6 text-lg font-bold text-primary">سكون (Sukoon)</th>
                                        <th className="p-6 text-lg font-bold text-muted-foreground">{competitorAr}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {features.map((feature, idx) => (
                                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-6 font-medium text-right">{feature.name}</td>
                                            <td className="p-6">
                                                <div className="flex items-center justify-center">
                                                    <Check className="w-6 h-6 text-green-500 bg-green-500/10 rounded-full p-1" />
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center justify-center">
                                                    {feature.competitor ? (
                                                        <Check className="w-6 h-6 text-green-500 bg-green-500/10 rounded-full p-1" />
                                                    ) : (
                                                        <X className="w-6 h-6 text-destructive bg-destructive/10 rounded-full p-1" />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <div className="mt-20 p-8 md:p-12 rounded-[3rem] bg-gradient-to-br from-primary/20 via-primary/5 to-background border border-primary/20 text-center space-y-8">
                    <h2 className="text-3xl md:text-4xl font-black">جاهز تبدأ رحلتك الحقيقية؟</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        انضم لأكثر من 10,000 مستخدم وثقوا في "سكون" كشريك في رحلة التعافي.
                        احجز أول جلسة ليك دلوقتي واستمتع بتجربة علاجية فريدة.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="px-10 h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20">
                            <Link href="/signup">سجل دلوقتي وخد خصم أول جلسة</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="px-10 h-14 text-lg font-bold rounded-2xl bg-transparent border-primary/20">
                            <Link href="/patient/search">تصفح قائمة الأطباء</Link>
                        </Button>
                    </div>
                </div>

                <div className="mt-16 text-center text-sm text-muted-foreground">
                    <p>* جميع الحقوق والأسماء التجارية مملوكة لأصحابها. المقارنة بناءً على الميزات التقنية والخدمية المتاحة.</p>
                </div>
            </main>
            <footer className="border-t py-12 text-center text-muted-foreground bg-muted/10">
                <p>© {new Date().getFullYear()} Sukoon Mental Health Platform. All rights reserved.</p>
            </footer>
        </div>
    )
}
