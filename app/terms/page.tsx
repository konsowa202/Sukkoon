"use client"

import { HeaderNav } from "@/components/header-nav"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { FileText, AlertTriangle, ShieldCheck, UserCheck, CreditCard, Scale, HelpCircle } from "lucide-react"

export default function TermsOfServicePage() {
    const { language } = useLanguage()
    const isAr = language === "ar"

    const content = {
        ar: {
            title: "شروط الاستخدام - منصة سكون (Sukoon)",
            lastUpdated: "آخر تحديث: ديسمبر 2025",
            intro: "مرحباً بك في منصة سكون (Sukoon). يرجى قراءة شروط الاستخدام هذه (\"الشروط\") بعناية قبل البدء في استخدام موقعنا أو تطبيقنا. بمجرد استخدامك للمنصة، فإنك تقر بموافقتك الكاملة على هذه الشروط. إذا كنت لا توافق على أي جزء منها، يرجى عدم استخدام المنصة.",
            sections: [
                {
                    title: "1. إخلاء مسؤولية هام (ليست للطوارئ)",
                    icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
                    description: "منصة سكون ليست مخصصة للحالات الطارئة. إذا كنت أنت أو أي شخص آخر في خطر داهم، أو تفكر في إيذاء نفسك أو الآخرين، يرجى التوقف عن استخدام المنصة فوراً والاتصال بخدمات الطوارئ المحلية (الإسعاف/الشرطة) أو التوجه لأقرب مستشفى."
                },
                {
                    title: "2. طبيعة الخدمة",
                    icon: <ShieldCheck className="w-5 h-5" />,
                    items: [
                        "سكون وسيط تقني: نحن منصة إلكترونية تربط المستخدمين (\"المرضى\") بمقدمي خدمات الصحة النفسية المستقلين (\"الأطباء/الأخصائيين\").",
                        "العلاقة الطبية: العلاقة العلاجية تنشأ حصراً بينك وبين الطبيب المعالج. منصة سكون لا تقدم الرعاية الطبية بنفسها، ولا تتدخل في القرارات الطبية أو التشخيصات التي يصدرها الأطباء.",
                        "المسؤولية: تقع مسؤولية جودة الخدمة الطبية وصحتها بالكامل على عاتق الطبيب المرخص، ولا تتحمل سكون مسؤولية أي استشارة طبية مقدمة عبر المنصة."
                    ]
                },
                {
                    title: "3. الأهلية وإنشاء الحساب",
                    icon: <UserCheck className="w-5 h-5" />,
                    items: [
                        "يجب أن يكون عمرك 18 عاماً أو أكثر لاستخدام المنصة بشكل مستقل. إذا كنت دون السن القانونية، يجب استخدام المنصة تحت إشراف ولي الأمر.",
                        "أنت مسؤول عن الحفاظ على سرية بيانات دخولك (البريد الإلكتروني وكلمة المرور)، وتتحمل المسؤولية عن أي نشاط يحدث من خلال حسابك."
                    ]
                },
                {
                    title: "4. الحجوزات، الدفع، والإلغاء",
                    icon: <CreditCard className="w-5 h-5" />,
                    items: [
                        "الدفع: يتم دفع رسوم الجلسات مسبقاً عبر وسائل الدفع المتاحة على المنصة.",
                        "سياسة الإلغاء: يمكنك إلغاء أو إعادة جدولة الموعد مجاناً قبل 24 ساعة من موعد الجلسة.",
                        "في حال الإلغاء قبل الموعد بأقل من 24 ساعة، أو عدم الحضور (No-Show)، يحق للمنصة خصم كامل قيمة الجلسة لتعويض وقت الطبيب.",
                        "الاسترداد: في حال تغيب الطبيب عن الموعد أو حدوث مشكلة تقنية من جانب المنصة منعت إتمام الجلسة، يتم رد المبلغ بالكامل لمحفظتك أو وسيلة الدفع الأصلية."
                    ]
                },
                {
                    title: "5. قواعد السلوك",
                    icon: <Scale className="w-5 h-5" />,
                    items: [
                        "التعامل باحترام ومهنية مع الأطباء وفريق الدعم.",
                        "تقديم معلومات صحيحة ودقيقة عن تاريخك الطبي لضمان جودة العلاج.",
                        "يمنع منعاً باتاً تسجيل الجلسات (فيديو أو صوت) بأي وسيلة كانت، حفاظاً على خصوصية الطبيب وحقوق الملكية الفكرية."
                    ]
                },
                {
                    title: "6. حقوق الملكية الفكرية",
                    description: "جميع المحتويات الموجودة على المنصة (النصوص، الشعارات، التصاميم، الأكواد البرمجية) هي ملكية حصرية لشركة سكون ومحمية بموجب قوانين الملكية الفكرية."
                },
                {
                    title: "7. حدود المسؤولية",
                    description: "تسعى سكون لضمان عمل المنصة بشكل مستمر وخالٍ من الأخطاء، لكننا لا نضمن أن الخدمة ستكون خالية تماماً من الانقطاعات التقنية أو نتحمل مسؤولية أي أضرار ناتجة عن الاستخدام."
                },
                {
                    title: "8. التعديلات",
                    description: "نحتفظ بالحق في تعديل شروط الاستخدام في أي وقت. يعتبر استمرارك في استخدام المنصة بعد التعديل قبولاً بالشروط الجديدة."
                }
            ]
        },
        en: {
            title: "Terms of Use - Sukoon Platform",
            lastUpdated: "Last Updated: December 2025",
            intro: "Welcome to Sukoon. Please read these Terms of Use (\"Terms\") carefully before using our website or application. By using the platform, you acknowledge your full agreement to these terms. If you do not agree to any part of them, please do not use the platform.",
            sections: [
                {
                    title: "1. Important Disclaimer (Not for Emergencies)",
                    icon: <AlertTriangle className="w-5 h-5 text-destructive" />,
                    description: "Sukoon is not intended for emergencies. If you or someone else is in immediate danger, or thinking of harming yourself or others, please stop using the platform immediately and contact local emergency services (ambulance/police) or go to the nearest hospital."
                },
                {
                    title: "2. Nature of Service",
                    icon: <ShieldCheck className="w-5 h-5" />,
                    items: [
                        "Sukoon is a Technical Intermediary: We are an electronic platform connecting users (\"Patients\") with independent mental health service providers (\"Doctors/Specialists\").",
                        "Medical Relationship: The therapeutic relationship is established exclusively between you and the treating physician. Sukoon does not provide medical care itself.",
                        "Responsibility: The responsibility for the quality and accuracy of the medical service lies entirely with the licensed physician."
                    ]
                },
                {
                    title: "3. Eligibility and Account Creation",
                    icon: <UserCheck className="w-5 h-5" />,
                    items: [
                        "You must be 18 years or older to use the platform independently. Minors must use the platform under parental supervision.",
                        "You are responsible for maintaining the confidentiality of your login data and for any activity that occurs through your account."
                    ]
                },
                {
                    title: "4. Bookings, Payment, and Cancellation",
                    icon: <CreditCard className="w-5 h-5" />,
                    items: [
                        "Payment: Session fees are paid in advance via the available payment methods on the platform.",
                        "Cancellation Policy: You can cancel or reschedule for free up to 24 hours before the session.",
                        "Cancellations less than 24 hours before or no-shows allow the platform to charge the full session value.",
                        "Refunds: Full refunds are provided if the doctor is absent or a platform technical issue prevents the session."
                    ]
                },
                {
                    title: "5. Code of Conduct",
                    icon: <Scale className="w-5 h-5" />,
                    items: [
                        "Interacting respectfully and professionally with doctors and the support team.",
                        "Providing accurate medical history to ensure quality treatment.",
                        "Strictly prohibited: Recording sessions (video or audio) by any means to protect doctor privacy and intellectual property."
                    ]
                },
                {
                    title: "6. Intellectual Property Rights",
                    description: "All content on the platform (texts, logos, designs, code) is the exclusive property of Sukoon and is protected by intellectual property laws."
                },
                {
                    title: "7. Limitation of Liability",
                    description: "Sukoon strives for continuous, error-free operation but does not guarantee it will be free from all technical interruptions or assume liability for damages arising from use."
                },
                {
                    title: "8. Amendments",
                    description: "We reserve the right to modify these Terms at any time. Your continued use after modification constitutes acceptance of the new Terms."
                }
            ]
        }
    }

    const t = isAr ? content.ar : content.en

    return (
        <div className={`min-h-screen bg-background ${isAr ? "rtl" : "ltr"}`}>
            <HeaderNav />
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl text-primary mb-2">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t.title}</h1>
                        <p className="text-muted-foreground font-medium">{t.lastUpdated}</p>
                    </div>

                    <Card className="p-8 md:p-12 border-none shadow-2xl shadow-primary/5 bg-gradient-to-b from-card to-background">
                        <div className="space-y-8">
                            <p className="text-lg leading-relaxed text-muted-foreground">{t.intro}</p>

                            <div className="grid gap-10 pt-4">
                                {t.sections.map((section, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/5 rounded-lg text-primary">
                                                {section.icon || <HelpCircle className="w-5 h-5" />}
                                            </div>
                                            <h2 className="text-xl font-bold">{section.title}</h2>
                                        </div>

                                        {section.description && (
                                            <p className="text-muted-foreground leading-relaxed pl-12">
                                                {section.description}
                                            </p>
                                        )}

                                        {section.items && (
                                            <ul className={`space-y-3 pl-12 ${isAr ? "pr-0" : ""}`}>
                                                {section.items.map((item, i) => (
                                                    <li key={i} className="flex gap-2 text-muted-foreground leading-relaxed">
                                                        <span className="text-primary mt-1.5 flex-shrink-0">•</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Emergency Disclaimer Highlight */}
                    <div className="p-6 bg-destructive/5 border border-destructive/10 rounded-2xl">
                        <p className="text-sm text-destructive font-bold text-center flex items-center justify-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {isAr
                                ? "في حالات الطوارئ: اتصل بالإسعاف (123) أو الشرطة (122) فوراً"
                                : "In Case of Emergency: Call Ambulance (123) or Police (122) immediately"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
