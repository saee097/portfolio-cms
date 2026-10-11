export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          email: string | null
          avatar_url: string | null
          role: 'super_admin' | 'admin' | 'editor'
          bio: string | null
          title: string | null
          location: string | null
          website: string | null
          github: string | null
          linkedin: string | null
          twitter: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: 'super_admin' | 'admin' | 'editor'
          bio?: string | null
          title?: string | null
          location?: string | null
          website?: string | null
          github?: string | null
          linkedin?: string | null
          twitter?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: 'super_admin' | 'admin' | 'editor'
          bio?: string | null
          title?: string | null
          location?: string | null
          website?: string | null
          github?: string | null
          linkedin?: string | null
          twitter?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          short_description: string | null
          detailed_description: string | null
          thumbnail_url: string | null
          technologies: string[] | null
          github_url: string | null
          live_url: string | null
          category: string | null
          client: string | null
          start_date: string | null
          end_date: string | null
          featured: boolean
          published: boolean
          order_index: number
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          short_description?: string | null
          detailed_description?: string | null
          thumbnail_url?: string | null
          technologies?: string[] | null
          github_url?: string | null
          live_url?: string | null
          category?: string | null
          client?: string | null
          start_date?: string | null
          end_date?: string | null
          featured?: boolean
          published?: boolean
          order_index?: number
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          short_description?: string | null
          detailed_description?: string | null
          thumbnail_url?: string | null
          technologies?: string[] | null
          github_url?: string | null
          live_url?: string | null
          category?: string | null
          client?: string | null
          start_date?: string | null
          end_date?: string | null
          featured?: boolean
          published?: boolean
          order_index?: number
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      project_images: {
        Row: {
          id: string
          project_id: string
          url: string
          alt: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          url: string
          alt?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          url?: string
          alt?: string | null
          order_index?: number
          created_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          icon: string | null
          proficiency: number
          category_id: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          proficiency?: number
          category_id?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          proficiency?: number
          category_id?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      skill_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      experiences: {
        Row: {
          id: string
          title: string
          company: string
          location: string | null
          description: string | null
          technologies: string[] | null
          start_date: string
          end_date: string | null
          current: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          company: string
          location?: string | null
          description?: string | null
          technologies?: string[] | null
          start_date: string
          end_date?: string | null
          current?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          location?: string | null
          description?: string | null
          technologies?: string[] | null
          start_date?: string
          end_date?: string | null
          current?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      education: {
        Row: {
          id: string
          degree: string
          institution: string
          location: string | null
          description: string | null
          start_date: string
          end_date: string | null
          current: boolean
          achievements: Json[]
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          degree: string
          institution: string
          location?: string | null
          description?: string | null
          start_date: string
          end_date?: string | null
          current?: boolean
          achievements?: Json[]
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          degree?: string
          institution?: string
          location?: string | null
          description?: string | null
          start_date?: string
          end_date?: string | null
          current?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          short_description: string | null
          icon: string | null
          features: string[] | null
          order_index: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          short_description?: string | null
          icon?: string | null
          features?: string[] | null
          order_index?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          icon?: string | null
          features?: string[] | null
          order_index?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          cover_image_url: string | null
          category_id: string | null
          author_id: string | null
          published_at: string | null
          reading_time: number
          views: number
          seo_title: string | null
          seo_description: string | null
          status: 'draft' | 'published'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content?: string | null
          cover_image_url?: string | null
          category_id?: string | null
          author_id?: string | null
          published_at?: string | null
          reading_time?: number
          views?: number
          seo_title?: string | null
          seo_description?: string | null
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string | null
          cover_image_url?: string | null
          category_id?: string | null
          author_id?: string | null
          published_at?: string | null
          reading_time?: number
          views?: number
          seo_title?: string | null
          seo_description?: string | null
          status?: 'draft' | 'published'
          created_at?: string
          updated_at?: string
        }
      }
      blog_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      blog_post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          client_name: string
          position: string
          company: string | null
          avatar_url: string | null
          message: string
          rating: number
          published: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_name: string
          position: string
          company?: string | null
          avatar_url?: string | null
          message: string
          rating?: number
          published?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_name?: string
          position?: string
          company?: string | null
          avatar_url?: string | null
          message?: string
          rating?: number
          published?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          company: string | null
          topic: string | null
          budget: string | null
          timeline: string | null
          status: 'new' | 'read' | 'replied' | 'archived'
          ip_address: string | null
          user_agent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          company?: string | null
          topic?: string | null
          budget?: string | null
          timeline?: string | null
          status?: 'new' | 'read' | 'replied' | 'archived'
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          company?: string | null
          topic?: string | null
          budget?: string | null
          timeline?: string | null
          status?: 'new' | 'read' | 'replied' | 'archived'
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      media: {
        Row: {
          id: string
          name: string
          url: string
          mime_type: string | null
          size: number | null
          bucket: string | null
          path: string | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          mime_type?: string | null
          size?: number | null
          bucket?: string | null
          path?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          mime_type?: string | null
          size?: number | null
          bucket?: string | null
          path?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: Json | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: Json | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      seo_settings: {
        Row: {
          id: string
          page: string
          title: string | null
          description: string | null
          og_title: string | null
          og_description: string | null
          og_image: string | null
          twitter_card: string | null
          twitter_title: string | null
          twitter_description: string | null
          twitter_image: string | null
          canonical_url: string | null
          structured_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page: string
          title?: string | null
          description?: string | null
          og_title?: string | null
          og_description?: string | null
          og_image?: string | null
          twitter_card?: string | null
          twitter_title?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          canonical_url?: string | null
          structured_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page?: string
          title?: string | null
          description?: string | null
          og_title?: string | null
          og_description?: string | null
          og_image?: string | null
          twitter_card?: string | null
          twitter_title?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          canonical_url?: string | null
          structured_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          event_name: string
          page_url: string | null
          referrer: string | null
          user_agent: string | null
          ip_hash: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          event_name: string
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_hash?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          event_name?: string
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_hash?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'super_admin' | 'admin' | 'editor'
      message_status: 'new' | 'read' | 'replied' | 'archived'
      blog_status: 'draft' | 'published'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}