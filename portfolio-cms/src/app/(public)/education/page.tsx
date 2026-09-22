import { Metadata } from 'next'
import { Award, BookOpen, Building2, Calendar, Code, GraduationCap, MapPin, Star } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Education',
  description: 'Academic background and educational achievements.',
}

const education = [
  {
    id: '1',
    degree: 'Master of Science in Computer Science',
    institution: 'Stanford University',
    location: 'Stanford, CA',
    description: 'Specialized in Distributed Systems and Machine Learning. Thesis: "Optimizing Microservice Communication Patterns for Low-Latency Applications". GPA: 3.9/4.0. Relevant coursework: Advanced Algorithms, Distributed Systems, Machine Learning, Computer Networks, Database Systems.',
    startDate: '2017-09-01',
    endDate: '2019-06-15',
    current: false,
    achievements: [
      'Dean\'s List (All Semesters)',
      'Research Assistant - Distributed Systems Lab',
      'Teaching Assistant - Data Structures & Algorithms',
      'Published paper at ICSE 2019',
    ],
  },
  {
    id: '2',
    degree: 'Bachelor of Science in Computer Engineering',
    institution: 'University of California, Berkeley',
    location: 'Berkeley, CA',
    description: 'Focus on Software Engineering and Embedded Systems. Capstone Project: "Real-time IoT Monitoring Platform for Smart Agriculture". GPA: 3.8/4.0. Relevant coursework: Software Engineering, Operating Systems, Computer Architecture, Digital Design, Signals & Systems.',
    startDate: '2013-09-01',
    endDate: '2017-06-15',
    current: false,
    achievements: [
      'Graduated with Honors',
      'ACM Student Chapter President',
      'Hackathon Winner (3x)',
      'Google Summer of Code Participant',
    ],
  },
  {
    id: '3',
    degree: 'AWS Certified Solutions Architect - Professional',
    institution: 'Amazon Web Services',
    location: 'Online',
    description: 'Advanced certification validating expertise in designing distributed systems on AWS. Covers migration strategies, cost optimization, security, and hybrid architectures.',
    startDate: '2023-03-01',
    endDate: '2023-03-15',
    current: false,
    achievements: ['Score: 920/1000'],
  },
  {
    id: '4',
    degree: 'Google Cloud Professional Cloud Architect',
    institution: 'Google Cloud',
    location: 'Online',
    description: 'Professional certification demonstrating ability to design, develop, and manage robust, secure, scalable, highly available, and dynamic solutions on Google Cloud.',
    startDate: '2022-11-01',
    endDate: '2022-11-20',
    current: false,
    achievements: [],
  },
  {
    id: '5',
    degree: 'Certified Kubernetes Administrator (CKA)',
    institution: 'Cloud Native Computing Foundation',
    location: 'Online',
    description: 'Performance-based certification validating skills to deploy, manage, and troubleshoot Kubernetes clusters.',
    startDate: '2022-08-01',
    endDate: '2022-08-15',
    current: false,
    achievements: [],
  },
]

export default function EducationPage() {
  const degrees = education.filter(e => e.degree.includes('Bachelor') || e.degree.includes('Master'))
  const certifications = education.filter(e => !e.degree.includes('Bachelor') && !e.degree.includes('Master'))

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">
              Education & <span className="text-primary-700 dark:text-primary-300">Certifications</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Academic foundation and continuous learning through professional certifications.
            </p>
          </div>
        </div>
      </section>

      {/* Degrees */}
      <section className="section">
        <div className="container-main">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <GraduationCap className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="section-title mb-0">Academic Degrees</h2>
          </div>
          <div className="space-y-8">
            {degrees.map((edu, index) => (
              <Card key={edu.id} className="group hover:shadow-lg transition-shadow animate-in fade-in-0 slide-in-from-top-2" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-primary-700 bg-primary-100 px-3 py-1 rounded-full dark:bg-primary-900/30 dark:text-primary-300">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate!)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{edu.degree}</h3>
                    <p className="text-xl text-primary-700 dark:text-primary-300 font-medium mb-2">{edu.institution}</p>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{edu.location}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{edu.description}</p>
                    {edu.achievements.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {edu.achievements.map((achievement, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <div className="aspect-square w-48 md:w-64 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700">
                      Campus Image
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section bg-slate-50 dark:bg-slate-900">
        <div className="container-main">
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
              <Award className="h-7 w-7 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="section-title mb-0">Professional Certifications</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <Card key={cert.id} className="group hover:shadow-lg transition-shadow animate-in fade-in-0" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                    <Award className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{cert.degree}</h3>
                    <p className="text-primary-700 dark:text-primary-300 font-medium mb-2">{cert.institution}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(cert.startDate)}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{cert.description}</p>
                    {cert.achievements.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {cert.achievements.map((achievement, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Continuous Learning */}
      <section className="section">
        <div className="container-main">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Continuous Learning</h2>
            <p className="section-subtitle">Currently expanding knowledge in emerging technologies and advanced concepts.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 mx-auto mb-4">
                <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 text-center mb-2">Systems Programming</h3>
              <p className="text-slate-600 dark:text-slate-400 text-center text-sm">Rust, Go, WebAssembly, eBPF</p>
            </Card>
            <Card>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30 mx-auto mb-4">
                <Building2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 text-center mb-2">Cloud Native</h3>
              <p className="text-slate-600 dark:text-slate-400 text-center text-sm">Kubernetes, Service Mesh, Observability</p>
            </Card>
            <Card>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-900/30 mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 text-center mb-2">AI/ML Engineering</h3>
              <p className="text-slate-600 dark:text-slate-400 text-center text-sm">LLM Integration, Vector DBs, MLOps</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}