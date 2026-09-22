import { Metadata } from 'next'
import { ArrowRight, Code, ExternalLink, Filter, Github, Search, Star } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Portfolio of projects showcasing full-stack development, React, Next.js, and modern web technologies.',
}

const projects = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    shortDescription: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
    detailedDescription: 'A complete e-commerce platform built with Next.js 15, featuring server-side rendering for optimal SEO, Stripe integration for payments, real-time inventory management, and a comprehensive admin dashboard. Includes user authentication, order tracking, product reviews, and analytics.',
    thumbnail: '/projects/ecommerce.jpg',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Tailwind CSS', 'Prisma'],
    githubUrl: 'https://github.com/username/ecommerce',
    liveUrl: 'https://ecommerce-demo.example.com',
    category: 'Full-Stack',
    client: 'Retail Client',
    startDate: '2023-01-15',
    endDate: '2023-06-30',
    featured: true,
    published: true,
  },
  {
    id: '2',
    title: 'Task Management App',
    slug: 'task-management-app',
    shortDescription: 'Collaborative task management with real-time updates, teams, and project analytics.',
    detailedDescription: 'A real-time collaborative task management application with team workspaces, project boards, drag-and-drop functionality, and comprehensive analytics. Built with WebSocket connections for instant updates across all clients.',
    thumbnail: '/projects/taskmanager.jpg',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express', 'TypeScript'],
    githubUrl: 'https://github.com/username/taskmanager',
    liveUrl: 'https://tasks.example.com',
    category: 'SaaS',
    client: 'Productivity Startup',
    startDate: '2022-08-01',
    endDate: '2023-02-28',
    featured: true,
    published: true,
  },
  {
    id: '3',
    title: 'Analytics Dashboard',
    slug: 'analytics-dashboard',
    shortDescription: 'Real-time analytics dashboard with customizable widgets and data visualization.',
    detailedDescription: 'A powerful analytics dashboard featuring real-time data visualization, customizable widgets, export capabilities, and role-based access control. Built for monitoring business metrics across multiple data sources.',
    thumbnail: '/projects/analytics.jpg',
    technologies: ['Next.js', 'TypeScript', 'Recharts', 'PostgreSQL', 'Redis', 'Docker'],
    githubUrl: 'https://github.com/username/analytics',
    liveUrl: 'https://analytics.example.com',
    category: 'Dashboard',
    client: 'Enterprise Client',
    startDate: '2023-03-01',
    endDate: '2023-08-15',
    featured: true,
    published: true,
  },
  {
    id: '4',
    title: 'Learning Management System',
    slug: 'learning-management-system',
    shortDescription: 'Complete LMS with course creation, video streaming, progress tracking, and certificates.',
    detailedDescription: 'A full-featured learning management system with course authoring tools, video streaming with progress tracking, quizzes, assignments, discussion forums, and certificate generation. Supports multiple instructors and organizations.',
    thumbnail: '/projects/lms.jpg',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Mux', 'Stripe', 'Prisma'],
    githubUrl: 'https://github.com/username/lms',
    liveUrl: 'https://lms.example.com',
    category: 'EdTech',
    client: 'Education Startup',
    startDate: '2022-11-01',
    endDate: '2023-04-30',
    featured: false,
    published: true,
  },
  {
    id: '5',
    title: 'Real Estate Platform',
    slug: 'real-estate-platform',
    shortDescription: 'Property listing platform with map integration, virtual tours, and agent management.',
    detailedDescription: 'A modern real estate platform featuring interactive maps, 3D virtual tours, advanced search filters, agent profiles, and inquiry management. Includes CRM integration for agents and automated property valuation estimates.',
    thumbnail: '/projects/realestate.jpg',
    technologies: ['React', 'Next.js', 'Mapbox', 'PostgreSQL', 'TypeScript', 'AWS S3'],
    githubUrl: 'https://github.com/username/realestate',
    liveUrl: 'https://realestate.example.com',
    category: 'PropTech',
    client: 'Real Estate Agency',
    startDate: '2021-09-01',
    endDate: '2022-03-31',
    featured: false,
    published: true,
  },
  {
    id: '6',
    title: 'Healthcare Appointment System',
    slug: 'healthcare-appointment-system',
    shortDescription: 'Patient portal with appointment scheduling, telemedicine, and medical records.',
    detailedDescription: 'A HIPAA-compliant healthcare platform with patient portals, appointment scheduling, video consultations, electronic health records, prescription management, and insurance verification. Built with security and privacy as top priorities.',
    thumbnail: '/projects/healthcare.jpg',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Twilio', 'WebRTC', 'Prisma'],
    githubUrl: 'https://github.com/username/healthcare',
    liveUrl: 'https://health.example.com',
    category: 'HealthTech',
    client: 'Medical Practice',
    startDate: '2023-05-01',
    endDate: '2023-11-30',
    featured: false,
    published: true,
  },
]

const categories = ['All', 'Full-Stack', 'SaaS', 'Dashboard', 'EdTech', 'PropTech', 'HealthTech']

export default function ProjectsPage() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              Selected <span className="text-primary-700 dark:text-primary-300">Projects</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              A collection of projects demonstrating expertise across various domains and technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="section bg-slate-50 dark:bg-slate-900">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search projects..."
                className="pl-10"
                aria-label="Search projects"
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

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <article key={project.id} className="card group overflow-hidden animate-in fade-in-0 slide-in-from-top-2" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative aspect-video overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center">
                    <div className="text-center p-4">
                      <Code className="h-12 w-12 mx-auto mb-2 text-primary-400 dark:text-primary-500" />
                      <p className="text-slate-500 dark:text-slate-400">Project Image</p>
                    </div>
                  </div>
                  {project.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="default"><Star className="h-3 w-3 mr-1" /> Featured</Badge>
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="secondary">{project.category}</Badge>
                  </div>
                </div>
                <div className="p-4 pt-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{project.shortDescription}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 5).map(tech => (
                      <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                    ))}
                    {project.technologies.length > 5 && (
                      <Badge variant="outline" className="text-xs">+{project.technologies.length - 5} more</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-slate-600 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
                        <Github className="h-4 w-4" />
                        Code
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-slate-600 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300">
                        <ExternalLink className="h-4 w-4" />
                        Live
                      </a>
                    )}
                    <Link href={`/projects/${project.slug}`} className="ml-auto flex items-center gap-1 text-sm text-primary-700 dark:text-primary-300 hover:underline">
                      Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary-700 dark:bg-primary-800">
        <div className="container-main text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Have a Project in Mind?</h2>
          <p className="text-primary-100 mb-8 text-lg max-w-2xl mx-auto">
            Let's collaborate on your next project. I'm available for freelance work, contract positions, and full-time opportunities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-primary-50">
                Start a Project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/resume">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-primary-600">
                View Resume
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}