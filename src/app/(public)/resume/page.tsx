import { Metadata } from 'next'
import { Award, Briefcase, Building2, Calendar, Code, Database, Download, ExternalLink, GraduationCap, Layers, Mail, MapPin, Phone, Server, Star, Trophy } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ResumeDownloadButton } from '@/components/ResumeDownloadButton'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Download my resume or view my professional experience, education, and skills.',
}

const resumeData = {
  name: 'John Developer',
  title: 'Senior Full Stack Developer',
  email: 'john.developer@email.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  website: 'https://johndeveloper.dev',
  github: 'https://github.com/johndeveloper',
  linkedin: 'https://linkedin.com/in/johndeveloper',
  summary: 'Senior Full Stack Developer with 5+ years of experience building scalable web applications using React, Next.js, TypeScript, and modern cloud technologies. Proven track record of delivering high-quality software solutions for startups and enterprise clients. Passionate about clean architecture, performance optimization, and developer experience.',
  experience: [
    {
      title: 'Senior Full Stack Developer',
      company: 'Tech Company Inc.',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: 'Present',
      current: true,
      description: [
        'Led architecture decisions for scalable web applications serving 100K+ users',
        'Implemented micro-frontend architecture improving deployment frequency by 300%',
        'Mentored 5+ junior developers and established coding standards',
        'Reduced API response times by 60% through query optimization and caching',
        'Built CI/CD pipelines with automated testing and deployment to AWS',
      ],
      technologies: ['React', 'Next.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Jest', 'Redis'],
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'New York, NY',
      startDate: '2020-06',
      endDate: '2022-02',
      current: false,
      description: [
        'Built and maintained multiple client projects from concept to production',
        'Developed real-time collaboration platform with WebSocket connections serving 10K+ concurrent users',
        'Implemented payment integration with Stripe and built comprehensive admin dashboards',
        'Designed and optimized database schemas for high-traffic applications',
        'Collaborated with design team to implement pixel-perfect responsive UIs',
      ],
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Stripe', 'Redis', 'Docker', 'TypeScript'],
    },
    {
      title: 'Junior Web Developer',
      company: 'Digital Agency',
      location: 'Remote',
      startDate: '2019-01',
      endDate: '2020-05',
      current: false,
      description: [
        'Developed responsive websites and web applications for diverse clients',
        'Built custom WordPress themes and plugins for content-driven sites',
        'Implemented RESTful APIs and integrated third-party services',
        'Learned modern JavaScript frameworks and backend development practices',
        'Participated in code reviews and agile development processes',
      ],
      technologies: ['JavaScript', 'Vue.js', 'PHP', 'MySQL', 'WordPress', 'HTML/CSS', 'Git', 'REST APIs'],
    },
  ],
  education: [
    {
      degree: 'Master of Science in Computer Science',
      institution: 'Stanford University',
      location: 'Stanford, CA',
      startDate: '2017-09',
      endDate: '2019-06',
      description: 'Specialized in Distributed Systems and Machine Learning. Thesis: "Optimizing Microservice Communication Patterns for Low-Latency Applications". GPA: 3.9/4.0.',
      achievements: ['Dean\'s List (All Semesters)', 'Research Assistant - Distributed Systems Lab', 'Teaching Assistant - Data Structures & Algorithms', 'Published paper at ICSE 2019'],
    },
    {
      degree: 'Bachelor of Science in Computer Engineering',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2013-09',
      endDate: '2017-06',
      description: 'Focus on Software Engineering and Embedded Systems. Capstone Project: "Real-time IoT Monitoring Platform for Smart Agriculture". GPA: 3.8/4.0.',
      achievements: ['Graduated with Honors', 'ACM Student Chapter President', 'Hackathon Winner (3x)', 'Google Summer of Code Participant'],
    },
  ],
  certifications: [
    { name: 'AWS Certified Solutions Architect - Professional', issuer: 'Amazon Web Services', date: '2023-03', credentialId: 'AWS-SA-PRO-123456' },
    { name: 'Google Cloud Professional Cloud Architect', issuer: 'Google Cloud', date: '2022-11', credentialId: 'GCP-PCA-789012' },
    { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'Cloud Native Computing Foundation', date: '2022-08', credentialId: 'CKA-345678' },
  ],
  skills: {
    frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js', 'HTML5/CSS3', 'Framer Motion', 'React Query', 'Zustand', 'Testing (Jest/Vitest)'],
    backend: ['Node.js', 'Express.js', 'NestJS', 'Python', 'REST APIs', 'GraphQL', 'Authentication (JWT/OAuth)', 'WebSockets', 'Serverless Functions', 'Microservices'],
    database: ['PostgreSQL', 'Supabase', 'MongoDB', 'Redis', 'Prisma ORM', 'Drizzle ORM', 'Database Design', 'Query Optimization', 'Migrations', 'Vector Databases'],
    devops: ['Git/GitHub', 'Docker', 'Vercel', 'AWS', 'CI/CD (GitHub Actions)', 'Linux/CLI', 'VS Code', 'Figma', 'Postman', 'ESLint/Prettier'],
  },
  projects: [
    {
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
      technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
      url: 'https://github.com/johndeveloper/ecommerce',
    },
    {
      name: 'Task Management App',
      description: 'Collaborative task management with real-time updates, teams, and project analytics.',
      technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      url: 'https://github.com/johndeveloper/taskmanager',
    },
    {
      name: 'Analytics Dashboard',
      description: 'Real-time analytics dashboard with customizable widgets and data visualization.',
      technologies: ['Next.js', 'TypeScript', 'Recharts', 'PostgreSQL'],
      url: 'https://github.com/johndeveloper/analytics',
    },
  ],
}

export default function ResumePage() {
  const handleDownload = () => {
    // In a real app, this would generate a PDF
    alert('Resume download would generate a PDF here. In production, use a library like @react-pdf/renderer or puppeteer.')
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="pt-12 bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-600 dark:text-slate-100 mb-4">
                  Resume
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Professional experience, education, and skills overview.
                </p>
              </div>
              <ResumeDownloadButton />
            </div>
          </div>
        </div>
      </section>

      {/* Header Info */}
      <section>
        <div className="container-main">
          <Card className="bg-primary-700 dark:bg-primary-800 text-white">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-3xl font-semibold mb-2">{resumeData.name}</h2>
                <p className="text-xl text-primary-100 mb-4">{resumeData.title}</p>
                <div className="flex flex-wrap gap-6 text-sm text-primary-100">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4" />{resumeData.email}</div>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4" />{resumeData.phone}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{resumeData.location}</div>
                  <div className="flex items-center gap-2"><ExternalLink className="h-4 w-4" /><a href={resumeData.website} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">{resumeData.website}</a></div>
                </div>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-3">Links</h3>
                <div className="space-y-2 text-sm">
                  <a href={resumeData.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-100 hover:underline">GitHub</a>
                  <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-100 hover:underline">LinkedIn</a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Summary */}
      <section >
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-6">Professional Summary</h2>
            <Card>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{resumeData.summary}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-6 flex items-center gap-3">
              <Briefcase className="h-7 w-7 text-primary-700 dark:text-primary-300" />
              Professional Experience
            </h2>
            <div className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <Card key={exp.title} className="group hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-100">{exp.title}</h3>
                      <p className="text-lg text-primary-700 dark:text-primary-300 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="h-4 w-4 inline mr-1" /> {exp.location}
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                        <Star className="h-4 w-4 text-primary-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map(tech => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section>
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-6 flex items-center gap-3">
              <GraduationCap className="h-7 w-7 text-primary-700 dark:text-primary-300" />
              Education
            </h2>
            <div className="space-y-6">
              {resumeData.education.map((edu, index) => (
                <Card key={edu.degree} className="group hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-100">{edu.degree}</h3>
                      <p className="text-lg text-primary-700 dark:text-primary-300 font-medium">{edu.institution}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate!)}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="h-4 w-4 inline mr-1" /> {edu.location}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{edu.description}</p>
                  {edu.achievements.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {edu.achievements.map((achievement, i) => (
                        <Badge key={i} variant="outline"><Trophy className="h-3 w-3 mr-1" /> {achievement}</Badge>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-6 flex items-center gap-3">
              <Award className="h-7 w-7 text-primary-700 dark:text-primary-300" />
              Certifications
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumeData.certifications.map((cert, index) => (
                <Card key={cert.name} className="group hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                      <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-slate-600 dark:text-slate-100">{cert.name}</h3>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{cert.issuer}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    <Calendar className="h-3.5 w-3.5 inline mr-1" /> {formatDate(cert.date)}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{cert.credentialId}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section>
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-6 flex items-center gap-3">
              <Code className="h-7 w-7 text-primary-700 dark:text-primary-300" />
              Technical Skills
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <h3 className="font-semibold text-slate-600 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-600" /> Frontend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.frontend.map(skill => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="font-semibold text-slate-600 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Server className="h-5 w-5 text-green-600" /> Backend
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.backend.map(skill => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="font-semibold text-slate-600 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5 text-orange-600" /> Database
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.database.map(skill => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </Card>
              <Card>
                <h3 className="font-semibold text-slate-600 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-600" /> DevOps & Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.devops.map(skill => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-6 flex items-center gap-3">
              <Building2 className="h-7 w-7 text-primary-700 dark:text-primary-300" />
              Selected Projects
            </h2>
            <div className="space-y-4">
              {resumeData.projects.map((project, index) => (
                <Card key={project.name} className="group hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-600 dark:text-slate-100">{project.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.technologies.map(tech => (
                          <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary-700 dark:text-primary-300 hover:underline">
                      <ExternalLink className="h-4 w-4" />
                      View Code
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}