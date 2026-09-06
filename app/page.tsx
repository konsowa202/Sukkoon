"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Users, Shield, Clock, CheckCircle, Star, ArrowRight, Heart, Facebook, Instagram, Youtube, Video, Linkedin, Smartphone, CreditCard, Upload, Copy } from "lucide-react"
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
        
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">احجز جلستك بسهولة</h2>
            <p className="text-lg text-muted-foreground">{language === 'ar' ? 'وفر وقتك، اختار نوع الجلسة وارفع إيصال الدفع واحنا هنتواصل معاك فوراً لتحديد الموعد مع أفضل المتخصصين.' : 'Save time, choose the session type, upload the receipt and we will contact you immediately to schedule your appointment.'}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Single Sessions Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">1</div>
                <h2 className="text-2xl font-bold">{language === 'ar' ? 'حجز جلسة فردية' : 'Single Session'}</h2>
              </div>
              
              {[
                {
                  id: "therapist",
                  titleAr: "أخصائي نفسي",
                  titleEn: "Therapist",
                  price: 450,
                  descAr: "للدعم النفسي، وتعديل السلوك، وجلسات العلاج الكلامي. (جلسة واحدة)",
                  descEn: "Psychological support, behavior modification, and talk therapy. (Single session)",
                  type: "single"
                },
                {
                  id: "psychiatrist",
                  titleAr: "طبيب نفسي",
                  titleEn: "Psychiatrist",
                  price: 650,
                  descAr: "للتشخيص الطبي، ووصف الأدوية ومتابعة الحالات الإكلينيكية. (جلسة واحدة)",
                  descEn: "Medical diagnosis, prescribing medications, and clinical follow-up. (Single session)",
                  type: "single"
                }
              ].map((service) => (
                <Card key={service.id} className="p-8 border border-primary/20 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 group relative overflow-hidden bg-card/60 backdrop-blur-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{language === 'ar' ? service.titleAr : service.titleEn}</h3>
                      <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-black text-lg shadow-sm whitespace-nowrap">
                        {service.price} {language === 'ar' ? 'ج.م' : 'EGP'}
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed flex-1 mb-8 text-lg">{language === 'ar' ? service.descAr : service.descEn}</p>
                    
                    <Button size="lg" className="w-full text-lg h-14 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20" onClick={() => {
                        window.location.href = "/patient/search";
                    }}>
                      {language === 'ar' ? 'احجز الجلسة' : 'Book Session'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Packages Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl">2</div>
                <h2 className="text-2xl font-bold">{language === 'ar' ? 'نظام الباقات الموفرة' : 'Savings Packages'}</h2>
              </div>
              
              {[
                {
                  id: "therapist_package",
                  titleAr: "باقة 4 جلسات أخصائي",
                  titleEn: "Therapist Package (4 Sessions)",
                  price: 1800,
                  descAr: "باقة متكاملة للمتابعة المستمرة بسعر موفر، التزام بيضمنلك نتيجة أفضل.",
                  descEn: "A comprehensive package for continuous follow-up at a discounted price.",
                  type: "package",
                  tagAr: "الأكثر طلباً",
                  tagEn: "Most Popular"
                },
                {
                  id: "psychiatrist_package",
                  titleAr: "باقة 4 جلسات طبيب",
                  titleEn: "Psychiatrist Package (4 Sessions)",
                  price: 2600,
                  descAr: "باقة المتابعة الدورية الشاملة مع الطبيب النفسي لضمان استقرار الحالة.",
                  descEn: "Comprehensive periodic follow-up package with a psychiatrist.",
                  type: "package",
                  tagAr: "باقة التوفير",
                  tagEn: "Savings Package"
                }
              ].map((service) => (
                <Card key={service.id} className="p-8 border-2 border-accent/30 bg-gradient-to-br from-background to-accent/5 hover:border-accent hover:from-accent/10 hover:to-accent/5 transition-all hover:shadow-2xl hover:shadow-accent/20 group relative overflow-hidden">
                  {service.tagAr && (
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-sm font-bold px-4 py-1.5 rounded-bl-xl shadow-md z-20">
                      {language === 'ar' ? service.tagAr : service.tagEn}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl -ml-20 -mb-20 group-hover:bg-accent/20 transition-colors"></div>
                  
                  <div className="relative z-10 flex flex-col h-full mt-2">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">{language === 'ar' ? service.titleAr : service.titleEn}</h3>
                      <div className="bg-accent text-accent-foreground px-4 py-2 rounded-full font-black text-lg shadow-sm whitespace-nowrap">
                        {service.price} {language === 'ar' ? 'ج.م' : 'EGP'}
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed flex-1 mb-8 text-lg">{language === 'ar' ? service.descAr : service.descEn}</p>
                    
                    <Button size="lg" className="w-full text-lg h-14 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-[1.02] transition-transform shadow-lg shadow-accent/20" onClick={() => {
                        window.location.href = "/patient/search";
                    }}>
                      {language === 'ar' ? 'احجز الباقة' : 'Book Package'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
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
