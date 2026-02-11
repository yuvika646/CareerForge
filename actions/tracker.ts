'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ApplicationStatus = 'wishlist' | 'applied' | 'interview' | 'offer' | 'rejected'

export interface Application {
  id: string
  user_id: string
  company: string
  role: string
  status: ApplicationStatus
  salary: string | null
  date_applied: string
  created_at: string
  updated_at: string
}

// Fetch all applications for the current user
export async function getApplications() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated', data: [] as Application[] }
  }

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('date_applied', { ascending: false })

  if (error) {
    return { error: error.message, data: [] as Application[] }
  }

  return { data: (data || []) as Application[] }
}

// Insert a new application
export async function addApplication(formData: {
  company: string
  role: string
  status?: ApplicationStatus
  salary?: string
}) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('applications')
    .insert({
      user_id: user.id,
      company: formData.company,
      role: formData.role,
      status: formData.status || 'wishlist',
      salary: formData.salary || null,
    } as unknown as Record<string, unknown>)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/candidate/tracker')
  return { data: data as Application }
}

// Update the status of an application
export async function updateStatus(id: string, newStatus: ApplicationStatus) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('applications')
    .update({ status: newStatus, updated_at: new Date().toISOString() } as unknown as Record<string, unknown>)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/candidate/tracker')
  return { success: true }
}

// Delete an application
export async function deleteApplication(id: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/candidate/tracker')
  return { success: true }
}
