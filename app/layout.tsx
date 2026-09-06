import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { LanguageProvider } from "@/contexts/language-context"
import { LocationProvider } from "@/contexts/location-context"
import { Toaster } from "@/hooks/use-toast"

const _geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
const _ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-arabic",
  display: "swap",
})

export const metadata: Metadata = {
  title: "سكون للصحة النفسية | معاك خطوة بخطوة",
  description: "سكون: منصة التواصل مع نخبة من أطباء ومعالجي الصحة النفسية. ابدأ رحلة التعافي الآن بخصوصية تامة واحترافية.",
  keywords: "منصة سكون, سكون, جمعية سكون, sukun therapy, skoun, سكون الشفا, سكون جدة, sukoon, سُكون, سكونك, عيادة سكون, سكون النفس, شات سكون, جلسات سكون, سكون كير, elhakem, سكون ميد, مركز سكون, سُكُون, سکون, سكون 5, sukoon m, جمعية سكون للصحة النفسية, مستشفى سكون, sukoon health, السكون, هل هو امن, where is sukoon located, رهاب الساح, sukoon iec, مركز سكون للاستشارات الأسرية والنفسية والتدريب, مركز سأكون, مركز سكون جدة, explain in english, sukoin, برنامج سكون, دكتور نفسى اونلاين, sukoon., هل تنصحني بيه, psykongrooen, www.sukoon.com, ما هذا البرنامج, sukoon community, سكون سمارت, suookn, hello sukoon, my sukoon, sukoon counselling, sukoon wellness treatment, سكون لوجو, sukoon healing, sukoon login, #سكون, sukoon rehab, sukoon.com, مركز سكون للطب النفسي وعلاج الادمان, sukoon cares, sukoon therapy and consulting, عالم السكون, sukoon. com, sokoon, مستشفى سكون جدة, socoon, sukoon hospital jeddah, سكون الروح, مركز سكون الطائف, sukoon com, skun, sukh solutions, sukoon psychotherapy center, سكون للرعاية الممتدة, مركز سكون للرعاية الممتدة, sukoon psychotherapy",
  openGraph: {
    title: "سكون للصحة النفسية | معاك خطوة بخطوة",
    description: "سكون: منصة التواصل مع نخبة من أطباء ومعالجي الصحة النفسية. ابدأ رحلة التعافي الآن مع سكون.",
    url: "https://suukoon.com",
    siteName: "سكون",
    images: [
      {
        url: "/images/WhatsApp Image 2025-12-03 at 1.03.29 PM.jpeg",
        width: 1200,
        height: 630,
        alt: "Sukoon Mental Health",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "سكون للصحة النفسية | معاك خطوة بخطوة",
    description: "ابدأ رحلة التعافي الآن مع نخبة من أطباء الصحة النفسية.",
    images: ["/images/WhatsApp Image 2025-12-03 at 1.03.29 PM.jpeg"],
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="notranslate" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <link rel="icon" href="/images/whatsapp-20image-202025-12-03-20at-201.jpeg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('sukoon_theme') || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${_geist.variable} ${_geistMono.variable} ${_ibmArabic.variable} font-sans antialiased text-pretty`}>
        <ThemeProvider>
          <LanguageProvider>
            <LocationProvider>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </LocationProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
