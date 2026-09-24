import { Metadata } from 'next'
import { Award, Brain, Heart, Lightbulb, Target, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getExperiences } from '@/services/experience.service'
import { formatDate } from '@/lib/utils'
import type { Experience } from '@/types'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about my professional background, development approach, and goals.',
}

const strengths = [
  { title: 'Problem Solving', description: 'Breaking down complex problems into manageable solutions with clean, maintainable code.', icon: Brain },
  { title: 'Performance Focused', description: 'Optimizing applications for speed, scalability, and exceptional user experience.', icon: TrendingUp },
  { title: 'Clean Architecture', description: 'Writing modular, testable code following SOLID principles and best practices.', icon: Award },
  { title: 'Continuous Learning', description: 'Staying current with modern technologies and industry trends to deliver cutting-edge solutions.', icon: Lightbulb },
  { title: 'User-Centric', description: 'Building intuitive interfaces with accessibility and usability as top priorities.', icon: Heart },
  { title: 'Goal Oriented', description: 'Delivering projects on time with clear communication and transparent processes.', icon: Target },
]

function getYearRange(exp: Experience) {
  const start = new Date(exp.start_date).getFullYear()
  const end = exp.current ? 'Present' : (exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present')
  return `${start} - ${end}`
}

export default async function AboutPage() {
  const experiences = await getExperiences()

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              About <span className="text-primary-700 dark:text-primary-300">Me</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Passionate full-stack developer with 5+ years of experience building scalable web applications.
              I specialize in React, Next.js, TypeScript, and modern cloud technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Professional Background */}
      <section className="section">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">Professional Background</h2>
              <p className="section-subtitle max-w-none">
                My journey in software development started with a curiosity for how things work on the web.
                Over the past 5 years, I&apos;ve had the privilege of working with startups, agencies, and enterprise companies,
                delivering solutions that solve real business problems.
              </p>
              <div className="mt-8 space-y-4">
                <p className="text-slate-600 dark:text-slate-400">
                  I believe in writing clean, maintainable code that scales. My approach combines modern best practices
                  with pragmatic solutions — choosing the right tool for the job rather than following trends blindly.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                When I&apos;m not coding, you&apos;ll find me contributing to open-source projects, writing technical articles,
                or exploring new technologies. I&apos;m a strong advocate for developer experience, accessibility,
                  and building inclusive digital products.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-1">
                <div className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  Profile Image
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl border border-slate-200 dark:border-slate-700">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-700 dark:text-primary-300">5+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Approach */}
      <section className="section bg-slate-50 dark:bg-slate-900">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Development Approach</h2>
            <p className="section-subtitle">How I work to deliver high-quality software solutions.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strengths.map((strength, index) => (
              <Card key={strength.title} className="group hover:shadow-lg transition-shadow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 group-hover:bg-primary-700 group-hover:text-white transition-colors">
                  <strength.icon className="h-6 w-6 text-primary-700 dark:text-primary-300 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{strength.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{strength.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Journey</h2>
            <p className="section-subtitle">Key milestones in my professional journey.</p>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="relative pl-20">
                  <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-primary-600 border-4 border-white dark:border-slate-950 z-10" />
                  <div className="card">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-primary-700 bg-primary-100 px-2 py-0.5 rounded dark:bg-primary-900/30 dark:text-primary-300">
                        {getYearRange(exp)}
                      </span>
                      {exp.location && (
                        <span className="text-sm text-slate-500 dark:text-slate-400">{exp.location}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{exp.title}</h3>
                    <p className="text-lg text-primary-700 dark:text-primary-300 font-medium mb-2">{exp.company}</p>
                    {exp.description && <p className="text-slate-600 dark:text-slate-400">{exp.description}</p>}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {exp.technologies.map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="section bg-primary-700 dark:bg-primary-800">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{experiences.length}+</div>
              <div className="text-primary-100">Positions Held</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">5+</div>
              <div className="text-primary-100">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">30+</div>
              <div className="text-primary-100">Technologies Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-primary-100">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="section">
        <div className="container-main">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-12">Goals & Vision</h2>
            <div className="space-y-6">
              <Card>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Short-term Goals</h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">→ Master advanced Next.js patterns (Server Actions, Streaming, Partial Prerendering)</li>
                  <li className="flex items-center gap-2">→ Deepen expertise in distributed systems and microservices architecture</li>
                  <li className="flex items-center gap-2">→ Contribute more actively to open-source projects in the React ecosystem</li>
                  <li className="flex items-center gap-2">→ Publish technical content on performance optimization and developer experience</li>
                </ul>
              </Card>
              <Card>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">Long-term Vision</h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-2">→ Build developer tools that improve productivity and code quality</li>
                  <li className="flex items-center gap-2">→ Mentor and grow the next generation of developers</li>
                  <li className="flex items-center gap-2">→ Lead engineering teams building impactful products at scale</li>
                  <li className="flex items-center gap-2">→ Speak at conferences and share knowledge with the developer community</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}