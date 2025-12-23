"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Users, Shield, Clock, CheckCircle, Star, ArrowRight } from "lucide-react"
import { HeaderNav } from "@/components/header-nav"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import dynamic from "next/dynamic"
import Image from "next/image"
import { NumberCounter } from "@/components/number-counter"
import { TestimonialsMarquee } from "@/components/testimonials-marquee"
import { FeaturedDoctors } from "@/components/featured-doctors"
import { useEffect } from "react"

const Hero3D = dynamic(() => import("@/components/hero-3d").then((mod) => ({ default: mod.Hero3D })), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-primary/10 animate-pulse rounded-2xl" />,
})

function HomePageContent() {
  const { t, language } = useLanguage()
  const { user } = useAuth()

  // Set Arabic as default language for landing page only (if no preference stored)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("sukoon_language")
      // Only set Arabic if no language preference is stored (first visit to landing page)
      if (!stored) {
        localStorage.setItem("sukoon_language", "ar")
        document.documentElement.dir = "rtl"
        document.documentElement.lang = "ar"
      }
    }
  }, []) // Run only once on mount

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
            <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">{t("hero.title")}</h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">{t("hero.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild className="text-lg shadow-lg shadow-primary/20">
                <Link href="/patient/search">{t("hero.cta")}</Link>
              </Button>
              {user ? (
                <Button size="lg" variant="outline" asChild className="text-lg bg-transparent border-primary/20 hover:border-primary/50 transition-colors">
                  <Link href={getDashboardPath()}>Go to Dashboard</Link>
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
                  "https://i.pravatar.cc/150?u=1",
                  "https://i.pravatar.cc/150?u=2",
                  "https://i.pravatar.cc/150?u=3",
                  "https://i.pravatar.cc/150?u=4"
                ].map((url, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-background overflow-hidden animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
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
                <p className="text-muted-foreground font-medium">Trusted by 10,000+ users</p>
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
              <NumberCounter end={500} suffix="+" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{t("stats.doctors")}</p>
          </Card>
          <Card className="p-8 text-center border-none shadow-xl bg-gradient-to-b from-card to-background hover:scale-105 transition-transform">
            <div className="text-4xl font-black text-primary mb-2">
              <NumberCounter end={50} suffix="K+" />
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{t("stats.patients")}</p>
          </Card>
          <Card className="p-8 text-center border-none shadow-xl bg-gradient-to-b from-card to-background hover:scale-105 transition-transform">
            <div className="text-4xl font-black text-primary mb-2">
              <NumberCounter end={100} suffix="K+" />
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

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-primary/5 rounded-[3rem] my-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{t("features.title")}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for your mental wellness journey in one platform
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
                Your trusted partner in mental wellness. Connect with professionals who care.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">For Patients</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/patient/search" className="hover:text-foreground">
                    Find a Doctor
                  </Link>
                </li>
                <li>
                  <Link href="/signup?role=patient" className="hover:text-foreground">
                    Patient Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">For Doctors</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/signup?role=doctor" className="hover:text-foreground">
                    Join as Doctor
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    {t("footer.privacy")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
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
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Sukoon. {t("footer.rights")}</p>
          </div>
        </div>
      </footer>

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
