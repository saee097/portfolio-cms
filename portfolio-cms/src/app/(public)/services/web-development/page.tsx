import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Web Development Services',
  description: 'Web development services using TypeScript, React, Next.js, Tailwind CSS, Node.js, NestJS, Express, Python, Django, MongoDB, PostgreSQL, MySQL, and Redis.',
}

const technologies = [
  'TypeScript',
  'React',
  'NextJS',
  'Tailwind CSS',
  'Node JS',
  'NestJS',
  'Express JS',
  'Python',
  'Django',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Redis',
]

export default function WebDevelopmentPage() {
  return (
    <div className="space-y-24">
      <section className="section bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              Web Development
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Modern tools and frameworks I use to build robust, scalable applications.
            </p>
            <Link href="/contact">
              <Button size="lg">
                Start a Project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-white dark:bg-slate-950">
        <div className="container-main">
          <h2 className="section-title text-center mb-16">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {technologies.map((tech, index) => (
              <Card key={tech} className="text-center animate-in fade-in-0" style={{ animationDelay: `${index * 50}ms` }}>
                <h3 className="font-medium text-slate-900 dark:text-slate-100">{tech}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
