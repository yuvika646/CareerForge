import type { ResumeContent } from '@/lib/types/database'

// Default empty resume structure
export const defaultResumeContent: ResumeContent = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
}
