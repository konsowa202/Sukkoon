import { Metadata } from "next";
import { mentalHealthDirectory } from "@/lib/mental-health-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeaderNav } from "@/components/header-nav";
import { Search } from "lucide-react";

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
    const q = searchParams.q;
    if (!q) {
        return {
            title: "مكتبة سكون للصحة النفسية | دليل الاضطرابات والعلاج",
            description: "دليلك الشامل لجميع الاضطرابات النفسية والأعراض وطرق التعافي. نبحث معك عن الهدوء النفسي.",
        };
    }

    return {
        title: `علاج ${q} | دليل سكون الطبي`,
        description: `تعرف على مسببات وأعراض وطرق علاج ${q} من خلال مكتبة سكون للصحة النفسية. استشارات نفسية أونلاين مع أفضل الأطباء.`,
        keywords: [q, "علاج نفسي", "سكون", "صحة نفسية"],
    };
}

export default function LibraryPage({ searchParams }: { searchParams: { q?: string } }) {
    // Default to Arabic for SEO indexing purposes if no language context is available server-side
    // or we can use headers to detect locale if needed, but for global indexing Arabic is priority here.
    const isArabic = true;

    return (
        <div className="min-h-screen bg-background" dir="rtl">
            <HeaderNav />
            <main className="container mx-auto px-4 py-12 text-pretty">
                <div className="max-w-4xl mx-auto mb-16 text-center">
                    <Badge className="mb-4 py-1 px-4 text-sm font-medium" variant="secondary">
                        {searchParams.q ? `نتائج البحث عن: ${searchParams.q}` : "دليل الصحة النفسية"}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        {searchParams.q ? `كل ما تريد معرفته عن ${searchParams.q}` : "مكتبة سكون للصحة النفسية"}
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        دليلك الشامل لجميع الاضطرابات النفسية والأعراض وطرق التعافي. نبحث معك عن الهدوء النفسي.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {mentalHealthDirectory.map((category, idx) => (
                        <Card key={idx} className="transition-all hover:shadow-lg border-primary/10">
                            <CardHeader>
                                <CardTitle className="flex flex-col gap-1 text-right">
                                    <span className="text-xl text-primary">
                                        {category.title}
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground opacity-70">
                                        {category.titleEn}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 flex-row-reverse">
                                    {category.keywords.map((keyword, kIdx) => (
                                        <Badge key={kIdx} variant="outline" className="text-[10px] md:text-xs">
                                            {keyword.ar}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-20 p-8 rounded-3xl bg-muted/30 border border-border">
                    <h2 className="text-2xl font-bold mb-6 flex items-center justify-end gap-2 text-right">
                        <span>البحث عن موضوع محدد</span>
                        <Search className="w-6 h-6 text-primary" />
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {mentalHealthDirectory.flatMap(c => c.keywords).map((kw, i) => (
                            <a
                                href={`/library?q=${encodeURIComponent(kw.ar)}`}
                                key={i}
                                className="text-sm text-muted-foreground hover:text-primary cursor-pointer text-right transition-colors"
                            >
                                {kw.ar}
                            </a>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="border-t border-border mt-20 py-12 bg-muted/10">
                <div className="container mx-auto px-4 text-center text-muted-foreground">
                    <p>© {new Date().getFullYear()} Sukoon Mental Health. جميع الحقوق محفوظة.</p>
                </div>
            </footer>
        </div>
    );
}
