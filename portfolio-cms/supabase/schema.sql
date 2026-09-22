-- Portfolio CMS Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase Auth users)
CREATE TABLE profiles (
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
CREATE TABLE projects (
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
CREATE TABLE project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    alt TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill categories table
CREATE TABLE skill_categories (
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
CREATE TABLE skills (
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
CREATE TABLE experiences (
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
CREATE TABLE education (
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
CREATE TABLE services (
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
CREATE TABLE blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog tags table
CREATE TABLE blog_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
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
CREATE TABLE blog_post_tags (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
    tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (post_id, tag_id)
);

-- Testimonials table
CREATE TABLE testimonials (
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
CREATE TABLE contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT CHECK (status IN ('new', 'read', 'replied', 'archived')) DEFAULT 'new',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media table
CREATE TABLE media (
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
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO settings table
CREATE TABLE seo_settings (
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
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name TEXT NOT NULL,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_hash TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_projects_published ON projects(published);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_skills_category_id ON skills(category_id);
CREATE INDEX idx_experiences_start_date ON experiences(start_date DESC);
CREATE INDEX idx_education_start_date ON education(start_date DESC);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_post_tags_post_id ON blog_post_tags(post_id);
CREATE INDEX idx_testimonials_published ON testimonials(published);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_media_bucket ON media(bucket);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- Row Level Security (RLS) Policies
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

-- Public read policies (for published content)
CREATE POLICY "Public can view published projects" ON projects
    FOR SELECT USING (published = TRUE);

CREATE POLICY "Public can view project images for published projects" ON project_images
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM projects WHERE projects.id = project_images.project_id AND projects.published = TRUE)
    );

CREATE POLICY "Public can view skills" ON skills FOR SELECT USING (TRUE);
CREATE POLICY "Public can view skill categories" ON skill_categories FOR SELECT USING (TRUE);
CREATE POLICY "Public can view experiences" ON experiences FOR SELECT USING (TRUE);
CREATE POLICY "Public can view education" ON education FOR SELECT USING (TRUE);
CREATE POLICY "Public can view published services" ON services FOR SELECT USING (published = TRUE);
CREATE POLICY "Public can view blog categories" ON blog_categories FOR SELECT USING (TRUE);
CREATE POLICY "Public can view blog tags" ON blog_tags FOR SELECT USING (TRUE);
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view blog post tags" ON blog_post_tags FOR SELECT USING (TRUE);
CREATE POLICY "Public can view published testimonials" ON testimonials FOR SELECT USING (published = TRUE);
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Public can view SEO settings" ON seo_settings FOR SELECT USING (TRUE);

-- Admin policies (authenticated users with admin role)
CREATE POLICY "Admins can manage profiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Admins can manage projects" ON projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage project images" ON project_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage skills" ON skills
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage skill categories" ON skill_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage experiences" ON experiences
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage education" ON education
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage services" ON services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage blog categories" ON blog_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage blog tags" ON blog_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage blog posts" ON blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage blog post tags" ON blog_post_tags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage testimonials" ON testimonials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage contact messages" ON contact_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage media" ON media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

CREATE POLICY "Admins can manage site settings" ON site_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Admins can manage SEO settings" ON seo_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin')
        )
    );

CREATE POLICY "Admins can view analytics" ON analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('super_admin', 'admin', 'editor')
        )
    );

-- Public insert for contact messages (with rate limiting via edge function)
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
    FOR INSERT WITH CHECK (TRUE);

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (user_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (user_id = auth.uid());

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

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_images_updated_at BEFORE UPDATE ON project_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skill_categories_updated_at BEFORE UPDATE ON skill_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_tags_updated_at BEFORE UPDATE ON blog_tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON seo_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage buckets (run in Supabase Storage or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES 
--     ('project-images', 'project-images', TRUE),
--     ('blog-images', 'blog-images', TRUE),
--     ('avatars', 'avatars', TRUE),
--     ('documents', 'documents', FALSE),
--     ('portfolio-assets', 'portfolio-assets', TRUE);

-- Storage policies (run in Supabase Storage policies)
-- CREATE POLICY "Public read access for project-images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
-- CREATE POLICY "Authenticated users can upload to project-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');
-- CREATE POLICY "Admins can delete from project-images" ON storage.objects FOR DELETE USING (bucket_id = 'project-images' AND EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')));