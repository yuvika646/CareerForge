export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Resume content structure (defined first for use in Database)
export interface ResumeContent {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    website: string
  }
  summary: string
  experience: {
    id: string
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }[]
  education: {
    id: string
    degree: string
    school: string
    location: string
    graduationDate: string
    gpa: string
  }[]
  skills: string[]
  certifications: {
    id: string
    name: string
    issuer: string
    date: string
  }[]
  projects: {
    id: string
    name: string
    description: string
    technologies: string[]
    link: string
  }[]
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'candidate' | 'recruiter'
          full_name: string | null
          skills: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'candidate' | 'recruiter'
          full_name?: string | null
          skills?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'candidate' | 'recruiter'
          full_name?: string | null
          skills?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          content: Json
          ats_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content?: Json
          ats_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: Json
          ats_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          recruiter_id: string
          title: string
          company: string
          description: string
          required_skills: string[]
          status: 'active' | 'closed' | 'draft'
          location: string | null
          salary_range: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recruiter_id: string
          title: string
          company: string
          description: string
          required_skills?: string[]
          status?: 'active' | 'closed' | 'draft'
          location?: string | null
          salary_range?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recruiter_id?: string
          title?: string
          company?: string
          description?: string
          required_skills?: string[]
          status?: 'active' | 'closed' | 'draft'
          location?: string | null
          salary_range?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          company: string
          role: string
          status: 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected'
          salary: string | null
          date_applied: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company: string
          role: string
          status?: 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected'
          salary?: string | null
          date_applied?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company?: string
          role?: string
          status?: 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected'
          salary?: string | null
          date_applied?: string
          created_at?: string
          updated_at?: string
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
      [_ in never]: never
    }
  }
}

// Helper type for profile with user info
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Resume = Database['public']['Tables']['resumes']['Row']
export type Job = Database['public']['Tables']['jobs']['Row']
export type ApplicationRow = Database['public']['Tables']['applications']['Row']

// Job with match percentage
export interface JobWithMatch extends Job {
  matchPercentage: number
  matchedSkills: string[]
}
