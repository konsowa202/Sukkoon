import { MetadataRoute } from 'next'
import { mentalHealthDirectory, TopicCategory, TopicKeyword } from '@/lib/mental-health-data'

export default function sitemap(): MetadataRoute.Sitemap {
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

    // Monster SEO: Index every keyword in the library
    // These point to the library page with a search query
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

    // Competitor Comparison routes
    const comparisonRoutes = [
        '/vs/shezlong',
        '/vs/otida',
        '/vs/labayh',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [...staticRoutes, ...libraryRoutes, ...comparisonRoutes]
}
