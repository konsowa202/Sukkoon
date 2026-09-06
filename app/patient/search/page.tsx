"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, ArrowLeft, Upload, Smartphone, CreditCard, Copy } from "lucide-react"
import { HeaderNav } from "@/components/header-nav"
import { useLanguage } from "@/contexts/language-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function GenericBookingPage() {
  const { t, language } = useLanguage()
  const isAr = language === "ar"
  const [selectedService, setSelectedService] = useState<any>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const services = [
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
      id: "psychiatrist",
      titleAr: "طبيب نفسي",
      titleEn: "Psychiatrist",
      price: 650,
      descAr: "للتشخيص الطبي، ووصف الأدوية ومتابعة الحالات الإكلينيكية. (جلسة واحدة)",
      descEn: "Medical diagnosis, prescribing medications, and clinical follow-up. (Single session)",
      type: "single"
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
  ]

  const openBooking = (service: any) => {
    setSelectedService(service)
    setIsBookingOpen(true)
  }

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      
      const response = await fetch('/api/appointments/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: formData.get('name'),
          phone: formData.get('phone'),
          type: 'online', 
          service: selectedService?.titleAr || 'خدمة غير محددة',
          request_type: 'easy_book',
          request_message: 'طلب حجز سريع من صفحة حجز الجلسات'
        })
      });

      if(response.ok) {
        alert(isAr ? 'تم إرسال طلبك بنجاح! سيتم مراجعته والتواصل معك قريباً.' : 'Your request has been submitted successfully! We will contact you soon.');
        setIsBookingOpen(false);
      } else {
        alert(isAr ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
      }
    } catch(err) {
      alert(isAr ? 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' : 'An unexpected error occurred. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderNav showAuth={false} />

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-5xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">{t("search.title")}</h1>
          <p className="text-xl text-muted-foreground">{isAr ? 'اختر نوع الجلسة أو الباقة التي تناسب احتياجاتك لبدء رحلة التعافي.' : 'Choose the session type or package that fits your needs to start your recovery journey.'}</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Single Sessions Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">1</div>
              <h2 className="text-2xl font-bold">{isAr ? 'حجز جلسة فردية' : 'Single Session'}</h2>
            </div>
            
            {services.filter(s => s.type === "single").map((service) => (
              <Card key={service.id} className="p-8 border border-primary/20 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 group relative overflow-hidden bg-card/60 backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{isAr ? service.titleAr : service.titleEn}</h3>
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-black text-lg shadow-sm whitespace-nowrap">
                      {service.price} {isAr ? 'ج.م' : 'EGP'}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed flex-1 mb-8 text-lg">{isAr ? service.descAr : service.descEn}</p>
                  
                  <Button size="lg" className="w-full text-lg h-14 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20" onClick={() => openBooking(service)}>
                    {isAr ? 'احجز الجلسة' : 'Book Session'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Packages Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl">2</div>
              <h2 className="text-2xl font-bold">{isAr ? 'نظام الباقات الموفرة' : 'Savings Packages'}</h2>
            </div>
            
            {services.filter(s => s.type === "package").map((service) => (
              <Card key={service.id} className="p-8 border-2 border-accent/30 bg-gradient-to-br from-background to-accent/5 hover:border-accent hover:from-accent/10 hover:to-accent/5 transition-all hover:shadow-2xl hover:shadow-accent/20 group relative overflow-hidden">
                {service.tagAr && (
                  <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-sm font-bold px-4 py-1.5 rounded-bl-xl shadow-md z-20">
                    {isAr ? service.tagAr : service.tagEn}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl -ml-20 -mb-20 group-hover:bg-accent/20 transition-colors"></div>
                
                <div className="relative z-10 flex flex-col h-full mt-2">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">{isAr ? service.titleAr : service.titleEn}</h3>
                    <div className="bg-accent text-accent-foreground px-4 py-2 rounded-full font-black text-lg shadow-sm whitespace-nowrap">
                      {service.price} {isAr ? 'ج.م' : 'EGP'}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed flex-1 mb-8 text-lg">{isAr ? service.descAr : service.descEn}</p>
                  
                  <Button size="lg" className="w-full text-lg h-14 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-[1.02] transition-transform shadow-lg shadow-accent/20" onClick={() => openBooking(service)}>
                    {isAr ? 'احجز الباقة' : 'Book Package'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Dialog Modal */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-[2rem]">
          <div className="bg-muted/50 p-6 border-b border-border flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{isAr ? 'تأكيد الحجز والدفع' : 'Confirm Booking & Payment'}</h2>
              <p className="text-sm text-primary font-bold mt-1">
                {isAr ? selectedService?.titleAr : selectedService?.titleEn} - {selectedService?.price} {isAr ? 'ج.م' : 'EGP'}
              </p>
            </div>
          </div>
          
          <form className="p-6 space-y-6" onSubmit={handleBookingSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">{isAr ? 'الاسم الكريم' : 'Full Name'}</label>
                <input name="name" placeholder={isAr ? 'اكتب اسمك هنا' : 'Enter your name'} className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50" required />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold">{isAr ? 'رقم الهاتف (للتواصل)' : 'Phone Number'}</label>
                <input name="phone" placeholder={isAr ? 'رقم الموبايل / واتساب' : 'Mobile / WhatsApp'} className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50" required />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <label className="text-sm font-bold">{isAr ? 'حول المبلغ على أحد الأرقام التالية' : 'Transfer the amount to one of these numbers'}</label>
              
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-muted/30 border border-muted flex items-center justify-between group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-6 h-6 text-red-500" />
                    <p className="font-bold text-sm">{isAr ? 'فودافون كاش' : 'Vodafone Cash'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono font-bold bg-background px-2 py-1 rounded-md border border-border">01006119365</p>
                    <button type="button" onClick={() => { navigator.clipboard.writeText('01006119365'); alert(isAr ? 'تم نسخ الرقم' : 'Number Copied'); }} className="p-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-muted flex items-center justify-between group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                    <p className="font-bold text-sm">{isAr ? 'إنستا باي' : 'InstaPay'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono font-bold bg-background px-2 py-1 rounded-md border border-border">01102553741</p>
                    <button type="button" onClick={() => { navigator.clipboard.writeText('01102553741'); alert(isAr ? 'تم نسخ الرقم' : 'Number Copied'); }} className="p-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold">{isAr ? 'إيصال الدفع (سكرين شوت التحويل)' : 'Payment Receipt Screenshot'}</label>
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors relative group">
                <Upload className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                <p className="font-medium text-sm text-primary">{isAr ? 'اضغط هنا لرفع صورة الإيصال' : 'Click to upload receipt'}</p>
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" required />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full text-lg h-14 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
              {isAr ? 'تأكيد الحجز' : 'Confirm Booking'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
