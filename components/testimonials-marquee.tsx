"use client"

import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Testimonial {
  name: string
  role: string
  text: string
  rating: number
  lang: "en" | "ar"
  time: string
}

const allTestimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    role: "Patient",
    text: "Sukoon changed my life. Finding the right therapist was so easy and the platform is seamless.",
    rating: 5,
    lang: "en",
    time: "10:30 AM"
  },
  {
    name: "سارة م.",
    role: "مريضة",
    text: "سكون غير حياتي. العثور على المعالج المناسب كان سهلاً للغاية والمنصة سلسة جداً.",
    rating: 5,
    lang: "ar",
    time: "١٠:٣٠ ص"
  },
  {
    name: "Ahmed K.",
    role: "Patient",
    text: "Professional, caring doctors and a platform that respects my privacy. Highly recommended!",
    rating: 5,
    lang: "en",
    time: "2:15 PM"
  },
  {
    name: "أحمد ك.",
    role: "مريض",
    text: "أطباء محترفون ومهتمون ومنصة تحترم خصوصيتي. أنصح بها بشدة!",
    rating: 5,
    lang: "ar",
    time: "٢:١٥ م"
  },
  {
    name: "Layla H.",
    role: "Patient",
    text: "The Arabic support and cultural understanding made all the difference in my therapy journey.",
    rating: 5,
    lang: "en",
    time: "9:00 AM"
  },
  {
    name: "ليلى هـ.",
    role: "مريضة",
    text: "الدعم باللغة العربية والتفاهم الثقافي صنع كل الفرق في رحلتي العلاجية.",
    rating: 5,
    lang: "ar",
    time: "٩:٠٠ ص"
  },
  {
      name: "Omar R.",
      role: "Patient",
      text: "The flexibility of choosing between online and offline sessions is amazing for my schedule.",
      rating: 5,
      lang: "en",
      time: "4:45 PM"
  },
  {
      name: "عمر ر.",
      role: "مريض",
      text: "المرونة في الاختيار بين الجلسات عبر الإنترنت وجهاً لوجه مذهلة وتناسب جدولي.",
      rating: 5,
      lang: "ar",
      time: "٤:٤٥ م"
  }
]

export function TestimonialsMarquee() {
  const { language } = useLanguage()
  const filteredTestimonials = allTestimonials.filter(t => t.lang === language)

  return (
    <div className="relative flex overflow-hidden py-10" style={{ direction: 'ltr' }}>
      <div className="flex animate-marquee whitespace-nowrap gap-6">
        {[...filteredTestimonials, ...filteredTestimonials, ...filteredTestimonials].map((t, i) => (
          <Card 
            key={i} 
            className={`flex-shrink-0 w-[300px] md:w-[350px] p-6 rounded-3xl border-none shadow-xl bg-card/80 backdrop-blur-md relative overflow-hidden group hover:scale-105 transition-transform duration-300 ${t.lang === 'ar' ? 'text-right rtl' : 'text-left ltr'}`}
          >
            {/* Design accents */}
            <div className={`absolute top-0 ${t.lang === 'ar' ? 'right-0' : 'left-0'} w-1 h-full bg-primary/20`}></div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">{t.time}</span>
            </div>
            
            <p className={`text-sm md:text-base text-card-foreground leading-relaxed italic mb-6 break-words whitespace-normal`}>
              &quot;{t.text}&quot;
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="font-bold text-sm">{t.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .rtl {
          direction: rtl;
        }
        .ltr {
          direction: ltr;
        }
      `}</style>
    </div>
  )
}
