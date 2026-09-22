import { createServerClientSupabase } from '@/supabase/server'

export async function GET() {
  const supabase = createServerClientSupabase()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'

  const staticPages = [
    '',
    '/about',
    '/skills',
    '/experience',
    '/education',
    '/services',
    '/projects',
    '/blog',
    '/contact',
    '/resume',
  ]

  const [projectsResult, blogPostsResult] = await Promise.all([
    supabase.from('projects').select('slug, updated_at').eq('published', true),
    supabase.from('blog_posts').select('slug, updated_at').eq('status', 'published'),
  ])

  const projectUrls = (projectsResult.data || []).map(project => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastmod: project.updated_at,
    changefreq: 'monthly',
    priority: 0.8,
  }))

  const blogUrls = (blogPostsResult.data || []).map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.updated_at,
    changefreq: 'weekly',
    priority: 0.9,
  }))

  const staticUrls = staticPages.map(page => ({
    url: `${baseUrl}${page}`,
    lastmod: new Date().toISOString(),
    changefreq: page === '' ? 'daily' : 'weekly',
    priority: page === '' ? 1.0 : 0.7,
  }))

  const allUrls = [...staticUrls, ...projectUrls, ...blogUrls]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}