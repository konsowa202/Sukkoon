"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.features": "Features",
    "nav.about": "About",
    "nav.library": "Library",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.findDoctor": "Find a Doctor",

    // Hero
    "hero.title": "Your Journey to Mental Wellness Starts Here",
    "hero.subtitle":
      "Connect with qualified mental health professionals who understand your needs. Book sessions online or in-person.",
    "hero.cta": "Find a Doctor",
    "hero.signin": "Sign In",

    // Features
    "features.title": "Why Choose Sukoon?",
    "features.expert.title": "Expert Professionals",
    "features.expert.desc":
      "Connect with licensed therapists and psychiatrists specialized in various mental health areas.",
    "features.secure.title": "Private & Secure",
    "features.secure.desc": "Your privacy is our priority. All sessions are confidential and data is encrypted.",
    "features.flexible.title": "Flexible Scheduling",
    "features.flexible.desc": "Book appointments that fit your schedule. Online or in-person options available.",
    "features.holistic.title": "Holistic Care",
    "features.holistic.desc": "From therapy to medication management, we support your complete wellness journey.",

    // CTA
    "cta.title": "Ready to Take the First Step?",
    "cta.subtitle": "Join thousands who have found support and healing through Sukoon. Your mental health matters.",
    "cta.button": "Get Started Today",

    // Footer
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",

    // Auth
    "auth.welcome": "Welcome Back",
    "auth.signin": "Sign in to your account to continue",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.fullName": "Full Name",
    "auth.submit": "Sign In",
    "auth.noAccount": "Don't have an account?",
    "auth.hasAccount": "Already have an account?",
    "auth.signup": "Sign Up",
    "auth.register": "Create Account",
    "auth.patientSignup": "Patient Sign Up",
    "auth.doctorSignup": "Doctor Sign Up",
    "auth.selectRole": "I am a",
    "auth.patient": "Patient",
    "auth.doctor": "Doctor",

    // Currency
    "currency.egp": "EGP",
    "stats.doctors": "Verified Doctors",
    "stats.patients": "Happy Patients",
    "stats.sessions": "Sessions Completed",
    "stats.rating": "Average Rating",
    "how.title": "How Sukoon Works",
    "how.subtitle": "Simple steps to start your wellness journey",
    "how.step1.title": "Create Your Account",
    "how.step1.desc": "Sign up as a patient in minutes with your basic information",
    "how.step2.title": "Find Your Doctor",
    "how.step2.desc": "Browse qualified professionals and filter by specialization",
    "how.step3.title": "Book a Session",
    "how.step3.desc": "Choose between online or in-person consultations",
    "how.step4.title": "Start Healing",
    "how.step4.desc": "Attend your session and begin your journey to wellness",
    "testimonials.title": "What Our Users Say",
    "testimonials.subtitle": "Real experiences from people who joined the Sukoon community",
  },
  ar: {
    // Navigation
    "nav.features": "المميزات",
    "nav.about": "عن سكون",
    "nav.library": "المكتبة",
    "nav.login": "تسجيل الدخول",
    "nav.signup": "التسجيل",
    "nav.findDoctor": "ابحث عن طبيب",

    // Hero
    "hero.title": "رحلتك نحو الصحة النفسية تبدأ هنا",
    "hero.subtitle": "تواصل مع متخصصي الصحة النفسية المؤهلين الذين يفهمون احتياجاتك. احجز جلسات عبر الإنترنت أو شخصياً.",
    "hero.cta": "ابحث عن طبيب",
    "hero.signin": "تسجيل الدخول",

    // Features
    "features.title": "لماذا تختار سكون؟",
    "features.expert.title": "محترفون خبراء",
    "features.expert.desc": "تواصل مع معالجين وأطباء نفسيين مرخصين متخصصين في مجالات الصحة النفسية المختلفة.",
    "features.secure.title": "خاص وآمن",
    "features.secure.desc": "خصوصيتك هي أولويتنا. جميع الجلسات سرية والبيانات مشفرة.",
    "features.flexible.title": "جدولة مرنة",
    "features.flexible.desc": "احجز مواعيد تناسب جدولك. تتوفر خيارات عبر الإنترنت أو شخصياً.",
    "features.holistic.title": "رعاية شاملة",
    "features.holistic.desc": "من العلاج النفسي إلى إدارة الأدوية، ندعم رحلتك الصحية الكاملة.",

    // CTA
    "cta.title": "هل أنت مستعد لاتخاذ الخطوة الأولى؟",
    "cta.subtitle": "انضم إلى آلاف الأشخاص الذين وجدوا الدعم والشفاء من خلال سكون. صحتك النفسية مهمة.",
    "cta.button": "ابدأ اليوم",

    // Footer
    "footer.privacy": "سياسة الخصوصية",
    "footer.terms": "شروط الخدمة",
    "footer.contact": "اتصل بنا",
    "footer.rights": "جميع الحقوق محفوظة.",

    // Auth
    "auth.welcome": "مرحباً بعودتك",
    "auth.signin": "سجل الدخول إلى حسابك للمتابعة",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.confirmPassword": "تأكيد كلمة المرور",
    "auth.fullName": "الاسم الكامل",
    "auth.submit": "تسجيل الدخول",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.hasAccount": "هل لديك حساب بالفعل؟",
    "auth.signup": "التسجيل",
    "auth.register": "إنشاء حساب",
    "auth.patientSignup": "تسجيل مريض",
    "auth.doctorSignup": "تسجيل طبيب",
    "auth.selectRole": "أنا",
    "auth.patient": "مريض",
    "auth.doctor": "طبيب",

    // Currency
    "currency.egp": "جنيه مصري",
    "stats.doctors": "أطباء معتمدون",
    "stats.patients": "مرضى سعداء",
    "stats.sessions": "جلسات مكتملة",
    "stats.rating": "متوسط التقييم",
    "how.title": "كيف يعمل سكون؟",
    "how.subtitle": "خطوات بسيطة لبدء رحلتك الصحية",
    "how.step1.title": "أنشئ حسابك",
    "how.step1.desc": "سجل كمريض في دقائق ببياناتك الأساسية",
    "how.step2.title": "ابحث عن طبيبك",
    "how.step2.desc": "تصفح المتخصصين المؤهلين وقم بالتصفية حسب التخصص",
    "how.step3.title": "احجز جلسة",
    "how.step3.desc": "اختر بين الاستشارات عبر الإنترنت أو وجهاً لوجه",
    "how.step4.title": "ابدأ التعافي",
    "how.step4.desc": "احضر جلستك وابدأ رحلتك نحو العافية",
    "testimonials.title": "ماذا يقول مستخدمونا",
    "testimonials.subtitle": "تجارب حقيقية من أشخاص انضموا إلى مجتمع سكون",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("sukoon_language") as Language
      if (stored) {
        setLanguage(stored)
        document.documentElement.dir = stored === "ar" ? "rtl" : "ltr"
        document.documentElement.lang = stored
      } else {
        // No stored preference - check if we're on landing page
        const isLandingPage = window.location.pathname === '/'
        const defaultLang: Language = isLandingPage ? "ar" : "en"
        setLanguage(defaultLang)
        document.documentElement.dir = defaultLang === "ar" ? "rtl" : "ltr"
        document.documentElement.lang = defaultLang
        // Save preference for landing page
        if (isLandingPage) {
          localStorage.setItem("sukoon_language", "ar")
        }
      }
    }
  }, [])

  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en"
    setLanguage(newLang)
    localStorage.setItem("sukoon_language", newLang)
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = newLang
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return <LanguageContext.Provider value={{ language, toggleLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
