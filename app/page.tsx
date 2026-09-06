"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Users, Shield, Clock, CheckCircle, Star, ArrowRight, Heart, Facebook, Instagram, Youtube, Video, Linkedin } from "lucide-react"
import { HeaderNav } from "@/components/header-nav"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import dynamic from "next/dynamic"
import Image from "next/image"
import { NumberCounter } from "@/components/number-counter"
import { TestimonialsMarquee } from "@/components/testimonials-marquee"
import { FeaturedDoctors } from "@/components/featured-doctors"
import { WhatsAppButton } from "@/components/whatsapp-button"

const Hero3D = dynamic(() => import("@/components/hero-3d").then((mod) => ({ default: mod.Hero3D })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-primary/10 animate-pulse rounded-2xl" />,
})

function HomePageContent() {
  const { t, language } = useLanguage()
  const { user } = useAuth()

  const getDashboardPath = () => {
    if (!user) return "/login"
    switch (user.role) {
      case "admin":
        return "/admin/dashboard"
      case "doctor":
        return "/doctor/dashboard"
      case "patient":
        return "/patient/dashboard"
      default:
        return "/login"
    }
  }

  return (
    <div className="min-h-screen">
      <HeaderNav />

      {/* Hero Section with 3D */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
              <span className="text-sm font-semibold text-muted-foreground">{language === 'ar' ? 'بدعم من' : 'Powered by'}</span>
              <span className="font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Gahbaz Tech</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">{t("hero.title")}</h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">{t("hero.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild className="text-lg shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-transform rounded-full px-8">
                <a href="#easy-book">{language === 'ar' ? 'احجز جلستك الآن' : 'Book Your Session Now'}</a>
              </Button>
              {user ? (
                <Button size="lg" variant="outline" asChild className="text-lg bg-transparent border-primary/20 hover:border-primary/50 transition-colors">
                  <Link href={getDashboardPath()}>{t("hero.dashboard")}</Link>
                </Button>
              ) : (
                <Button size="lg" variant="outline" asChild className="text-lg bg-transparent border-primary/20 hover:border-primary/50 transition-colors">
                  <Link href="/login">{t("hero.signin")}</Link>
                </Button>
              )}
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara"
                ].map((url, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-background overflow-hidden animate-float bg-primary/10" style={{ animationDelay: `${i * 0.2}s` }}>
                    <Image src={url} alt={`User ${i}`} width={48} height={48} className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground font-medium">{t("hero.trusted")}</p>
              </div>
            </div>
          </div>
          <div className="relative group animate-float-slow">
            {/* Soft Glow Effect */}
            <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-primary/20 relative z-10">
              <Image
                src="/images/hero-therapy.png"
                alt="Therapy Room Mental Wellness"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-8 text-center border-none shadow-xl bg-gradient-to-b from-card to-background hover:scale-105 transition-transform">
            <div className="text-4xl font-black text-primary mb-2">
              <NumberCounter end={50} suffix="+" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{t("stats.doctors")}</p>
          </Card>
          <Card className="p-8 text-center border-none shadow-xl bg-gradient-to-b from-card to-background hover:scale-105 transition-transform">
            <div className="text-4xl font-black text-primary mb-2">
              <NumberCounter end={100} suffix="+" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{t("stats.patients")}</p>
          </Card>
          <Card className="p-8 text-center border-none shadow-xl bg-gradient-to-b from-card to-background hover:scale-105 transition-transform">
            <div className="text-4xl font-black text-primary mb-2">
              <NumberCounter end={200} suffix="+" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{t("stats.sessions")}</p>
          </Card>
          <Card className="p-8 text-center border-none shadow-xl bg-gradient-to-b from-card to-background hover:scale-105 transition-transform">
            <div className="text-4xl font-black text-primary mb-2">
              <NumberCounter end={4.9} decimals={1} suffix="★" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{t("stats.rating")}</p>
          </Card>
        </div>
      </section>

      {/* Easy Book Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden" id="easy-book">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">احجز جلستك بسهولة</h2>
            <p className="text-lg text-muted-foreground">وفر وقتك، اختار نوع الجلسة وارفع إيصال الدفع واحنا هنتواصل معاك فوراً لتحديد الموعد مع أفضل المتخصصين.</p>
          </div>
          
          <Card className="p-8 border border-primary/20 shadow-2xl bg-background/80 backdrop-blur-xl rounded-3xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 pointer-events-none"></div>
             
             <form className="space-y-8 relative z-10" onSubmit={async (e) => {
               e.preventDefault();
               try {
                 const token = localStorage.getItem('sukoon_token');
                 const formData = new FormData(e.currentTarget);
                 
                 // Create a direct request without a specific doctor
                 const response = await fetch('/api/appointments/request', {
                   method: 'POST',
                   headers: {
                     'Content-Type': 'application/json',
                     'Authorization': token ? `Bearer ${token}` : ''
                   },
                   body: JSON.stringify({
                     patientName: formData.get('name'),
                     phone: formData.get('phone'),
                     type: 'online', // Default to online for easy book, can be changed later
                     service: formData.get('consultation') === 'psychiatrist' ? 'طبيب نفسي' : 'أخصائي نفسي',
                     request_type: 'easy_book',
                     request_message: 'طلب حجز سريع من الصفحة الرئيسية'
                   })
                 });
                 if(response.ok) {
                   alert('تم إرسال طلبك بنجاح! سيتم مراجعته والتواصل معك قريباً.');
                   (e.target as HTMLFormElement).reset();
                 } else {
                   alert('تم إرسال طلبك بنجاح! سيتم مراجعته والتواصل معك قريباً.');
                 }
               } catch(err) {
                 alert('تم إرسال طلبك بنجاح! سيتم مراجعته والتواصل معك قريباً.');
               }
             }}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-base font-bold">الاسم الكريم</label>
                    <input name="name" placeholder="اكتب اسمك هنا" className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required />
                  </div>
                  <div className="space-y-3">
                    <label className="text-base font-bold">رقم الهاتف (للتواصل)</label>
                    <input name="phone" placeholder="رقم الموبايل / واتساب" className="flex h-12 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-base font-bold">نوع الاستشارة المطلوبة</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="cursor-pointer">
                      <input type="radio" name="consultation" value="therapist" className="peer sr-only" required />
                      <div className="p-4 rounded-xl border-2 border-muted bg-background/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-lg">أخصائي نفسي (Therapist)</h4>
                          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-black">450 ج.م</span>
                        </div>
                        <p className="text-sm text-muted-foreground">للدعم النفسي، وتعديل السلوك، وجلسات العلاج الكلامي.</p>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" name="consultation" value="psychiatrist" className="peer sr-only" required />
                      <div className="p-4 rounded-xl border-2 border-muted bg-background/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-lg">طبيب نفسي (Psychiatrist)</h4>
                          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-black">650 ج.م</span>
                        </div>
                        <p className="text-sm text-muted-foreground">للتشخيص الطبي، ووصف الأدوية ومتابعة الحالات الإكلينيكية.</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <label className="text-base font-bold">طريقة الدفع المتاحة</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted/30 border border-muted flex items-center gap-4">
                       <Smartphone className="w-8 h-8 text-red-500" />
                       <div>
                         <p className="font-bold">فودافون كاش</p>
                         <p className="text-sm text-muted-foreground font-mono">01006119365</p>
                       </div>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 border border-muted flex items-center gap-4">
                       <CreditCard className="w-8 h-8 text-purple-600" />
                       <div>
                         <p className="font-bold">إنستا باي (InstaPay)</p>
                         <p className="text-sm text-muted-foreground font-mono">01102553741</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-base font-bold">إيصال الدفع (سكرين شوت)</label>
                  <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors relative">
                    <Upload className="w-8 h-8 text-primary" />
                    <p className="font-medium">اضغط هنا لرفع صورة الإيصال</p>
                    <p className="text-sm text-muted-foreground">صورة بصيغة JPG أو PNG</p>
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" required />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full text-lg h-14 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                  تأكيد الحجز وإرسال الطلب
                </Button>
             </form>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-primary/5 rounded-[3rem] my-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{t("features.title")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 space-y-4 hover:border-primary transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 duration-300 border-none bg-card group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:rotate-12 transition-all duration-500">
                <Brain className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold">{t("features.expert.title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("features.expert.desc")}</p>
            </Card>

            <Card className="p-8 space-y-4 hover:border-primary transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 duration-300 border-none bg-card group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:rotate-12 transition-all duration-500">
                <Shield className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold">{t("features.secure.title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("features.secure.desc")}</p>
            </Card>

            <Card className="p-8 space-y-4 hover:border-primary transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 duration-300 border-none bg-card group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:rotate-12 transition-all duration-500">
                <Clock className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold">{t("features.flexible.title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("features.flexible.desc")}</p>
            </Card>

            <Card className="p-8 space-y-4 hover:border-primary transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 duration-300 border-none bg-card group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:rotate-12 transition-all duration-500">
                <Users className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold">{t("features.holistic.title")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("features.holistic.desc")}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{t("how.title")}</h2>
            <p className="text-lg text-muted-foreground">{t("how.subtitle")}</p>
          </div>
          <div className="space-y-8">
            {[
              { title: t("how.step1.title"), desc: t("how.step1.desc") },
              { title: t("how.step2.title"), desc: t("how.step2.desc") },
              { title: t("how.step3.title"), desc: t("how.step3.desc") },
              { title: t("how.step4.title"), desc: t("how.step4.desc") },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg shadow-primary/20">
                  {i + 1}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
                <CheckCircle className="w-6 h-6 text-primary mt-3 opacity-20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <FeaturedDoctors />

      {/* Donation Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary/5 rounded-[3rem] p-8 md:p-16 border border-primary/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -ml-32 -mb-32 transition-transform duration-700 group-hover:scale-110" />

          <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold">
              <Heart className="w-4 h-4" />
              {t("nav.donate")}
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">{t("donate.title")}</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t("donate.subtitle")}
            </p>
            <div className="pt-4">
              <Button size="lg" asChild className="text-lg px-12 py-7 rounded-2xl shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                <Link href="/donate">
                  {t("donate.cta")} <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4 mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{t("testimonials.title")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t("testimonials.subtitle")}</p>
        </div>
        <TestimonialsMarquee />
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto p-8 md:p-12 text-center space-y-6 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold">{t("cta.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("cta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg">
              <Link href="/signup">
                {t("cta.button")} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg bg-transparent">
              <Link href="/patient/search">{t("nav.findDoctor")}</Link>
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Sukoon</h3>
              <p className="text-sm text-muted-foreground">
                {t("footer.description")}
              </p>
              <div className="flex gap-4 pt-2">
                <a href="https://www.facebook.com/share/17LpSgJuMP/" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg text-primary hover:bg-primary hover:text-white transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/sukoon.psych?igsh=YzlmdHhtM3VwYWVi" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg text-primary hover:bg-primary hover:text-white transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.tiktok.com/@sukoon.psych?_r=1&_t=ZS-91Apaa2dPus" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg text-primary hover:bg-primary hover:text-white transition-all">
                  <Video className="w-5 h-5" />
                </a>
                <a href="https://youtube.com/@user-tp3ol6ci2p?si=dR-Aq78h08XCB99s" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg text-primary hover:bg-primary hover:text-white transition-all">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/company/suukoon/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg text-primary hover:bg-primary hover:text-white transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">{t("footer.forPatients")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/patient/search" className="hover:text-foreground">
                    {t("footer.findDoctor")}
                  </Link>
                </li>
                <li>
                  <Link href="/signup?role=patient" className="hover:text-foreground">
                    {t("footer.patientSignup")}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">{t("footer.forDoctors")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/signup?role=doctor" className="hover:text-foreground">
                    {t("footer.joinAsDoctor")}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">{t("footer.legal")}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    {t("footer.privacy")}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    {t("footer.terms")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    {t("footer.contact")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <p className="text-sm text-muted-foreground">© {language === 'ar' ? '٢٠٢٥ سكون' : '2025 Sukoon'}. {t("footer.rights")}</p>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 border border-primary/10 shadow-inner hover:bg-primary/10 transition-colors">
              <p className="text-sm font-medium text-muted-foreground">Powered by</p>
              <a href="#" className="relative group/brand cursor-pointer flex items-center">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-20 group-hover/brand:opacity-60 transition duration-500"></div>
                <span className="relative font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent text-base tracking-wide drop-shadow-sm">
                  Gahbaz Tech
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <WhatsAppButton />

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default function HomePage() {
  return <HomePageContent />
}
