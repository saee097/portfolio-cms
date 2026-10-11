'use client'

import { useState } from 'react'
import { ArrowRight, Code, ExternalLink, Github, Search, Star, Layers, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import type { Project } from '@/types'

interface ProjectsClientProps {
  initialProjects: Project[]
  categories: string[]
}

export function ProjectsClient({ initialProjects, categories }: ProjectsClientProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewTab, setViewTab] = useState<'all' | 'featured'>('all')

  const filteredProjects = initialProjects.filter(project => {
    // Tab filter
    if (viewTab === 'featured' && !project.featured) return false

    // Category filter
    if (selectedCategory !== 'All' && project.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase()
      const titleMatch = project.title.toLowerCase().includes(q)
      const descMatch = (project.short_description || project.detailed_description || '').toLowerCase().includes(q)
      const techMatch = (project.technologies || []).some(t => t.toLowerCase().includes(q))
      if (!titleMatch && !descMatch && !techMatch) return false
    }

    return true
  })

  return (
    <div className="space-y-12 ">
      {/* Search, Filter & Tabs Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        {/* Top View Selector Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewTab('all')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                viewTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="h-4 w-4" />
              All Projects ({initialProjects.length})
            </button>
            <button
              onClick={() => setViewTab('featured')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                viewTab === 'featured'
                  ? 'bg-white dark:bg-slate-900 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              Featured Spotlight ({initialProjects.filter(p => p.featured).length})
            </button>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Showing <span className="text-slate-600 dark:text-slate-100 font-semibold">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Search & Category Badges */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by title, stack, keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Categories:</span>
            {['All', ...categories].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-primary-700 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <article
              key={project.id}
              className="group card overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800"
            >
              <div>
                {/* Thumbnail / Image preview */}
                <div className="relative aspect-video rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden mb-5 group-hover:scale-[1.02] transition-transform duration-300">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-600/20 to-primary-900/30 flex flex-col items-center justify-center p-4 text-center">
                      <Code className="h-10 w-10 text-primary-600 dark:text-primary-400 mb-2" />
                      <span className="text-xs text-slate-500 font-medium">{project.title}</span>
                    </div>
                  )}

                  {project.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md">
                        <Star className="h-3 w-3 mr-1 fill-white" /> Featured
                      </Badge>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3">
                    <Badge variant="secondary" className="backdrop-blur-md bg-slate-900/80 text-white border-0">
                      {project.category || 'Full-Stack'}
                    </Badge>
                  </div>
                </div>

                <div className="px-1">
                  <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-100 mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {project.short_description || project.detailed_description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {(project.technologies || []).slice(0, 5).map(tech => (
                      <Badge key={tech} variant="outline" className="text-xs py-0.5 bg-slate-50 dark:bg-slate-800/60">
                        {tech}
                      </Badge>
                    ))}
                    {(project.technologies || []).length > 5 && (
                      <Badge variant="outline" className="text-xs py-0.5">
                        +{(project.technologies || []).length - 5}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between px-1">
                <Link
                  href={`/projects/${project.slug || project.id}`}
                  className="text-sm font-semibold text-primary-700 dark:text-primary-300 hover:underline inline-flex items-center gap-1"
                >
                  View Case Study
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <div className="flex items-center gap-3">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-600 dark:hover:text-slate-100 p-1"
                      title="GitHub Repository"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 p-1"
                      title="Live Demo"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center max-w-lg mx-auto">
          <Code className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-100 mb-2">No Projects Found</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
            Try adjusting your search query or selecting a different category filter.
          </p>
          <button
            onClick={() => {
              setSearch('')
              setSelectedCategory('All')
              setViewTab('all')
            }}
            className="text-sm font-semibold text-primary-700 dark:text-primary-300 hover:underline"
          >
            Reset Filters
          </button>
        </Card>
      )}
    </div>
  )
}
