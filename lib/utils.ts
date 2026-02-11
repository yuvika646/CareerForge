import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function calculateMatchPercentage(userSkills: string[], jobSkills: string[]): { percentage: number; matchedSkills: string[] } {
  if (jobSkills.length === 0) return { percentage: 0, matchedSkills: [] }
  
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim())
  const matchedSkills = jobSkills.filter(skill => 
    normalizedUserSkills.includes(skill.toLowerCase().trim())
  )
  
  const percentage = Math.round((matchedSkills.length / jobSkills.length) * 100)
  return { percentage, matchedSkills }
}
