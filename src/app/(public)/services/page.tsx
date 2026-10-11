import { Metadata } from 'next'
import { ArrowRight, CheckCircle, Code, Database, Globe, Layers, Rocket, Server } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { getServices } from '@/services/service.service'
import type { Service } from '@/types'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Professional services offered — Full-stack development, React/Next.js, APIs, databases, and more.',
}

const iconMap: Record<string, typeof Code> = {
  'full-stack': Layers,
  'react': Code,
  'api': Server,
  'database': Database,
  'ui': Globe,
  'performance': Rocket,
}

function getIcon(slug?: string | null) {
  if (!slug) return Layers
  for (const [key, icon] of Object.entries(iconMap)) {
    if (slug.includes(key)) return icon
  }
  return Layers
}

export default async function ServicesPage() {
  const services = await getServices(true)

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="pt-12 bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-600 dark:text-slate-100 mb-6">
              Services <span className="text-primary-700 dark:text-primary-300">I Offer</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Professional development services tailored to your project needs. From concept to production.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section>
        <div className="container-main">
          {services.length === 0 ? (
            <div className="text-center py-16">
              <Layers className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No services available yet</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {services.map((service, index) => {
                  const Icon = getIcon(service.slug)
                  return (
                    <Card key={service.id} className="group hover:shadow-xl transition-shadow animate-in fade-in-0 slide-in-from-top-2" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30 mb-4 group-hover:bg-primary-700 group-hover:text-white transition-colors">
                        <Icon className="h-6 w-6 text-primary-700 dark:text-primary-300 group-hover:text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-100 mb-2">{service.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">{service.short_description}</p>
                      <Link href={`/services/${service.slug}`}>
                        <Button variant="ghost" className="w-full justify-start gap-1">
                          Learn More
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </Card>
                  )
                })}
              </div>

              <div className="text-center">
                <Link href="/contact">
                  <Button size="lg">
                    Discuss Your Project
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Service Details */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container-main">
          {services.map((service, index) => {
            const Icon = getIcon(service.slug)
            return (
              <div key={service.id} className="mb-12 animate-in fade-in-0" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  <div>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">{service.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-600 dark:text-slate-100 mb-4">What&apos;s Included</h4>
                    <ul className="space-y-3">
                      {(service.features || []).map((feature, i) => (
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
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary-700 dark:bg-primary-800">
        <div className="container-main text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">Ready to Start Your Project?</h2>
          <p className="text-primary-100 mb-8 text-base max-w-2xl mx-auto">
            Let&apos;s discuss your requirements and create something amazing together.
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