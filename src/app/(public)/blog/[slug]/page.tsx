import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, ExternalLink, Tag, User } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { formatDate, calculateReadingTime } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog Post',
  description: 'Read the full article.',
}

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>
}

const blogPosts = [
  {
    slug: 'building-scalable-react-applications',
    title: 'Building Scalable React Applications with Next.js 15',
    excerpt: 'Learn how to architect React applications that scale using Next.js App Router, Server Components, and modern patterns.',
    content: `# Building Scalable React Applications with Next.js 15

Modern React applications require careful architectural decisions to scale effectively. With Next.js 15 and the App Router, we have powerful tools at our disposal.

## Server Components by Default

Next.js 15 makes Server Components the default, which dramatically reduces the amount of JavaScript sent to the client. This leads to faster initial page loads and better SEO.

\`\`\`tsx
// app/products/page.tsx
async function getProducts() {
  const res = await fetch('https://api.example.com/products')
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()
  
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
\`\`\`

## Streaming with Suspense

For data that takes longer to fetch, use Suspense boundaries to stream the UI progressively.

\`\`\`tsx
import { Suspense } from 'react'
import { ProductList } from './ProductList'

export default function Page() {
  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductList />
    </Suspense>
  )
}
\`\`\`

## Server Actions for Mutations

Server Actions allow you to define server-side functions that can be called directly from Client Components.

\`\`\`tsx
'use server'

export async function createProduct(formData: FormData) {
  const name = formData.get('name')
  await db.product.create({ data: { name } })
  revalidatePath('/products')
}
\`\`\`

## Conclusion

By embracing Server Components, streaming, and Server Actions, you can build React applications that are both performant and maintainable.`,
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
    slug: 'mastering-typescript-patterns',
    title: 'Mastering Advanced TypeScript Patterns for Better Type Safety',
    excerpt: 'Deep dive into conditional types, mapped types, template literals, and other advanced TypeScript features.',
    content: `# Mastering Advanced TypeScript Patterns

TypeScript's advanced type system enables powerful patterns that catch bugs at compile time.

## Conditional Types

\`\`\`typescript
type IsString<T> = T extends string ? true : false

type Test1 = IsString<string>  // true
type Test2 = IsString<number>  // false
\`\`\`

## Mapped Types

\`\`\`typescript
type Optional<T> = {
  [K in keyof T]?: T[K]
}

type User = { id: number; name: string; email: string }
type PartialUser = Optional<User>
// { id?: number; name?: string; email?: string }
\`\`\`

## Template Literal Types

\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`

type ClickEvent = EventName<'click'>  // 'onClick'
type HoverEvent = EventName<'hover'>  // 'onHover'
\`\`\`

These patterns help create more expressive and safer APIs.`,
    coverImage: '/blog/typescript-patterns.jpg',
    category: 'TypeScript',
    tags: ['TypeScript', 'Generics', 'Type Safety'],
    author: 'John Developer',
    publishedAt: '2024-01-10T10:00:00Z',
    readingTime: 12,
    views: 980,
    status: 'published',
  },
]

export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }))
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = blogPosts.filter(p => p.slug !== slug).slice(0, 3)
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${post.slug}`

  return (
    <article className="space-y-12">
      {/* Back Link */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {/* Header */}
      <header className="max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Badge variant="secondary">{post.category}</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-600 dark:text-slate-100 mb-6">{post.title}</h1>
        
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <ExternalLink className="h-4 w-4" />
            <span>{post.views.toLocaleString()} views</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {post.tags.map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      </header>

      {/* Cover Image */}
      <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30">
        <div className="w-full h-full flex items-center justify-center text-slate-400">
          Cover Image
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {post.content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('```')) {
              const lines = paragraph.split('\n')
              const lang = lines[0].slice(3)
              const code = lines.slice(1, -1).join('\n')
              return (
                <pre key={i} className="bg-slate-900 rounded-xl p-4 overflow-x-auto mb-6">
                  <code className="text-slate-100 text-sm">{code}</code>
                </pre>
              )
            }
            return <p key={i} className="mb-4 text-slate-600 dark:text-slate-400 leading-relaxed">{paragraph}</p>
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-8 border-t border-slate-200 dark:border-slate-700">
          <Tag className="h-5 w-5 text-slate-500" />
          <span className="text-sm text-slate-500 dark:text-slate-400">Tags:</span>
          {post.tags.map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>

        {/* Share */}
        <div className="flex items-center gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-100">Share:</span>
          <div className="flex gap-2">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary-600 dark:hover:text-primary-400">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary-600 dark:hover:text-primary-400">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
            </a>
          </div>
        </div>

{/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-100 mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`} className="card group hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-slate-600 dark:text-slate-100 mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{related.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{formatDate(related.publishedAt)}</span>
                    <span>{related.readingTime} min read</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}