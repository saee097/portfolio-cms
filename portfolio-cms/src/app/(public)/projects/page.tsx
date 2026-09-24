import { Metadata } from 'next'
import { getProjects, getProjectCategories } from '@/services/project.service'
import { ProjectsClient } from './ProjectsClient'

export const metadata: Metadata = {
  title: 'Projects & Work Portfolio',
  description: 'Explore full-stack, SaaS, AI/ML, and mobile application projects designed and engineered with modern web technologies.',
}

export default async function ProjectsPage() {
  const [projectsRes, categories] = await Promise.all([
    getProjects({ pageSize: 50 }),
    getProjectCategories(),
  ])

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950 py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 mb-4">
              Real-World Engineering & Client Solutions
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              Projects & <span className="text-primary-700 dark:text-primary-300">Case Studies</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              A curated showcase of production web applications, SaaS platforms, and AI integrations built for high performance, reliability, and business impact.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Grid Section */}
      <div className="container-main">
        <ProjectsClient initialProjects={projectsRes.data} categories={categories} />
      </div>
    </div>
  )
}