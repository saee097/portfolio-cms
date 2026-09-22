import { Metadata } from 'next'
import { ArrowRight, CheckCircle, Code, Database, Globe, Layers, Rocket, Server } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Professional services offered — Full-stack development, React/Next.js, APIs, databases, and more.',
}

const services = [
  {
    id: '1',
    title: 'Full-Stack Development',
    slug: 'full-stack-development',
    shortDescription: 'End-to-end web application development from concept to deployment.',
    description: 'I build complete web applications handling both frontend and backend development. This includes architecture design, database modeling, API development, user interface implementation, testing, deployment, and ongoing maintenance. Whether you need a startup MVP or an enterprise-grade application, I deliver scalable solutions using modern best practices.',
    icon: Layers,
    features: [
      'Custom web application development',
      'Architecture design & planning',
      'Database design & optimization',
      'API development (REST/GraphQL)',
      'Authentication & authorization',
      'Third-party integrations',
      'Automated testing (unit, integration, E2E)',
      'CI/CD pipeline setup',
      'Deployment & DevOps',
      'Performance monitoring',
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'],
  },
  {
    id: '2',
    title: 'React & Next.js Development',
    slug: 'react-nextjs-development',
    shortDescription: 'Modern React applications with server-side rendering and optimal performance.',
    description: 'Specialized in building high-performance React applications using Next.js App Router, Server Components, and the latest React 19 features. I create applications that are SEO-friendly, fast, and provide excellent developer experience. From marketing sites to complex dashboards, I leverage the full power of the React ecosystem.',
    icon: Code,
    features: [
      'Next.js App Router & Server Components',
      'React 19 with concurrent features',
      'TypeScript for type safety',
      'Server-side rendering (SSR) & SSG',
      'Streaming & Suspense boundaries',
      'Partial Prerendering (PPR)',
      'Server Actions & mutations',
      'Middleware & edge functions',
      'Internationalization (i18n)',
      'Accessibility (WCAG 2.1 AA)',
    ],
    technologies: ['React 19', 'Next.js 15', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'React Query'],
  },
  {
    id: '3',
    title: 'REST API Development',
    slug: 'rest-api-development',
    shortDescription: 'Scalable and secure RESTful APIs with proper documentation.',
    description: 'Design and implementation of robust RESTful APIs following industry standards. I focus on creating well-documented, versioned APIs with proper error handling, validation, authentication, and rate limiting. APIs are built with OpenAPI/Swagger documentation for seamless frontend integration.',
    icon: Server,
    features: [
      'RESTful API design (OpenAPI 3.0)',
      'Authentication (JWT, OAuth 2.0, API Keys)',
      'Rate limiting & throttling',
      'Request/response validation (Zod)',
      'Error handling & logging',
      'API versioning strategy',
      'Comprehensive documentation (Swagger UI)',
      'Webhook implementations',
      'GraphQL API development',
      'Real-time with WebSockets/SSE',
    ],
    technologies: ['Node.js', 'Express/NestJS', 'TypeScript', 'Zod', 'Swagger', 'PostgreSQL', 'Redis'],
  },
  {
    id: '4',
    title: 'Database Integration & Optimization',
    slug: 'database-integration',
    shortDescription: 'Database design, optimization, and migration services.',
    description: 'Expert database services including schema design, query optimization, migration planning, and performance tuning. I work with both SQL and NoSQL databases, with deep expertise in PostgreSQL and Supabase. Services include data modeling, indexing strategies, connection pooling, and scaling solutions.',
    icon: Database,
    features: [
      'Database schema design & modeling',
      'Query optimization & indexing',
      'Migration planning & execution',
      'Performance tuning & monitoring',
      'Connection pooling & scaling',
      'Backup & disaster recovery',
      'Data migration & ETL',
      'Read replicas & sharding',
      'Vector database setup (pgvector)',
      'Supabase/PostgreSQL expertise',
    ],
    technologies: ['PostgreSQL', 'Supabase', 'Prisma', 'Drizzle', 'Redis', 'MongoDB', 'pgvector'],
  },
  {
    id: '5',
    title: 'Responsive UI Development',
    slug: 'responsive-ui-development',
    shortDescription: 'Pixel-perfect, accessible interfaces that work on all devices.',
    description: 'Crafting beautiful, responsive user interfaces that provide exceptional user experience across all devices. I implement designs with pixel-perfect accuracy using modern CSS techniques, ensuring accessibility compliance and cross-browser compatibility. From design systems to component libraries.',
    icon: Globe,
    features: [
      'Mobile-first responsive design',
      'Tailwind CSS & modern CSS',
      'Component library development',
      'Design system implementation',
      'Accessibility (WCAG 2.1 AA)',
      'Cross-browser compatibility',
      'Dark mode support',
      'Animation & micro-interactions',
      'Design-to-code (Figma)',
      'Performance optimization',
    ],
    technologies: ['Tailwind CSS', 'CSS Grid/Flexbox', 'Framer Motion', 'Radix UI', 'Headless UI', 'Storybook'],
  },
  {
    id: '6',
    title: 'Performance Optimization',
    slug: 'performance-optimization',
    shortDescription: 'Improve load times, Core Web Vitals, and user experience.',
    description: 'Comprehensive performance auditing and optimization services. I analyze and improve Core Web Vitals, reduce bundle sizes, implement caching strategies, optimize images, and configure CDNs. The goal is to deliver lightning-fast experiences that improve conversion rates and user satisfaction.',
    icon: Rocket,
    features: [
      'Core Web Vitals optimization',
      'Bundle analysis & code splitting',
      'Image optimization (next/image)',
      'Caching strategies (HTTP, Redis, CDN)',
      'Database query optimization',
      'Lazy loading & prefetching',
      'Service worker implementation',
      'Edge computing & middleware',
      'Performance monitoring (Lighthouse)',
      'Real User Monitoring (RUM)',
    ],
    technologies: ['Next.js', 'Lighthouse', 'Web Vitals', 'Redis', 'Cloudflare', 'Vercel', 'Bundle Analyzer'],
  },
]

export default function ServicesPage() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              Services <span className="text-primary-700 dark:text-primary-300">I Offer</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Professional development services tailored to your project needs. From concept to production.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container-main">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {services.map((service, index) => (
              <Card key={service.id} className="group hover:shadow-xl transition-shadow animate-in fade-in-0 slide-in-from-top-2" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 mb-4 group-hover:bg-primary-700 group-hover:text-white transition-colors">
                  <service.icon className="h-6 w-6 text-primary-700 dark:text-primary-300 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{service.shortDescription}</p>
                <Link href={`/services/${service.slug}`}>
                  <Button variant="ghost" className="w-full justify-start gap-1">
                    Learn More
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/contact">
              <Button size="lg">
                Discuss Your Project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="section bg-slate-50 dark:bg-slate-900">
        <div className="container-main">
          {services.map((service, index) => (
            <div key={service.id} className="mb-20 animate-in fade-in-0" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
                      <service.icon className="h-7 w-7 text-primary-700 dark:text-primary-300" />
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-1">{service.title}</Badge>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{service.title}</h3>
                    </div>
                  </div>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map(tech => (
                      <Badge key={tech} variant="outline">{tech}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">What\'s Included</h4>
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {index < services.length - 1 && (
                <hr className="mt-20 border-slate-200 dark:border-slate-700" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary-700 dark:bg-primary-800">
        <div className="container-main text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-primary-100 mb-8 text-lg max-w-2xl mx-auto">
            Let's discuss your requirements and create something amazing together.
            I offer free initial consultations to understand your needs.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-primary-50">
              Get a Free Quote
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}