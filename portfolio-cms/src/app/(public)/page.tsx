import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Code, Database, Globe, Layers, Rocket, Server, Terminal, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Full Stack Developer Portfolio',
  description: 'Full-stack developer specializing in React, Next.js, TypeScript, and modern web technologies.',
}

const stats = [
  { value: '50+', label: 'Projects Completed' },
  { value: '5+', label: 'Years Experience' },
  { value: '30+', label: 'Happy Clients' },
  { value: '100%', label: 'Client Satisfaction' },
]

const techStack = [
  { name: 'React', icon: Code, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Next.js', icon: Terminal, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  { name: 'TypeScript', icon: Code, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  { name: 'Node.js', icon: Server, color: 'text-green-600', bg: 'bg-green-500/10' },
  { name: 'PostgreSQL', icon: Database, color: 'text-blue-700', bg: 'bg-blue-700/10' },
  { name: 'Supabase', icon: Layers, color: 'text-green-500', bg: 'bg-green-500/10' },
  { name: 'Tailwind CSS', icon: Globe, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { name: 'Docker', icon: Layers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
]

const services = [
  {
    title: 'Full-Stack Development',
    description: 'End-to-end web application development from concept to deployment.',
    icon: Layers,
    features: ['Frontend & Backend', 'Database Design', 'API Development', 'DevOps'],
  },
  {
    title: 'React & Next.js Development',
    description: 'Modern React applications with server-side rendering and optimal performance.',
    icon: Code,
    features: ['Server Components', 'App Router', 'TypeScript', 'Testing'],
  },
  {
    title: 'REST API Development',
    description: 'Scalable and secure RESTful APIs with proper documentation.',
    icon: Server,
    features: ['OpenAPI/Swagger', 'Authentication', 'Rate Limiting', 'Validation'],
  },
  {
    title: 'Database Integration',
    description: 'Database design, optimization, and migration services.',
    icon: Database,
    features: ['PostgreSQL', 'Supabase', 'Prisma ORM', 'Performance Tuning'],
  },
  {
    title: 'Responsive UI Development',
    description: 'Pixel-perfect, accessible interfaces that work on all devices.',
    icon: Globe,
    features: ['Tailwind CSS', 'Mobile-First', 'Accessibility', 'Cross-Browser'],
  },
  {
    title: 'Performance Optimization',
    description: 'Improve load times, Core Web Vitals, and user experience.',
    icon: Rocket,
    features: ['Code Splitting', 'Caching', 'Image Optimization', 'Bundle Analysis'],
  },
]

const featuredProjects = [
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
    image: '/projects/ecommerce.jpg',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    category: 'Full-Stack',
  },
  {
    title: 'Task Management App',
    description: 'Collaborative task management with real-time updates, teams, and project analytics.',
    image: '/projects/taskmanager.jpg',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    category: 'SaaS',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Real-time analytics dashboard with customizable widgets and data visualization.',
    image: '/projects/analytics.jpg',
    technologies: ['Next.js', 'TypeScript', 'Recharts', 'PostgreSQL'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    category: 'Dashboard',
  },
]

const experiences = [
  {
    title: 'Senior Full Stack Developer',
    company: 'Tech Company Inc.',
    location: 'San Francisco, CA',
    period: '2022 - Present',
    description: 'Leading development of scalable web applications using React, Next.js, and Node.js.',
    technologies: ['React', 'Next.js', 'TypeScript', 'PostgreSQL', 'AWS'],
  },
  {
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    period: '2020 - 2022',
    description: 'Built and maintained multiple client projects from concept to production.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Docker'],
  },
  {
    title: 'Junior Web Developer',
    company: 'Digital Agency',
    location: 'Remote',
    period: '2019 - 2020',
    description: 'Developed responsive websites and web applications for various clients.',
    technologies: ['JavaScript', 'Vue.js', 'PHP', 'MySQL', 'WordPress'],
  },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    position: 'CTO',
    company: 'TechStart Inc.',
    message: 'Exceptional developer who delivers high-quality code on time. Great communication and problem-solving skills.',
    rating: 5,
    avatar: '/avatars/sarah.jpg',
  },
  {
    name: 'Michael Chen',
    position: 'Product Manager',
    company: 'InnovateLabs',
    message: 'Working with this developer was a pleasure. They understood our requirements perfectly and exceeded expectations.',
    rating: 5,
    avatar: '/avatars/michael.jpg',
  },
  {
    name: 'Emily Rodriguez',
    position: 'Founder',
    company: 'CreativeStudio',
    message: 'Outstanding technical skills and attention to detail. The project was delivered ahead of schedule with great quality.',
    rating: 5,
    avatar: '/avatars/emily.jpg',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container-main relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 animate-in fade-in-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                </span>
                Available for freelance projects
              </span>
            </div>
            <h1 className="mb-6 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Building <span className="text-primary-700 dark:text-primary-300">Digital Experiences</span> That Matter
            </h1>
            <p className="mb-10 text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Full-stack developer crafting scalable web applications with modern technologies.
              Specialized in React, Next.js, TypeScript, and cloud-native architectures.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="w-full sm:w-auto">
                  Start a Project
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View My Work
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center animate-in fade-in-0 zoom-in-95" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl sm:text-5xl font-bold text-primary-700 dark:text-primary-300">{stat.value}</div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-200/30 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary-300/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* Technology Stack */}
      <section className="section bg-white dark:bg-slate-950">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Technology Stack</h2>
            <p className="section-subtitle">Modern tools and frameworks I use to build robust, scalable applications.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {techStack.map((tech, index) => (
              <div
                key={tech.name}
                className="group card text-center animate-in fade-in-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn('mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl', tech.bg)}>
                  <tech.icon className={cn('h-7 w-7', tech.color)} />
                </div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  {tech.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section bg-slate-50 dark:bg-slate-900">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
            <div>
              <h2 className="section-title">Featured Projects</h2>
              <p className="section-subtitle">A selection of my recent work showcasing various technologies and domains.</p>
            </div>
            <Link href="/projects" className="mt-4 sm:mt-0">
              <Button variant="outline">
                View All Projects
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <article key={project.title} className="card group animate-in fade-in-0 slide-in-from-top-2" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="aspect-video rounded-lg bg-slate-100 dark:bg-slate-800 mb-4 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    Project Image
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-primary-700 bg-primary-100 px-2 py-0.5 rounded dark:bg-primary-900/30 dark:text-primary-300">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 4).map(tech => (
                    <span key={tech} className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300 flex items-center gap-1">
                      Code
                    </Link>
                  )}
                  {project.liveUrl && (
                    <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-300 flex items-center gap-1">
                      Live Demo
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="section bg-white dark:bg-slate-950">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Experience</h2>
            <p className="section-subtitle">My professional journey building software solutions.</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div key={exp.title} className="relative pl-20 animate-in fade-in-0 slide-in-from-top-2" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-primary-600 border-4 border-white dark:border-slate-950 z-10" />
                  <div className="card">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-primary-700 bg-primary-100 px-2 py-0.5 rounded dark:bg-primary-900/30 dark:text-primary-300">
                        {exp.period}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{exp.location}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{exp.title}</h3>
                    <p className="text-lg text-primary-700 dark:text-primary-300 font-medium mb-3">{exp.company}</p>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map(tech => (
                        <span key={tech} className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-slate-50 dark:bg-slate-900">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Services</h2>
            <p className="section-subtitle">What I can help you with — from concept to production-ready applications.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={service.title} className="card group animate-in fade-in-0" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
                  <service.icon className="h-6 w-6 text-primary-700 dark:text-primary-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{service.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle className="h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Activity / CTA */}
      <section className="section bg-primary-700 dark:bg-primary-800">
        <div className="container-main">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Let's Build Something Great Together</h2>
            <p className="text-primary-100 mb-8 text-lg">I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-primary-700 hover:bg-primary-50">
                  Get In Touch
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/resume">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-primary-600">
                  Download Resume
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-white dark:bg-slate-950">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Testimonials</h2>
            <p className="section-subtitle">What clients and colleagues have to say about working with me.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.name} className="card animate-in fade-in-0" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center gap-2 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6 italic">"{testimonial.message}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-medium">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{testimonial.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.position}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}