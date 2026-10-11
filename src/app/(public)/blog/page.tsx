import { Metadata } from 'next'
import { ArrowRight, Calendar, Clock, ExternalLink, Filter, Search, Tag } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import Link from 'next/link'
import { formatDate, calculateReadingTime } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Technical articles, tutorials, and insights on web development, React, Next.js, and more.',
}

const blogPosts = [
  {
    id: '1',
    slug: 'building-scalable-react-applications',
    title: 'Building Scalable React Applications with Next.js 15',
    excerpt: 'Learn how to architect React applications that scale using Next.js App Router, Server Components, and modern patterns.',
    content: 'Full article content here...',
    coverImage: '/blog/nextjs-scaling.jpg',
    category: 'React',
    tags: ['Next.js', 'React', 'TypeScript', 'Architecture'],
    author: 'John Developer',
    publishedAt: '2024-01-15T10:00:00Z',
    readingTime: 8,
    views: 1250,
    status: 'published',
  },
  {
    id: '2',
    slug: 'mastering-typescript-patterns',
    title: 'Mastering Advanced TypeScript Patterns for Better Type Safety',
    excerpt: 'Deep dive into conditional types, mapped types, template literals, and other advanced TypeScript features.',
    content: 'Full article content here...',
    coverImage: '/blog/typescript-patterns.jpg',
    category: 'TypeScript',
    tags: ['TypeScript', 'Generics', 'Type Safety'],
    author: 'John Developer',
    publishedAt: '2024-01-10T10:00:00Z',
    readingTime: 12,
    views: 980,
    status: 'published',
  },
  {
    id: '3',
    slug: 'optimizing-core-web-vitals',
    title: 'Optimizing Core Web Vitals for Better User Experience',
    excerpt: 'Practical strategies to improve LCP, FID, and CLS scores using Next.js built-in optimizations.',
    content: 'Full article content here...',
    coverImage: '/blog/web-vitals.jpg',
    category: 'Performance',
    tags: ['Performance', 'Core Web Vitals', 'Next.js', 'Lighthouse'],
    author: 'John Developer',
    publishedAt: '2024-01-05T10:00:00Z',
    readingTime: 10,
    views: 2100,
    status: 'published',
  },
  {
    id: '4',
    slug: 'database-design-best-practices',
    title: 'Database Design Best Practices for Modern Applications',
    excerpt: 'Essential principles for designing scalable, maintainable database schemas with PostgreSQL and Prisma.',
    content: 'Full article content here...',
    coverImage: '/blog/database-design.jpg',
    category: 'Database',
    tags: ['PostgreSQL', 'Prisma', 'Database Design', 'SQL'],
    author: 'John Developer',
    publishedAt: '2023-12-28T10:00:00Z',
    readingTime: 15,
    views: 1750,
    status: 'published',
  },
  {
    id: '5',
    slug: 'real-time-applications-with-websockets',
    title: 'Building Real-time Applications with WebSockets and Server-Sent Events',
    excerpt: 'Comparison of WebSockets vs SSE for real-time features, with implementation examples in Node.js and Next.js.',
    content: 'Full article content here...',
    coverImage: '/blog/realtime.jpg',
    category: 'Backend',
    tags: ['WebSockets', 'SSE', 'Node.js', 'Real-time'],
    author: 'John Developer',
    publishedAt: '2023-12-20T10:00:00Z',
    readingTime: 14,
    views: 1340,
    status: 'published',
  },
  {
    id: '6',
    slug: 'accessibility-in-react-applications',
    title: 'Accessibility in React Applications: A Practical Guide',
    excerpt: 'Implementing WCAG 2.1 AA compliance in React apps with semantic HTML, ARIA, and testing strategies.',
    content: 'Full article content here...',
    coverImage: '/blog/accessibility.jpg',
    category: 'Frontend',
    tags: ['Accessibility', 'React', 'WCAG', 'ARIA', 'Testing'],
    author: 'John Developer',
    publishedAt: '2023-12-15T10:00:00Z',
    readingTime: 11,
    views: 890,
    status: 'published',
  },
]

const categories = ['All', 'React', 'TypeScript', 'Performance', 'Database', 'Backend', 'Frontend']

export default function BlogPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="pt-12 bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-600 dark:text-slate-100 mb-6">
              <span className="text-primary-700 dark:text-primary-300">Blog</span> & Articles
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Technical articles, tutorials, and insights on web development, React, Next.js, and modern technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                aria-label="Search articles"
              />
            </div>
            <div className="flex items-center gap-4">
              <Select
                placeholder="All Categories"
                options={categories.map(c => ({ value: c.toLowerCase(), label: c }))}
                aria-label="Filter by category"
              />
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <article key={post.id} className="card group overflow-hidden animate-in fade-in-0 slide-in-from-top-2" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative aspect-video overflow-hidden -m-6 mb-6 rounded-t-xl">
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="h-12 w-12 mx-auto mb-2 bg-white/20 dark:bg-white/10 rounded-xl flex items-center justify-center">
                        <ExternalLink className="h-6 w-6 text-primary-400 dark:text-primary-500" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400">Cover Image</p>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-100 mb-2 line-clamp-2 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">+{post.tags.length - 3} more</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 dark:text-primary-300 hover:underline">
                    Read More
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 bg-primary-700 dark:bg-primary-800">
        <div className="container-main text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">Stay Updated</h2>
          <p className="text-primary-100 mb-8 text-lg">
            Get the latest articles delivered straight to your inbox. No spam, unsubscribe anytime.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
              aria-label="Email address"
            />
            <Button type="submit" className="w-full sm:w-auto bg-white text-primary-700 hover:bg-primary-50">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}