import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, CheckCircle, Code, ExternalLink, Github, Star, User } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { getProjectBySlug, FALLBACK_PROJECTS } from '@/services/project.service'

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} - Project Details`,
    description: project.short_description || project.detailed_description,
  }
}

export async function generateStaticParams() {
  return FALLBACK_PROJECTS.map(project => ({ slug: project.slug }))
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const technologies = project.technologies || []
  const images = project.images || []

  return (
    <div className="space-y-16 py-8">
      {/* Back Link */}
      <div className="container-main">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950 border-y border-slate-200 dark:border-slate-800 py-12">
        <div className="container-main">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{project.category || 'General'}</Badge>
              {project.featured && <Badge variant="default"><Star className="h-3 w-3 mr-1" /> Featured</Badge>}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">{project.title}</h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-6">{project.short_description}</p>
            
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary-600" />
                <span>{project.start_date ? formatDate(project.start_date) : '2023'} - {project.end_date ? formatDate(project.end_date) : 'Present'}</span>
              </div>
              {project.client && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary-600" />
                  <span>{project.client}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {technologies.map(tech => (
                <Badge key={tech} variant="outline" className="px-3 py-1">{tech}</Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm">
                  <Github className="h-4 w-4" />
                  View Source Code
                </a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-primary-700 text-white rounded-xl text-sm font-semibold hover:bg-primary-800 transition-colors shadow-md">
                  <ExternalLink className="h-4 w-4" />
                  Live Preview
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-main">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Detailed Case Study</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
                {(project.detailed_description || project.short_description || '').split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Key Architectural Features */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Core Deliverables</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Clean modular component architecture with TypeScript strict safety',
                  'Optimized Database schema design with index tuning for low latency query response',
                  'Production CI/CD automated build pipelines and zero-downtime deployment',
                  'Fully responsive UI design tested across desktop, tablet, and mobile browsers'
                ].map((item, idx) => (
                  <Card key={idx} className="flex items-start gap-3 p-4">
                    <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                  </Card>
                ))}
              </div>
            </section>

            {/* Gallery */}
            {images.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Project Gallery</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="aspect-video rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                      <img src={img.url} alt={img.alt || project.title} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 space-y-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-3">Project Metadata</h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">Domain Category</dt>
                  <dd className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{project.category || 'Web Application'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">Client / Industry</dt>
                  <dd className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{project.client || 'Enterprise Client'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">Timeline</dt>
                  <dd className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                    {project.start_date ? formatDate(project.start_date) : '2023'} - {project.end_date ? formatDate(project.end_date) : 'Present'}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-3">Tech Stack Used</h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map(tech => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}