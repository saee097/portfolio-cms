'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'

interface Technology {
  name: string
  category: 'web' | 'mobile' | 'ai'
  logo: string
  alt: string
}

interface Category {
  id: 'web' | 'mobile' | 'ai'
  label: string
}

const CATEGORIES: Category[] = [
  { id: 'web', label: 'Web Development' },
  { id: 'mobile', label: 'Mobile App Development' },
  { id: 'ai', label: 'Artificial Intelligence' },
]

const TECHNOLOGIES: Technology[] = [
  // Web Development
  { name: 'TypeScript', category: 'web', logo: 'https://www.eyratech.com/_next/static/media/typescript.4e0e6c2e.svg', alt: 'TypeScript logo' },
  { name: 'React.js', category: 'web', logo: 'https://www.eyratech.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Freact.40f32d98.png&w=96&q=75', alt: 'React.js logo' },
  { name: 'Next.js', category: 'web', logo: 'https://i.postimg.cc/GpHY9rdt/Glossy-Futuristic-NEXT-js-Wordmark.png', alt: 'Next.js logo' },
  { name: 'Node.js', category: 'web', logo: 'https://www.eyratech.com/_next/static/media/nodejs.55550675.svg', alt: 'Node.js logo' },
  { name: 'Tailwind CSS', category: 'web', logo: 'https://www.eyratech.com/_next/static/media/tailwindcss.6777416a.svg', alt: 'Tailwind CSS logo' },
  { name: 'NestJS', category: 'web', logo: 'https://www.eyratech.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fnestjs.461eb036.png&w=96&q=75', alt: 'NestJS logo' },
  { name: 'Express.js', category: 'web', logo: 'https://www.eyratech.com/_next/static/media/expressjs.34b872b8.svg', alt: 'Express.js logo' },
  { name: 'Python', category: 'web', logo: 'https://www.eyratech.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpython.d9a25f72.png&w=96&q=75', alt: 'Python logo' },
  { name: 'Django', category: 'web', logo: 'https://i.postimg.cc/NGVn0ft5/Glossy-Blue-3D-DJ-Monogram-removebg-preview.png', alt: 'Django logo' },
  { name: 'MongoDB', category: 'web', logo: 'https://www.eyratech.com/_next/static/media/mongodb.859f56f4.svg', alt: 'MongoDB logo' },
  { name: 'PostgreSQL', category: 'web', logo: 'https://www.eyratech.com/_next/static/media/postgress.e3b146ec.svg', alt: 'PostgreSQL logo' },
  { name: 'MySQL', category: 'web', logo: 'https://www.eyratech.com/_next/static/media/mysql.6cc200fb.svg', alt: 'MySQL logo' },
  { name: 'Redis', category: 'web', logo: 'https://www.eyratech.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fredis.b36425ab.png&w=96&q=75', alt: 'Redis logo' },
  { name: 'Supabase', category: 'web', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original-wordmark.svg', alt: 'Supabase logo' },
  { name: 'Docker', category: 'web', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', alt: 'Docker logo' },

  // Mobile App Development
  { name: 'React Native', category: 'mobile', logo: 'https://www.eyratech.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Freact.40f32d98.png&w=96&q=75', alt: 'React Native logo' },
  { name: 'Android', category: 'mobile', logo: 'https://www.eyratech.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fandroid.071506c9.png&w=96&q=75', alt: 'Android logo' },
  { name: 'Java', category: 'mobile', logo: 'https://i.postimg.cc/PrpMVmB1/Black-White-Minimalist-Professional-Initial-Logo-(1).jpg', alt: 'Java logo' },
  { name: 'Kotlin', category: 'mobile', logo: 'https://www.eyratech.com/_next/static/media/kotlin.6e9ae55e.svg', alt: 'Kotlin logo' },

  // Artificial Intelligence
  { name: 'Python', category: 'ai', logo: 'https://www.eyratech.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpython.d9a25f72.png&w=96&q=75', alt: 'Python logo' },
  { name: 'FastAPI', category: 'ai', logo: 'https://i.postimg.cc/1XSW146k/fast-api-removebg-preview.png', alt: 'FastAPI logo' },
  { name: 'OpenAI', category: 'ai', logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg', alt: 'OpenAI logo' },
  { name: 'DeepSeek', category: 'ai', logo: 'https://i.postimg.cc/BQVxxXbT/deepseek-removebg-preview.png', alt: 'DeepSeek logo' },
  { name: 'Gemini', category: 'ai', logo: 'https://www.eyratech.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgemini.c62b828b.png&w=96&q=75', alt: 'Gemini logo' },
]

const categoryColors = {
  web: { ring: 'focus-visible:ring-blue-500' },
  mobile: { ring: 'focus-visible:ring-purple-500' },
  ai: { ring: 'focus-visible:ring-rose-500' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

export function TechnologyStack() {
  const [activeCategory, setActiveCategory] = useState<'web' | 'mobile' | 'ai'>('web')
  const reducedMotion = useReducedMotion()

  const visibleTechnologies = useMemo(
    () => TECHNOLOGIES.filter((tech) => tech.category === activeCategory),
    [activeCategory],
  )

  const handleCategoryChange = useCallback((id: 'web' | 'mobile' | 'ai') => {
    setActiveCategory(id)
  }, [])

  const isActive = (id: 'web' | 'mobile' | 'ai') => activeCategory === id

  return (
    <section className="bg-white dark:bg-slate-950 py-14">
      <div className="container-main">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="section-title">Technology Stack</h2>
          <p className="section-subtitle">Modern tools and frameworks I use to build robust, scalable applications.</p>
        </div>

        {/* Category buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {CATEGORIES.map((category) => {
            const active = isActive(category.id)
            const color = categoryColors[category.id]
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                aria-pressed={active}
                aria-label={category.label}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-in-out',
                  active
                    ? 'bg-primary-700 text-white   ring-primary-700/30'
                    : 'bg-slate-100 text-slate-600  dark:bg-slate-800 dark:text-slate-300  ',
                  !active && 'dark:border-slate-700/50',
                  'focus-visible:outline-none',
                  color.ring,
                )}
              >
                {category.label}
              </button>
            )
          })}
        </div>

        {/* Technology grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={false}
            animate="show"
            variants={containerVariants}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
          >
            {visibleTechnologies.map((tech) => (
              <motion.div
                key={`${tech.category}-${tech.name}`}
                initial={reducedMotion ? false : 'hidden'}
                animate="show"
                exit={reducedMotion ? false : 'hidden'}
                variants={itemVariants}
                className="card  text-center group hover:border-primary-500/50 dark:hover:border-primary-500/20 transition-all duration-300"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800  transition-colors duration-300 ">
                  <img
                    src={tech.logo}
                    alt={tech.alt}
                    width="40"
                    height="40"
                    className="h-16 w-16 object-contain mx-auto filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = target.parentElement?.querySelector('[data-logo-fallback]')
                      if (fallback) fallback.classList.remove('hidden')
                    }}
                  />
                  <div
                    data-logo-fallback
                    className="hidden h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold text-slate-400 dark:text-slate-500"
                  >
                    {tech.name.charAt(0)}
                  </div>
                </div>
                <h3 className="font-medium text-slate-600 dark:text-slate-100 text-sm leading-tight group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  {tech.name}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
