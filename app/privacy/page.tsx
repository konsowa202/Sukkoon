"use client"

import { HeaderNav } from "@/components/header-nav"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Shield, Lock, Eye, FileText } from "lucide-react"

export default function PrivacyPolicyPage() {
    const { language } = useLanguage()
    const isAr = language === "ar"

    const content = {
        ar: {
            title: "سياسة الخصوصية - منصة سكون (Sukoon)",
            lastUpdated: "آخر تحديث: ديسمبر 2025",
            welcome: "أهلاً بك في منصة سكون (Sukoon). نحن ندرك تماماً أن البيانات المتعلقة بالصحة النفسية هي بيانات حساسة للغاية، لذا فإن حماية خصوصيتك وسرية معلوماتك ليست مجرد التزام قانوني بالنسبة لنا، بل هي جوهر عملنا والقيمة الأساسية التي بنيت عليها المنصة.",
            intro: "توضح هذه السياسة كيف نقوم بجمع واستخدام وحماية بياناتك الشخصية عند استخدامك لموقعنا أو تطبيقنا.",
            sections: [
                {
                    title: "1. البيانات التي نقوم بجمعها",
                    items: [
                        "معلومات الهوية: الاسم، البريد الإلكتروني، رقم الهاتف، وتاريخ الميلاد.",
                        "البيانات الصحية (لأغراض العلاج): التاريخ الطبي، الأعراض، أو الملاحظات التي تشاركها مع المعالج (هذه البيانات تكون مشفرة ومتاحة فقط للطبيب المعالج).",
                        "بيانات الدفع: نحن لا نقوم بتخزين تفاصيل بطاقتك الائتمانية الكاملة، بل تتم العمليات عبر بوابات دفع إلكترونية مؤمنة ومعتمدة.",
                        "بيانات تقنية: مثل عنوان IP، ونوع المتصفح، لغرض تحسين تجربة المستخدم وأمان المنصة."
                    ]
                },
                {
                    title: "2. كيف نستخدم بياناتك؟",
                    items: [
                        "تمكينك من حجز الجلسات والتواصل مع الأطباء والمعالجين.",
                        "تسهيل عملية الدفع وإصدار الفواتير.",
                        "تحسين جودة خدماتنا وتطوير المنصة.",
                        "إرسال إشعارات التذكير بالمواعيد (عبر البريد الإلكتروني أو الرسائل النصية)."
                    ]
                },
                {
                    title: "3. سرية الجلسات (Video Sessions)",
                    items: [
                        "تتم الجلسات المرئية عبر تقنيات اتصال آمنة (مثل Google Meet أو نظام الفيديو المدمج).",
                        "نحن لا نقوم بتسجيل الجلسات: خصوصية ما يدور بينك وبين الطبيب مقدسة. لا تقوم منصة سكون بتسجيل أي فيديو أو صوت للجلسات، وتقع مسؤولية سرية محتوى الجلسة على عاتق الطبيب وفقاً لأخلاقيات المهنة."
                    ]
                },
                {
                    title: "4. مشاركة البيانات",
                    items: [
                        "نحن لا نقوم ببيع أو تأجير بياناتك الشخصية لأي طرف ثالث.",
                        "تتم مشاركة البيانات مع الطبيب المعالج لتمكينه من تقديم الخدمة الطبية المناسبة.",
                        "تتم مشاركة البيانات مع الجهات القانونية في حال طُلب منا ذلك بموجب أمر قضائي رسمي، أو في حالات الطوارئ القصوى."
                    ]
                },
                {
                    title: "5. أمن البيانات",
                    description: "نستخدم بروتوكولات حماية متقدمة (SSL Encryption) لتشفير البيانات أثناء انتقالها بين جهازك وخوادمنا. ومع ذلك، نوصي دائماً بالحفاظ على سرية كلمة المرور الخاصة بك وعدم مشاركتها مع أحد."
                },
                {
                    title: "6. ملفات تعريف الارتباط (Cookies)",
                    description: "يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربتك (مثل تذكر لغتكم المفضلة أو البقاء مسجلاً للدخول). يمكنك تعطيل ملفات تعريف الارتباط من إعدادات المتصفح."
                },
                {
                    title: "7. حقوقك",
                    items: [
                        "طلب الاطلاع على بياناتك المسجلة لدينا.",
                        "طلب تصحيح أي معلومات خاطئة.",
                        "طلب حذف حسابك وبياناتك نهائياً من خوادمنا."
                    ]
                },
                {
                    title: "8. التعديلات على السياسة",
                    description: "قد نقوم بتحديث سياسة الخصوصية من وقت لآخر لمواكبة التغييرات القانونية أو التقنية. سيتم نشر أي تعديلات في هذه الصفحة."
                }
            ]
        },
        en: {
            title: "Privacy Policy - Sukoon Platform",
            lastUpdated: "Last Updated: December 2025",
            welcome: "Welcome to Sukoon. We fully recognize that data related to mental health is extremely sensitive. Protecting your privacy and the confidentiality of your information is not just a legal obligation for us, but the core of our work and the fundamental value upon which this platform was built.",
            intro: "This policy explains how we collect, use, and protect your personal data when using our website or application.",
            sections: [
                {
                    title: "1. Data We Collect",
                    items: [
                        "Identity Information: Name, email, phone number, and date of birth.",
                        "Health Data (for treatment purposes): Medical history, symptoms, or notes shared with the therapist (this data is encrypted and accessible only to the treating physician).",
                        "Payment Data: We do not store your full credit card details; transactions are processed through secure and certified electronic payment gateways.",
                        "Technical Data: Such as IP address and browser type, for the purpose of improving user experience and platform security."
                    ]
                },
                {
                    title: "2. How We Use Your Data?",
                    items: [
                        "Enabling you to book sessions and communicate with doctors and therapists.",
                        "Facilitating the payment and invoicing process.",
                        "Improving the quality of our services and developing the platform.",
                        "Sending appointment reminders (via email or SMS)."
                    ]
                },
                {
                    title: "3. Session Confidentiality (Video Sessions)",
                    items: [
                        "Visual sessions are conducted via secure communication technologies (such as Google Meet or the integrated video system).",
                        "We do not record sessions: The privacy of what happens between you and the doctor is sacred. Sukoon does not record any video or audio of the sessions."
                    ]
                },
                {
                    title: "4. Data Sharing",
                    items: [
                        "We do not sell or rent your personal data to any third party.",
                        "Shared with the treating physician to enable them to provide appropriate medical service.",
                        "Shared with legal authorities if requested by a formal court order or in extreme emergencies."
                    ]
                },
                {
                    title: "5. Data Security",
                    description: "We use advanced protection protocols (SSL Encryption) to encrypt data during its transition between your device and our servers. We recommend keeping your password confidential."
                },
                {
                    title: "6. Cookies",
                    description: "Our site uses cookies to improve your experience (such as remembering your preferred language or staying logged in). You can disable cookies from browser settings."
                },
                {
                    title: "7. Your Rights",
                    items: [
                        "Request access to your data registered with us.",
                        "Request correction of any incorrect information.",
                        "Request permanent deletion of your account and data from our servers."
                    ]
                },
                {
                    title: "8. Changes to Policy",
                    description: "We may update the privacy policy from time to time to keep pace with legal or technical changes. Modifications will be published on this page."
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
                            <Shield className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t.title}</h1>
                        <p className="text-muted-foreground font-medium">{t.lastUpdated}</p>
                    </div>

                    <Card className="p-8 md:p-12 border-none shadow-2xl shadow-primary/5 bg-gradient-to-b from-card to-background">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <p className="text-lg leading-relaxed">{t.welcome}</p>
                                <p className="text-muted-foreground">{t.intro}</p>
                            </div>

                            <div className="grid gap-10 pt-4">
                                {t.sections.map((section, idx) => (
                                    <div key={idx} className="space-y-4 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                {idx + 1}
                                            </div>
                                            <h2 className="text-xl font-bold">{section.title}</h2>
                                        </div>

                                        {section.description && (
                                            <p className="text-muted-foreground leading-relaxed pl-11">
                                                {section.description}
                                            </p>
                                        )}

                                        {section.items && (
                                            <ul className={`space-y-3 pl-11 ${isAr ? "pr-0" : ""}`}>
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

                    {/* Footer Note */}
                    <div className="text-center p-8 bg-primary/5 rounded-[2rem] border border-primary/10">
                        <p className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
                            <Lock className="w-4 h-4" />
                            {isAr
                                ? "بياناتك محمية ومشفرة وفق أعلى معايير الأمان العالمية"
                                : "Your data is protected and encrypted according to the highest global security standards"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
