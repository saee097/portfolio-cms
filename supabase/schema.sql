-- Portfolio CMS Database Schema
-- Idempotent: safe to re-run in the Supabase SQL Editor.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    role TEXT CHECK (role IN ('super_admin', 'admin', 'editor')) DEFAULT 'editor',
    bio TEXT,
    title TEXT,
    location TEXT,
    website TEXT,
    github TEXT,
    linkedin TEXT,
    twitter TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    detailed_description TEXT,
    thumbnail_url TEXT,
    technologies TEXT[] DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    category TEXT,
    client TEXT,
    start_date DATE,
    end_date DATE,
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Project images table
CREATE TABLE IF NOT EXISTS project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    alt TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill categories table
CREATE TABLE IF NOT EXISTS skill_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon TEXT,
    proficiency INTEGER DEFAULT 50 CHECK (proficiency >= 0 AND proficiency <= 100),
    category_id UUID REFERENCES skill_categories(id) ON DELETE SET NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    description TEXT,
    technologies TEXT[] DEFAULT '{}',
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    degree TEXT NOT NULL,
    institution TEXT NOT NULL,
    location TEXT,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    icon TEXT,
    features TEXT[] DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog tags table
CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    cover_image_url TEXT,
    category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ,
    reading_time INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog post tags junction table
CREATE TABLE IF NOT EXISTS blog_post_tags (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
    tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (post_id, tag_id)
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    position TEXT NOT NULL,
    company TEXT,
    avatar_url TEXT,
    message TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    published BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    company TEXT,
    topic TEXT,
    budget TEXT,
    timeline TEXT,
    status TEXT CHECK (status IN ('new', 'read', 'replied', 'archived')) DEFAULT 'new',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    mime_type TEXT,
    size INTEGER,
    bucket TEXT,
    path TEXT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO settings table
CREATE TABLE IF NOT EXISTS seo_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page TEXT NOT NULL UNIQUE,
    title TEXT,
    description TEXT,
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    twitter_card TEXT,
    twitter_title TEXT,
    twitter_description TEXT,
    twitter_image TEXT,
    canonical_url TEXT,
    structured_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name TEXT NOT NULL,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_hash TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrichment for older contact_messages tables (no-op when columns already exist)
ALTER TABLE contact_messages
    ADD COLUMN IF NOT EXISTS company TEXT,
    ADD COLUMN IF NOT EXISTS topic TEXT,
    ADD COLUMN IF NOT EXISTS budget TEXT,
    ADD COLUMN IF NOT EXISTS timeline TEXT;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_skills_category_id ON skills(category_id);
CREATE INDEX IF NOT EXISTS idx_experiences_start_date ON experiences(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_education_start_date ON education(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_post_id ON blog_post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(published);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_ip_created ON contact_messages(ip_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_topic ON contact_messages(topic);
CREATE INDEX IF NOT EXISTS idx_media_bucket ON media(bucket);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Role lookup helper. SECURITY DEFINER avoids infinite recursion on profiles policies.
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
    SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Public read policies
DROP POLICY IF EXISTS "Public can view published projects" ON projects;
CREATE POLICY "Public can view published projects" ON projects
    FOR SELECT USING (published = TRUE);

DROP POLICY IF EXISTS "Public can view project images for published projects" ON project_images;
CREATE POLICY "Public can view project images for published projects" ON project_images
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM projects WHERE projects.id = project_images.project_id AND projects.published = TRUE)
    );

DROP POLICY IF EXISTS "Public can view skills" ON skills;
CREATE POLICY "Public can view skills" ON skills FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view skill categories" ON skill_categories;
CREATE POLICY "Public can view skill categories" ON skill_categories FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view experiences" ON experiences;
CREATE POLICY "Public can view experiences" ON experiences FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view education" ON education;
CREATE POLICY "Public can view education" ON education FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view published services" ON services;
CREATE POLICY "Public can view published services" ON services FOR SELECT USING (published = TRUE);

DROP POLICY IF EXISTS "Public can view blog categories" ON blog_categories;
CREATE POLICY "Public can view blog categories" ON blog_categories FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view blog tags" ON blog_tags;
CREATE POLICY "Public can view blog tags" ON blog_tags FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view published blog posts" ON blog_posts;
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public can view blog post tags" ON blog_post_tags;
CREATE POLICY "Public can view blog post tags" ON blog_post_tags FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view published testimonials" ON testimonials;
CREATE POLICY "Public can view published testimonials" ON testimonials FOR SELECT USING (published = TRUE);

DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Public can view SEO settings" ON seo_settings;
CREATE POLICY "Public can view SEO settings" ON seo_settings FOR SELECT USING (TRUE);

-- Admin policies
DROP POLICY IF EXISTS "Admins can manage profiles" ON profiles;
CREATE POLICY "Admins can manage profiles" ON profiles
    FOR ALL USING (
        (SELECT current_user_role()) IN ('super_admin', 'admin')
    );

DROP POLICY IF EXISTS "Admins can manage projects" ON projects;
CREATE POLICY "Admins can manage projects" ON projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Admins can manage project images" ON project_images;
CREATE POLICY "Admins can manage project images" ON project_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Admins can manage skills" ON skills;
CREATE POLICY "Admins can manage skills" ON skills
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Admins can manage skill categories" ON skill_categories;
CREATE POLICY "Admins can manage skill categories" ON skill_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Admins can manage experiences" ON experiences;
CREATE POLICY "Admins can manage experiences" ON experiences
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Admins can manage education" ON education;
CREATE POLICY "Admins can manage education" ON education
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Admins can manage services" ON services;
CREATE POLICY "Admins can manage services" ON services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Admins can manage blog categories" ON blog_categories;
CREATE POLICY "Admins can manage blog categories" ON blog_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Admins can manage blog tags" ON blog_tags;
CREATE POLICY "Admins can manage blog tags" ON blog_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
CREATE POLICY "Admins can manage blog posts" ON blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Admins can manage blog post tags" ON blog_post_tags;
CREATE POLICY "Admins can manage blog post tags" ON blog_post_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Admins can manage contact messages" ON contact_messages;
CREATE POLICY "Admins can manage contact messages" ON contact_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Admins can manage media" ON media;
CREATE POLICY "Admins can manage media" ON media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
CREATE POLICY "Admins can manage site settings" ON site_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin')
        )
    );

DROP POLICY IF EXISTS "Admins can manage SEO settings" ON seo_settings;
CREATE POLICY "Admins can manage SEO settings" ON seo_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin')
        )
    );

DROP POLICY IF EXISTS "Admins can view analytics" ON analytics_events;
CREATE POLICY "Admins can view analytics" ON analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.user_id = auth.uid()
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
    FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (user_id = auth.uid());

-- Contact message staff write privileges
REVOKE UPDATE, DELETE ON contact_messages FROM anon, authenticated;
GRANT UPDATE, DELETE ON contact_messages TO authenticated;

-- Function to increment blog post views
CREATE OR REPLACE FUNCTION increment_blog_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE blog_posts
    SET views = views + 1
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (user_id, full_name, email, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, 'editor');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at triggers only on tables that have an updated_at column
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_skill_categories_updated_at ON skill_categories;
CREATE TRIGGER update_skill_categories_updated_at BEFORE UPDATE ON skill_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_experiences_updated_at ON experiences;
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_education_updated_at ON education;
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_seo_settings_updated_at ON seo_settings;
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON seo_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage buckets (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES
    ('project-images', 'project-images', TRUE),
    ('blog-images', 'blog-images', TRUE),
    ('avatars', 'avatars', TRUE),
    ('documents', 'documents', FALSE),
    ('portfolio-assets', 'portfolio-assets', TRUE)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read access for project-images" ON storage.objects;
CREATE POLICY "Public read access for project-images" ON storage.objects
    FOR SELECT USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Public read access for blog-images" ON storage.objects;
CREATE POLICY "Public read access for blog-images" ON storage.objects
    FOR SELECT USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;
CREATE POLICY "Public read access for avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Public read access for portfolio-assets" ON storage.objects;
CREATE POLICY "Public read access for portfolio-assets" ON storage.objects
    FOR SELECT USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Authenticated users can upload portfolio media" ON storage.objects;
CREATE POLICY "Authenticated users can upload portfolio media" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id IN ('project-images', 'blog-images', 'avatars', 'documents', 'portfolio-assets')
        AND auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Admins can delete portfolio media" ON storage.objects;
CREATE POLICY "Admins can delete portfolio media" ON storage.objects
    FOR DELETE USING (
        bucket_id IN ('project-images', 'blog-images', 'avatars', 'documents', 'portfolio-assets')
        AND EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid()
            AND role IN ('super_admin', 'admin', 'editor')
        )
    );
