'use server'

import { createClient } from '@/lib/supabase/server'
import type { ResumeContent, Resume, Profile, Json } from '@/lib/types/database'
import { revalidatePath } from 'next/cache'

// Save or update resume
export async function saveResume(content: ResumeContent) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Calculate ATS score
  const atsScore = calculateATSScore(content)

  // Check if resume exists
  const { data: existingResume } = await supabase
    .from('resumes')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const resumeRow = existingResume as unknown as { id: string } | null

  if (resumeRow) {
    // Update existing resume
    const { error } = await supabase
      .from('resumes')
      .update({
        content: content as unknown as Json,
        ats_score: atsScore,
      } as unknown as Record<string, unknown>)
      .eq('id', resumeRow.id)

    if (error) {
      return { error: error.message }
    }
  } else {
    // Insert new resume
    const { error } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        content: content as unknown as Json,
        ats_score: atsScore,
      } as unknown as Record<string, unknown>)

    if (error) {
      return { error: error.message }
    }
  }

  // Also update user's skills in profile
  await supabase
    .from('profiles')
    .update({ skills: content.skills } as unknown as Record<string, unknown>)
    .eq('id', user.id)

  revalidatePath('/candidate/resume')
  return { success: true, atsScore }
}

// Load resume for current user
export async function loadResume(): Promise<{ 
  data: (Omit<Resume, 'content'> & { content: ResumeContent }) | null; 
  error?: string 
}> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated', data: null }
  }

  const { data: resume, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    return { error: error.message, data: null }
  }

  const resumeData = resume as Resume | null

  return { 
    data: resumeData ? {
      ...resumeData,
      content: resumeData.content as unknown as ResumeContent
    } : null 
  }
}

// Calculate ATS (Applicant Tracking System) score
function calculateATSScore(content: ResumeContent): number {
  let score = 0
  const maxScore = 100

  // Personal info completeness (20 points)
  const personalInfoFields = Object.values(content.personalInfo).filter(Boolean)
  score += (personalInfoFields.length / 6) * 20

  // Summary (15 points)
  if (content.summary) {
    const wordCount = content.summary.split(/\s+/).length
    if (wordCount >= 50) score += 15
    else if (wordCount >= 30) score += 10
    else if (wordCount >= 15) score += 5
  }

  // Experience (25 points)
  if (content.experience.length > 0) {
    const expPoints = Math.min(content.experience.length * 5, 15)
    score += expPoints
    
    // Detailed descriptions
    const detailedExp = content.experience.filter(e => e.description && e.description.length > 50)
    score += Math.min(detailedExp.length * 2, 10)
  }

  // Education (15 points)
  if (content.education.length > 0) {
    score += Math.min(content.education.length * 7.5, 15)
  }

  // Skills (15 points)
  if (content.skills.length > 0) {
    score += Math.min(content.skills.length * 1.5, 15)
  }

  // Projects/Certifications (10 points)
  const extras = content.projects.length + content.certifications.length
  score += Math.min(extras * 2.5, 10)

  return Math.round(Math.min(score, maxScore))
}
