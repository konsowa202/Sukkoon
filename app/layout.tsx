import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { LanguageProvider } from "@/contexts/language-context"
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
  title: "سكون للصحة النفسية | البديل الأفضل لشيزلونج في مصر",
  description: "سكون: منصة التواصل مع نخبة من أطباء ومعالجي الصحة النفسية. البديل الأفضل والأكثر خصوصية لشيزلونج ولبيه وأوتبا. ابدأ رحلة التعافي الآن.",
  keywords: "صحة نفسية, علاج نفسي, اكتئاب, قلق, توتر, وسواس قهري, إدمان, شيزلونج, لبيه, شيزلونج بديل, أفضل منصة علاج نفسي, دكتور نفسي أونلاين, سكون",
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
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
