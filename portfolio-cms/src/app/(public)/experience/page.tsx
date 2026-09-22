import { Metadata } from 'next'
import { Briefcase, Building2, Calendar, Code, MapPin, Server } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Professional work experience and career history.',
}

const experiences = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: 'Tech Company Inc.',
    location: 'San Francisco, CA',
    description: 'Leading development of scalable web applications using React, Next.js, and Node.js. Architected and implemented a new micro-frontend architecture that improved deployment frequency by 300%. Mentoring 5+ junior developers and conducting code reviews. Established coding standards, CI/CD pipelines, and automated testing practices.',
    technologies: ['React', 'Next.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Jest'],
    startDate: '2022-03-01',
    endDate: null,
    current: true,
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    description: 'Built and maintained multiple client projects from concept to production. Developed a real-time collaboration platform with WebSocket connections serving 10,000+ concurrent users. Implemented payment integration with Stripe and built comprehensive admin dashboards. Reduced API response times by 60% through query optimization and caching.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Stripe', 'Redis', 'Docker'],
    startDate: '2020-06-01',
    endDate: '2022-02-28',
    current: false,
  },
  {
    id: '3',
    title: 'Junior Web Developer',
    company: 'Digital Agency',
    location: 'Remote',
    description: 'Developed responsive websites and web applications for various clients across different industries. Built custom WordPress themes and plugins. Collaborated with designers to implement pixel-perfect UIs. Learned modern JavaScript frameworks and backend development practices.',
    technologies: ['JavaScript', 'Vue.js', 'PHP', 'MySQL', 'WordPress', 'HTML/CSS', 'Git', 'REST APIs'],
    startDate: '2019-01-01',
    endDate: '2020-05-31',
    current: false,
  },
  {
    id: '4',
    title: 'Software Engineering Intern',
    company: 'TechCorp',
    location: 'Boston, MA',
    description: 'Assisted in developing internal tools for the engineering team. Built automated testing scripts and improved deployment processes. Contributed to the migration of legacy systems to modern cloud infrastructure. Gained experience with agile methodologies and version control.',
    technologies: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Jenkins', 'Git', 'Linux'],
    startDate: '2018-06-01',
    endDate: '2018-12-31',
    current: false,
  },
]

export default function ExperiencePage() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              Professional <span className="text-primary-700 dark:text-primary-300">Experience</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              My journey building software solutions for startups, agencies, and enterprise companies.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container-main">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="relative pl-20 animate-in fade-in-0 slide-in-from-top-2" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-primary-600 border-4 border-white dark:border-slate-950 z-10" />
                  <Card className="group hover:shadow-lg transition-shadow">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-sm font-medium text-primary-700 bg-primary-100 px-3 py-1 rounded-full dark:bg-primary-900/30 dark:text-primary-300">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                      </span>
                      {exp.current && (
                        <Badge variant="default" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4" />
                      <span>{exp.location}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">{exp.title}</h3>
                    <p className="text-lg text-primary-700 dark:text-primary-300 font-medium mb-4">{exp.company}</p>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map(tech => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="section bg-slate-50 dark:bg-slate-900">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">At a Glance</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <div className="text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">{experiences.length}+</div>
              <div className="text-slate-600 dark:text-slate-400">Positions Held</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">5+</div>
              <div className="text-slate-600 dark:text-slate-400">Years Experience</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">10+</div>
              <div className="text-slate-600 dark:text-slate-400">Technologies Used</div>
            </Card>
            <Card className="text-center">
              <div className="text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">4</div>
              <div className="text-slate-600 dark:text-slate-400">Companies</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="section">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Key Achievements</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                  <Server className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Performance Optimization</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">Reduced API response times by 60% through query optimization, caching strategies, and database indexing.</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Architecture Modernization</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">Led migration from monolithic to micro-frontend architecture, improving deployment frequency by 300%.</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Team Leadership</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">Mentored 5+ junior developers, established coding standards, and implemented comprehensive code review processes.</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
                  <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Delivery Excellence</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">Consistently delivered projects on time with 100% client satisfaction rate across 50+ projects.</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                  <Briefcase className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">SaaS Development</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">Built real-time collaboration platform serving 10,000+ concurrent users with WebSocket connections.</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-900/30">
                  <Code className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Open Source Contribution</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">Active contributor to open-source projects in the React and Next.js ecosystem.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}