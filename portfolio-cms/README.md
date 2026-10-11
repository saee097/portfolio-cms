# Portfolio CMS - Full-Stack Developer Portfolio

A production-ready, full-stack portfolio CMS built with Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase (PostgreSQL, Auth, Storage), and deployed on Vercel.

## Features

### Public Portfolio Website
- **Home** - Hero, tech stack, featured projects, experience, services, testimonials, CTA
- **About** - Professional background, development approach, journey, stats, goals
- **Skills** - Organized by Frontend, Backend, Database, Tools with proficiency levels
- **Experience** - Timeline with companies, roles, technologies, achievements
- **Education** - Degrees, certifications, continuous learning
- **Services** - 6 service offerings with detailed features and tech stacks
- **Projects** - Filterable grid with categories, search, featured projects
- **Project Details** - Overview, features, architecture, challenges, screenshots, links
- **Blog** - Articles with categories, tags, reading time, pagination
- **Blog Details** - Full content with code blocks, related posts, sharing
- **Contact** - Form with validation, FAQ, social links
- **Resume** - Downloadable PDF, complete professional profile

### Admin Dashboard (`/admin`)
- **Secure Authentication** - Supabase Auth with role-based access (super_admin, admin, editor)
- **Dashboard Overview** - Stats, recent activity, quick actions
- **Projects CRUD** - Create, edit, duplicate, publish, delete with media upload
- **Blog CRUD** - Rich editor, categories, tags, SEO, draft/published
- **Skills Management** - Categories, proficiency, ordering
- **Experience/Education** - Timeline management with drag-and-drop ordering
- **Services** - Toggle publish, reorder, feature management
- **Testimonials** - Client management with ratings
- **Messages** - Contact form submissions with status workflow
- **Media Library** - Upload, organize, manage Supabase Storage files
- **Analytics** - Page views, top pages, events tracking
- **SEO** - Per-page metadata, Open Graph, structured data
- **Settings** - Site configuration, user profile

### Technical Features
- **TypeScript** - Strict typing throughout
- **Server Components** - Default with Client Components only when needed
- **Row Level Security** - Database-level access control
- **Zod Validation** - Form and API input validation
- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Performant form handling
- **TanStack Table** - Powerful data tables with sorting, pagination
- **ESLint + Prettier** - Code quality and formatting

## Quick Start

### Prerequisites
- Node.js 20+
- npm/yarn/pnpm
- Supabase account
- Vercel account (for deployment)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd portfolio-cms
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Create storage buckets in Storage settings:
   - `project-images` (public)
   - `blog-images` (public)
   - `avatars` (public)
   - `documents` (private)
   - `portfolio-assets` (public)
4. Set up Storage policies (see schema.sql comments)
5. Enable Email/Password auth in Authentication settings
6. Create your admin user and update their role in `profiles` table

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Your Name - Portfolio
```

Optional variables:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
CONTACT_EMAIL=your_email@example.com
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Access Admin Dashboard

Navigate to `/admin/login` and sign in with your admin credentials.

## Project Structure

```
portfolio-cms/
├── .env.example              # Environment variable template
├── .env                      # Local environment (not committed)
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── eslint.config.mjs         # ESLint configuration (flat config)
├── postcss.config.mjs        # PostCSS configuration (Tailwind + Autoprefixer)
├── vercel.json               # Vercel deployment configuration
├── package.json
├── package-lock.json
├── README.md
├── public/                   # Static assets (favicon, SVGs)
├── scripts/
│   └── create-admin.js       # Bootstraps the initial super_admin user
├── src/
│   ├── proxy.ts              # Custom Jest/Playwright proxy setup
│   ├── app/                  # Next.js App Router
│   │   ├── (public)/         # Public route group (no auth required)
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx           # Blog list
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx       # Blog post detail
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── education/
│   │   │   │   └── page.tsx
│   │   │   ├── experience/
│   │   │   │   └── page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx           # Project list
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx       # Project detail
│   │   │   ├── resume/
│   │   │   │   └── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx
│   │   │   ├── skills/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── page.tsx              # Home page
│   │   ├── admin/                   # Admin routes (auth required)
│   │   │   ├── components/
│   │   │   │   └── AdminLayout.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── not-found.tsx
│   │   │   ├── page.tsx              # Dashboard overview
│   │   │   ├── login/
│   │   │   │   ├── AdminLoginForm.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── logout/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   ├── seo/
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   ├── messages/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── media/
│   │   │   │   └── page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── skills/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── experience/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── education/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── services/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── testimonials/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   ├── api/                       # API route handlers
│   │   │   ├── contact/
│   │   │   │   └── route.ts
│   │   │   ├── robots/
│   │   │   │   └── route.ts
│   │   │   ├── sitemap/
│   │   │   │   └── route.ts
│   │   │   ├── auth/
│   │   │   │   └── callback/
│   │   │   │       └── route.ts
│   │   │   └── admin/                 # Admin API (server-side, uses service role)
│   │   │       ├── analytics/
│   │   │       │   └── route.ts
│   │   │       ├── blog/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       ├── education/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       ├── experience/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       ├── login/
│   │   │       │   └── route.ts
│   │   │       ├── media/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       ├── messages/
│   │   │       │   ├── route.ts
│   │   │       │   ├── [id]/route.ts
│   │   │       │   └── [id]/status/ route.ts
│   │   │       ├── projects/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       ├── seo/
│   │   │       │   ├── route.ts
│   │   │       │   └── [page]/route.ts
│   │   │       ├── services/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       ├── settings/
│   │   │       │   └── route.ts
│   │   │       ├── skill-categories/
│   │   │       │   ├── route.ts
│   │   │   │     └── [id]/route.ts
│   │   │       ├── skills/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       ├── testimonials/
│   │   ├── globals.css
│   │   ├── layout.tsx              # Root layout
│   │   ├── providers.tsx           # Global providers (theme, toast)
│   │   └── page.tsx                # Not used (public uses (public)/page.tsx)
│   ├── components/
│   │   ├── admin/                  # Admin-specific components
│   │   │   ├── AdminBreadcrumb.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── public/                 # Public-facing components
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ContactForm.tsx
│   │   ├── ResumeDownloadButton.tsx
│   │   └── ui/                     # Reusable UI component library
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── DataTable.tsx
│   │       ├── Dropdown.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Select.tsx
│   │       ├── Skeleton.tsx
│   │       ├── Switch.tsx
│   │       ├── Textarea.tsx
│   │       └── Toast.tsx
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.tsx
│   │   ├── useBlog.ts
│   │   ├── useProjects.ts
│   │   └── useToast.tsx
│   ├── lib/
│   │   ├── utils.ts               # Shared helpers (cn, formatting)
│   │   └── validations.ts         # Zod schemas for forms & API
│   ├── services/                    # Data access layer (Supabase queries/mutations)
│   │   ├── analytics.service.ts
│   │   ├── blog.service.ts
│   │   ├── experience.service.ts
│   │   ├── media.service.ts
│   │   ├── project.service.ts
│   │   ├── service.service.ts
│   │   └── skill.service.ts
│   ├── supabase/                    # Supabase client wrappers
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client (SSR cookies)
│   │   └── admin.ts                # Admin client (service_role)
│   └── types/
│       ├── index.ts                # Shared TypeScript types
│       └── database.ts             # Supabase database types
├── supabase/
│   └── schema.sql                  # Database schema, RLS, triggers, functions
└── .kilo/                          # Kilo CLI command & agent configuration
    ├── commands/
    └── agents/
```

## Database Schema

The `supabase/schema.sql` file contains:
- All tables with proper relationships
- Indexes for performance
- Row Level Security policies
- Triggers for `updated_at` timestamps
- Helper functions (blog view increment, user signup)

## Configuration Files

| File | Purpose |
| --- | --- |
| `next.config.ts` | Next.js config: strict mode, image optimization (Supabase/GitHub avatars), security headers, sitemap/robots rewrites, Server Actions `bodySizeLimit: 2mb` |
| `tailwind.config.ts` | Tailwind content paths (`src/`), custom `primary`/`slate` color palettes, `inter`/`manrope` font families, and motion keyframes (`fade-in`, `slide-up`, `slide-down`, `scale-in`) |
| `tsconfig.json` | Strict TypeScript, `jsx: react-jsx`, bundler resolution, `@/*` → `./src/*` path alias, incremental builds |
| `eslint.config.mjs` | Flat-config ESLint using `eslint-config-next` (core-web-vitals + typescript), ignoring `.next/`, `out/`, `build/`, `next-env.d.ts` |
| `postcss.config.mjs` | PostCSS pipeline: `tailwindcss` + `autoprefixer` |
| `vercel.json` | Vercel deployment: `nextjs` framework, `iad1` region, 30s max duration for API routes, security headers, sitemap/robots rewrites |
| `.env.example` | Environment variable template — copy to `.env.local` before running |

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Your Name - Portfolio
```

Optional variables:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
CONTACT_EMAIL=your_email@example.com
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Or use Vercel CLI
npx vercel
```

### Environment Variables in Vercel

Add all variables from `.env.example` to Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (sensitive - use Vercel's encrypted env)
- `NEXT_PUBLIC_SITE_URL` (your production URL)
- `NEXT_PUBLIC_SITE_NAME`

### Custom Domain

1. Add domain in Vercel project settings
2. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
3. Update Supabase Auth redirect URLs

## Security Considerations

- **Service Role Key** - Never exposed to client, only used in server-side API routes
- **RLS Policies** - All data access controlled at database level
- **Admin Routes** - Protected by middleware + role checks
- **Input Validation** - Zod schemas on all forms and API endpoints
- **File Uploads** - Type/size validation, private buckets for sensitive files
- **Rate Limiting** - Implement via Vercel Edge Functions or Supabase
- **CSRF Protection** - SameSite cookies, Origin headers
- **Content Security Policy** - Configure via Next.js headers

## Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Color contrast ratios (WCAG AA)
- Alt text for images
- Screen reader announcements

## Performance

- Server Components by default
- Image optimization via Next.js Image
- Font optimization with `next/font`
- Code splitting and lazy loading
- Static generation where possible
- ISR for dynamic content
- Database query optimization
- Caching headers

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checking
5. Submit a pull request

## License

MIT License - feel free to use for your own portfolio!

## Support

For issues and questions, please open a GitHub issue.