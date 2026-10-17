import Link from 'next/link'
import { Github, Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/saee097', icon: Github },
  { name: 'LinkedIn', href: 'www.linkedin.com/in/saeed-ur-rahman-dev', icon: Linkedin },
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { name: 'Email', href: 'mailto:saeedsaeed7745@gmail.com', icon: Mail },
]

const footerNavigation = {
  'Quick Links': [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  'Resources': [
    { name: 'Skills', href: '/skills' },
    { name: 'Experience', href: '/experience' },
    { name: 'Education', href: '/education' },
    { name: 'Services', href: '/services' }
  ],
  'Legal': [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
}

export function Footer() {
  return (
    <footer className="mt-12 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:pb-6  lg:pt-12">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" aria-label="Go to homepage" className="inline-flex">
              <img
                src="/codespare-logo.png"
                alt="CodeSpare Logo"
                className="h-20 w-auto max-w-[240px] cursor-pointer"
              />
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-xs">
              Full-stack developer passionate about building scalable web applications with modern technologies.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors',
                    'flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800'
                  )}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                  <ExternalLink className="sr-only" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-100">Quick Links</h3>
                <ul className="mt-4 space-y-3">
                  {footerNavigation['Quick Links'].map(link => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-100">Resources</h3>
                <ul className="mt-4 space-y-3">
                  {footerNavigation['Resources'].map(link => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-100">Legal</h3>
                <ul className="mt-4 space-y-3">
                  {footerNavigation['Legal'].map(link => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
              
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            © {new Date().getFullYear()} CodeSpare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}