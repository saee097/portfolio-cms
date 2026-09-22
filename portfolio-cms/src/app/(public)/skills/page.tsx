import { Metadata } from 'next'
import { Code, Database, Globe, Layers, Server, Terminal } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Technical skills organized by category — Frontend, Backend, Database, and Tools.',
}

const skillCategories = [
  {
    name: 'Frontend',
    slug: 'frontend',
    icon: Code,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10 dark:bg-blue-900/30',
    skills: [
      { name: 'React', proficiency: 95 },
      { name: 'Next.js', proficiency: 90 },
      { name: 'TypeScript', proficiency: 90 },
      { name: 'Tailwind CSS', proficiency: 95 },
      { name: 'Vue.js', proficiency: 75 },
      { name: 'HTML5/CSS3', proficiency: 95 },
      { name: 'Framer Motion', proficiency: 85 },
      { name: 'React Query', proficiency: 85 },
      { name: 'Zustand/Redux', proficiency: 80 },
      { name: 'Testing (Jest/Vitest)', proficiency: 80 },
    ],
  },
  {
    name: 'Backend',
    slug: 'backend',
    icon: Server,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-500/10 dark:bg-green-900/30',
    skills: [
      { name: 'Node.js', proficiency: 90 },
      { name: 'Express.js', proficiency: 85 },
      { name: 'NestJS', proficiency: 75 },
      { name: 'Python', proficiency: 70 },
      { name: 'REST APIs', proficiency: 90 },
      { name: 'GraphQL', proficiency: 80 },
      { name: 'Authentication (JWT/OAuth)', proficiency: 85 },
      { name: 'WebSockets', proficiency: 75 },
      { name: 'Serverless Functions', proficiency: 80 },
      { name: 'Microservices', proficiency: 70 },
    ],
  },
  {
    name: 'Database',
    slug: 'database',
    icon: Database,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-500/10 dark:bg-orange-900/30',
    skills: [
      { name: 'PostgreSQL', proficiency: 90 },
      { name: 'Supabase', proficiency: 90 },
      { name: 'MongoDB', proficiency: 75 },
      { name: 'Redis', proficiency: 80 },
      { name: 'Prisma ORM', proficiency: 85 },
      { name: 'Drizzle ORM', proficiency: 75 },
      { name: 'Database Design', proficiency: 85 },
      { name: 'Query Optimization', proficiency: 80 },
      { name: 'Migrations', proficiency: 85 },
      { name: 'Vector Databases', proficiency: 60 },
    ],
  },
  {
    name: 'Tools & DevOps',
    slug: 'tools',
    icon: Layers,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10 dark:bg-purple-900/30',
    skills: [
      { name: 'Git/GitHub', proficiency: 95 },
      { name: 'Docker', proficiency: 85 },
      { name: 'Vercel', proficiency: 90 },
      { name: 'AWS', proficiency: 70 },
      { name: 'CI/CD (GitHub Actions)', proficiency: 85 },
      { name: 'Linux/CLI', proficiency: 80 },
      { name: 'VS Code', proficiency: 95 },
      { name: 'Figma', proficiency: 70 },
      { name: 'Postman', proficiency: 85 },
      { name: 'ESLint/Prettier', proficiency: 90 },
    ],
  },
]

const otherSkills = [
  { category: 'Architecture', skills: ['Clean Architecture', 'Domain-Driven Design', 'Event-Driven Architecture', 'CQRS', 'SOLID Principles'] },
  { category: 'Testing', skills: ['Unit Testing', 'Integration Testing', 'E2E Testing (Playwright)', 'TDD', 'Test Coverage'] },
  { category: 'Performance', skills: ['Core Web Vitals', 'Bundle Optimization', 'Caching Strategies', 'Database Indexing', 'CDN Configuration'] },
  { category: 'Security', skills: ['OWASP Top 10', 'Rate Limiting', 'Input Validation', 'CORS/CSRF', 'Security Headers'] },
]

export default function SkillsPage() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              Technical <span className="text-primary-700 dark:text-primary-300">Skills</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              A comprehensive overview of the technologies and tools I work with daily.
              Organized by category for easy reference.
            </p>
          </div>
        </div>
      </section>

      {/* Skill Categories */}
      <section className="section">
        <div className="container-main">
          <div className="space-y-16">
            {skillCategories.map((category, catIndex) => (
              <div key={category.slug} className="animate-in fade-in-0 slide-in-from-top-2" style={{ animationDelay: `${catIndex * 100}ms` }}>
                <div className="flex items-center gap-3 mb-8">
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', category.bg)}>
                    <category.icon className={cn('h-7 w-7', category.color)} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{category.name}</h2>
                    <p className="text-slate-600 dark:text-slate-400">{category.skills.length} technologies</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skill.name}
                      className="card group relative overflow-hidden animate-in fade-in-0"
                      style={{ animationDelay: `${catIndex * 100 + skillIndex * 30}ms` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                          {skill.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {skill.proficiency}%
                        </Badge>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-1000 ease-out', category.bg.replace('/10', '').replace('/30', ''))}
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Skills */}
      <section className="section bg-slate-50 dark:bg-slate-900">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Additional Expertise</h2>
            <p className="section-subtitle">Beyond core technologies — architectural patterns, methodologies, and specialized knowledge.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherSkills.map((item, index) => (
              <Card key={item.category} className="animate-in fade-in-0" style={{ animationDelay: `${index * 100}ms` }}>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">{item.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning */}
      <section className="section">
        <div className="container-main">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Terminal className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Currently Learning</h3>
                  <p className="text-primary-100 mb-4">
                    I'm continuously expanding my skillset. Currently exploring advanced topics in distributed systems,
                    edge computing, and AI-assisted development workflows.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Rust', 'Go', 'Kubernetes', 'WebAssembly', 'Edge Computing', 'AI/ML Integration'].map(skill => (
                      <Badge key={skill} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}