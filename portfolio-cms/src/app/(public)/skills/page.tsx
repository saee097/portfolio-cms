import { Metadata } from 'next'
import { Code, Database, Globe, Layers, Server, Terminal } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { getSkillsByCategory } from '@/services/skill.service'

export const metadata: Metadata = {
  title: 'Skills',
  description: 'Technical skills organized by category — Frontend, Backend, Database, and Tools.',
}

const categoryIcons: Record<string, typeof Code> = {
  frontend: Code,
  backend: Server,
  database: Database,
  tools: Layers,
}

const categoryColors: Record<string, string> = {
  frontend: 'text-blue-600 dark:text-blue-400',
  backend: 'text-green-600 dark:text-green-400',
  database: 'text-orange-600 dark:text-orange-400',
  tools: 'text-purple-600 dark:text-purple-400',
}

const categoryBg: Record<string, string> = {
  frontend: 'bg-blue-500/10 dark:bg-blue-900/30',
  backend: 'bg-green-500/10 dark:bg-green-900/30',
  database: 'bg-orange-500/10 dark:bg-orange-900/30',
  tools: 'bg-purple-500/10 dark:bg-purple-900/30',
}

const otherSkills = [
  { category: 'Architecture', skills: ['Clean Architecture', 'Domain-Driven Design', 'Event-Driven Architecture', 'CQRS', 'SOLID Principles'] },
  { category: 'Testing', skills: ['Unit Testing', 'Integration Testing', 'E2E Testing (Playwright)', 'TDD', 'Test Coverage'] },
  { category: 'Performance', skills: ['Core Web Vitals', 'Bundle Optimization', 'Caching Strategies', 'Database Indexing', 'CDN Configuration'] },
  { category: 'Security', skills: ['OWASP Top 10', 'Rate Limiting', 'Input Validation', 'CORS/CSRF', 'Security Headers'] },
]

export default async function SkillsPage() {
  const skillsByCategory = await getSkillsByCategory()
  const categoryNames = Object.keys(skillsByCategory)

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
          {categoryNames.length === 0 ? (
            <div className="text-center py-16">
              <Code className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No skills added yet</p>
            </div>
          ) : (
            <div className="space-y-16">
              {categoryNames.map((categoryName, catIndex) => {
                const slug = categoryName.toLowerCase().replace(/\s+/g, '-')
                const Icon = categoryIcons[slug] || Code
                const color = categoryColors[slug] || 'text-slate-600 dark:text-slate-400'
                const bg = categoryBg[slug] || 'bg-slate-500/10 dark:bg-slate-900/30'
                const skills = skillsByCategory[categoryName]

                return (
                  <div key={categoryName} className="animate-in fade-in-0 slide-in-from-top-2" style={{ animationDelay: `${catIndex * 100}ms` }}>
                    <div className="flex items-center gap-3 mb-8">
                      <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', bg)}>
                        <Icon className={cn('h-7 w-7', color)} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{categoryName}</h2>
                        <p className="text-slate-600 dark:text-slate-400">{skills.length} technologies</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {skills.map((skill, skillIndex) => (
                        <div
                          key={skill.id}
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
                              className={cn('h-full rounded-full transition-all duration-1000 ease-out', bg.replace('/10', '').replace('/30', ''))}
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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
                    I&apos;m continuously expanding my skillset. Currently exploring advanced topics in distributed systems,
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