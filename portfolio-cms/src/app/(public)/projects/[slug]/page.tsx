import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, CheckCircle, Code, ExternalLink, Github, MapPin, Star, Tag, User } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Project Details',
  description: 'Detailed view of a portfolio project.',
}

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>
}

const projects = [
  {
    slug: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    shortDescription: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
    detailedDescription: `A complete e-commerce platform built with Next.js 15, featuring server-side rendering for optimal SEO, Stripe integration for payments, real-time inventory management, and a comprehensive admin dashboard. 

## Key Features

- **Product Management**: Full CRUD for products, categories, variants, and inventory tracking
- **Shopping Cart & Checkout**: Persistent cart with guest and authenticated checkout flows
- **Payment Processing**: Stripe integration with support for cards, digital wallets, and subscriptions
- **Order Management**: Complete order lifecycle from placement to fulfillment with email notifications
- **User Authentication**: Secure authentication with NextAuth.js, social login, and email verification
- **Admin Dashboard**: Analytics, order management, customer insights, and inventory alerts
- **Search & Filtering**: Full-text search with faceted filtering by category, price, attributes
- **Responsive Design**: Mobile-first approach with Tailwind CSS and progressive enhancement

## Technical Architecture

The application follows a modern server-driven architecture with Next.js App Router:

- **Frontend**: React 19 Server Components with selective Client Components for interactivity
- **Backend**: Next.js API Routes and Server Actions for mutations
- **Database**: PostgreSQL with Prisma ORM for type-safe database access
- **Caching**: Redis for session storage, rate limiting, and query caching
- **Deployment**: Vercel with edge functions for global performance
- **Monitoring**: Vercel Analytics and Sentry for error tracking

## Challenges & Solutions

**Challenge**: Handling high traffic during flash sales while maintaining data consistency.
**Solution**: Implemented optimistic locking with database transactions, Redis-based queue for order processing, and edge caching for product pages.

**Challenge**: Real-time inventory updates across multiple users.
**Solution**: Used Server-Sent Events (SSE) for lightweight real-time updates without WebSocket overhead.`,
    thumbnail: '/projects/ecommerce.jpg',
    images: ['/projects/ecommerce-1.jpg', '/projects/ecommerce-2.jpg', '/projects/ecommerce-3.jpg'],
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'PostgreSQL', 'Prisma', 'Stripe', 'Tailwind CSS', 'Redis', 'NextAuth.js'],
    githubUrl: 'https://github.com/username/ecommerce',
    liveUrl: 'https://ecommerce-demo.example.com',
    category: 'Full-Stack',
    client: 'Retail Client',
    startDate: '2023-01-15',
    endDate: '2023-06-30',
    featured: true,
    published: true,
    features: [
      'Product catalog with variants & inventory',
      'Shopping cart & secure checkout',
      'Stripe payment integration',
      'Order management & tracking',
      'User accounts & authentication',
      'Admin dashboard with analytics',
      'Email notifications',
      'Search & faceted filtering',
      'Responsive mobile-first design',
      'Accessibility (WCAG 2.1 AA)',
    ],
    architecture: 'Server-driven architecture with Next.js App Router, Server Components, Server Actions, and PostgreSQL/Prisma.',
    challenges: 'High-traffic flash sales handling, real-time inventory sync, SEO optimization for product pages.',
    solutions: 'Optimistic locking, Redis queues, SSE for real-time updates, edge caching, structured data markup.',
  },
  {
    slug: 'task-management-app',
    title: 'Task Management App',
    shortDescription: 'Collaborative task management with real-time updates, teams, and project analytics.',
    detailedDescription: `A real-time collaborative task management application designed for teams of all sizes. Features include project boards, drag-and-drop functionality, real-time updates via WebSockets, and comprehensive analytics.`,
    thumbnail: '/projects/taskmanager.jpg',
    images: ['/projects/taskmanager-1.jpg', '/projects/taskmanager-2.jpg'],
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express', 'TypeScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com/username/taskmanager',
    liveUrl: 'https://tasks.example.com',
    category: 'SaaS',
    client: 'Productivity Startup',
    startDate: '2022-08-01',
    endDate: '2023-02-28',
    featured: true,
    published: true,
    features: [
      'Real-time collaboration with WebSockets',
      'Kanban boards with drag-and-drop',
      'Team workspaces & permissions',
      'Project analytics & reporting',
      'Task dependencies & subtasks',
      'Comments & mentions',
      'File attachments',
      'Email & in-app notifications',
      'Dark mode support',
      'Mobile responsive',
    ],
    architecture: 'MERN stack with Socket.io for real-time communication, MongoDB for flexible document storage.',
    challenges: 'Real-time sync across multiple clients, conflict resolution for concurrent edits, scaling WebSocket connections.',
    solutions: 'Operational transformation for conflict resolution, Redis adapter for horizontal WebSocket scaling, optimistic UI updates.',
  },
  {
    slug: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    shortDescription: 'Real-time analytics dashboard with customizable widgets and data visualization.',
    detailedDescription: `A powerful analytics dashboard featuring real-time data visualization, customizable widgets, export capabilities, and role-based access control. Built for monitoring business metrics across multiple data sources.`,
    thumbnail: '/projects/analytics.jpg',
    images: ['/projects/analytics-1.jpg'],
    technologies: ['Next.js', 'TypeScript', 'Recharts', 'PostgreSQL', 'Redis', 'Docker', 'Tailwind CSS'],
    githubUrl: 'https://github.com/username/analytics',
    liveUrl: 'https://analytics.example.com',
    category: 'Dashboard',
    client: 'Enterprise Client',
    startDate: '2023-03-01',
    endDate: '2023-08-15',
    featured: true,
    published: true,
    features: [
      'Real-time data visualization',
      'Customizable dashboard widgets',
      'Multiple chart types (line, bar, pie, heatmap)',
      'Date range filtering & comparison',
      'Data export (CSV, PDF, PNG)',
      'Role-based access control',
      'Multi-tenant architecture',
      'Scheduled email reports',
      'API for external integrations',
      'Dark/light theme',
    ],
    architecture: 'Next.js with Server Components, PostgreSQL for time-series data, Redis for caching, Recharts for visualizations.',
    challenges: 'Rendering large datasets efficiently, real-time updates without performance impact, flexible widget system.',
    solutions: 'Virtualized lists, Web Workers for data processing, WebSocket for selective updates, plugin-based widget architecture.',
  },
]

export async function generateStaticParams() {
  return projects.map(project => ({ slug: project.slug }))
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params
  const project = projects.find(p => p.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="space-y-16">
      {/* Back Link */}
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      {/* Hero */}
      <section className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{project.category}</Badge>
            {project.featured && <Badge variant="default"><Star className="h-3 w-3 mr-1" /> Featured</Badge>}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">{project.title}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">{project.shortDescription}</p>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}</span>
            </div>
            {project.client && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <User className="h-4 w-4" />
                <span>{project.client}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {project.technologies.map(tech => (
              <Badge key={tech} variant="outline">{tech}</Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Github className="h-4 w-4" />
                View Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-lg text-sm font-medium hover:bg-primary-800 transition-colors">
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="container-main">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Overview</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {project.detailedDescription.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 text-slate-600 dark:text-slate-400 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Features */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Key Features</h2>
              <ul className="space-y-3">
                {project.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Architecture */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Architecture</h2>
              <Card>
                <p className="text-slate-600 dark:text-slate-400">{project.architecture}</p>
              </Card>
            </section>

            {/* Challenges & Solutions */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Challenges & Solutions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-red-500">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <Code className="h-5 w-5 text-red-500" />
                    Challenges
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{project.challenges}</p>
                </Card>
                <Card className="border-l-4 border-green-500">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Solutions
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{project.solutions}</p>
                </Card>
              </div>
            </section>

            {/* Screenshots */}
            {project.images.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Screenshots</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.images.map((image, i) => (
                    <div key={i} className="aspect-video rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        Screenshot {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Project Info</h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">Category</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">{project.category}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">Client</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">{project.client}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">Duration</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">
                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">Status</dt>
                  <dd className="font-medium text-slate-900 dark:text-slate-100">{project.featured ? 'Featured' : 'Published'}</dd>
                </div>
              </dl>
            </Card>

            <Card>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Links</h3>
              <div className="space-y-3">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
                    <Github className="h-4 w-4" />
                    GitHub Repository
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}