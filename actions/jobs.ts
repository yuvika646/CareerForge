'use server'

import { createClient } from '@/lib/supabase/server'
import type { Job, Profile } from '@/lib/types/database'
import { revalidatePath } from 'next/cache'

export interface CreateJobInput {
  title: string
  company: string
  description: string
  required_skills: string[]
  location?: string
  salary_range?: string
  status?: 'active' | 'closed' | 'draft'
}

// Create a new job posting
export async function createJob(input: CreateJobInput) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  // Verify user is a recruiter
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if ((profile as Profile | null)?.role !== 'recruiter') {
    return { error: 'Only recruiters can create job postings' }
  }

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      recruiter_id: user.id,
      title: input.title,
      company: input.company,
      description: input.description,
      required_skills: input.required_skills,
      location: input.location,
      salary_range: input.salary_range,
      status: input.status || 'active',
    } as unknown as Record<string, unknown>)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/recruiter/dashboard')
  revalidatePath('/recruiter/jobs')
  return { data }
}

// Get all active jobs (for candidates)
export async function getActiveJobs(): Promise<{ data: Job[] | null; error: string | null }> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as Job[], error: null }
}

// Get recruiter's own jobs
export async function getRecruiterJobs(): Promise<{ data: Job[] | null; error: string | null }> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { data: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('recruiter_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as Job[], error: null }
}

// Update job posting
export async function updateJob(jobId: string, updates: Partial<CreateJobInput>) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('jobs')
    .update(updates as unknown as Record<string, unknown>)
    .eq('id', jobId)
    .eq('recruiter_id', user.id) // Ensure user owns the job
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/recruiter/dashboard')
  revalidatePath('/recruiter/jobs')
  return { data }
}

// Delete job posting
export async function deleteJob(jobId: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId)
    .eq('recruiter_id', user.id) // Ensure user owns the job

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/recruiter/dashboard')
  revalidatePath('/recruiter/jobs')
  return { success: true }
}

// Close/reopen job
export async function toggleJobStatus(jobId: string, status: 'active' | 'closed') {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('jobs')
    .update({ status } as unknown as Record<string, unknown>)
    .eq('id', jobId)
    .eq('recruiter_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/recruiter/dashboard')
  revalidatePath('/recruiter/jobs')
  return { data }
}
