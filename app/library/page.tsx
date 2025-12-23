"use client"

import type { Metadata } from "next";
import { mentalHealthDirectory } from "@/lib/mental-health-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeaderNav } from "@/components/header-nav";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function LibraryPage() {
    const { language, t } = useLanguage();
    const isArabic = language === "ar";

    return (
        <div className="min-h-screen bg-background" dir={isArabic ? "rtl" : "ltr"}>
            <HeaderNav />
            <main className="container mx-auto px-4 py-12 text-pretty">
                <div className="max-w-4xl mx-auto mb-16 text-center">
                    <Badge className="mb-4 py-1 px-4 text-sm font-medium" variant="secondary">
                        {isArabic ? "دليل الصحة النفسية" : "Mental Health Directory"}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        {isArabic ? "مكتبة سكون للصحة النفسية" : "Sukoon Mental Health Library"}
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {isArabic
                            ? "دليلك الشامل لجميع الاضطرابات النفسية والأعراض وطرق التعافي. نبحث معك عن الهدوء النفسي."
                            : "Your comprehensive guide to all mental health disorders, symptoms, and recovery paths. Finding peace with you."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {mentalHealthDirectory.map((category, idx) => (
                        <Card key={idx} className="transition-all hover:shadow-lg border-primary/10">
                            <CardHeader>
                                <CardTitle className={`flex flex-col gap-1 ${isArabic ? "text-right" : "text-left"}`}>
                                    <span className="text-xl text-primary">
                                        {isArabic ? category.title : category.titleEn}
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground opacity-70">
                                        {isArabic ? category.titleEn : category.title}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`flex flex-wrap gap-2 ${isArabic ? "flex-row-reverse" : "flex-row"}`}>
                                    {category.keywords.map((keyword, kIdx) => (
                                        <Badge key={kIdx} variant="outline" className="text-[10px] md:text-xs">
                                            {isArabic ? keyword.ar : keyword.en}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-20 p-8 rounded-3xl bg-muted/30 border border-border">
                    <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isArabic ? "flex-row-reverse" : ""}`}>
                        <Search className="w-6 h-6 text-primary" />
                        <span>{isArabic ? "البحث عن موضوع محدد" : "Search for a specific topic"}</span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {mentalHealthDirectory.flatMap(c => c.keywords).map((kw, i) => (
                            <span key={i} className={`text-sm text-muted-foreground hover:text-primary cursor-default ${isArabic ? "text-right" : "text-left"}`}>
                                {isArabic ? kw.ar : kw.en}
                            </span>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="border-t border-border mt-20 py-12 bg-muted/10">
                <div className="container mx-auto px-4 text-center text-muted-foreground">
                    <p>© {new Date().getFullYear()} Sukoon Mental Health. {isArabic ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
                </div>
            </footer>
        </div>
    );
}
