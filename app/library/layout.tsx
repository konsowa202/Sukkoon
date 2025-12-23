import type { Metadata } from "next";
import { mentalHealthDirectory } from "@/lib/mental-health-data";

export const metadata: Metadata = {
    title: "Mental Health Library | Sukoon",
    description: "Comprehensive guide to mental health disorders, symptoms, and treatments. Learn about Anxiety, Depression, OCD, and more in Arabic and English.",
    keywords: mentalHealthDirectory.flatMap(c => [c.title, c.titleEn, ...c.keywords]).slice(0, 50).join(", "),
};

export default function LibraryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
