import { MetadataRoute } from 'next'
import { mentalHealthDirectory, TopicCategory, TopicKeyword } from '@/lib/mental-health-data'
import { supabaseServer } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.suukoon.com'

    // Standard routes
    const staticRoutes = [
        '',
        '/library',
        '/patient/search',
        '/login',
        '/signup',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // 1. Doctor Profiles SEO
    let doctorRoutes: MetadataRoute.Sitemap = []
    if (supabaseServer) {
        try {
            const { data: doctors } = await supabaseServer
                .from('doctors')
                .select('id')
                .eq('is_verified', true)

            if (doctors) {
                doctorRoutes = doctors.map(doc => ({
                    url: `${baseUrl}/patient/doctor/${doc.id}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.7,
                }))
            }
        } catch (error) {
            console.error('Sitemap doctor fetch error:', error)
        }
    }

    // 2. Monster SEO: Index every keyword in the library
    const libraryRoutes: MetadataRoute.Sitemap = mentalHealthDirectory.flatMap((category: TopicCategory) =>
        category.keywords.flatMap((kw: TopicKeyword) => [
            {
                url: `${baseUrl}/library?q=${encodeURIComponent(kw.ar)}`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            },
            {
                url: `${baseUrl}/library?q=${encodeURIComponent(kw.en.toLowerCase())}`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.5,
            }
        ])
    )

    // 3. Competitor Comparison routes (Amazon Tactic)
    const comparisonRoutes: MetadataRoute.Sitemap = [
        '/vs/shezlong',
        '/vs/otida',
        '/vs/labayh',
        '/vs/arabtherapy',
        '/vs/betterhelp',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.9, // High priority to capture competitor search
    }))

    return [...staticRoutes, ...doctorRoutes, ...libraryRoutes, ...comparisonRoutes]
}
