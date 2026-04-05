'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function getCertificates() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('issued_date', { ascending: false })
  if (error) throw error
  return data
}

export async function updateProfile(data: {
  name: string
  tagline: string
  bio: string
  email: string
  phone?: string
  location: string
  github_url: string
  linkedin_url: string
  open_to_work: boolean
}) {
  const supabase = createAdminClient()
  const { data: existing } = await supabase.from('profile').select('id').single()

  const payload = {
    ...data,
    phone:      data.phone || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = existing
    ? await supabase.from('profile').update(payload).eq('id', existing.id)
    : await supabase.from('profile').insert(payload)

  if (error) throw error
  revalidatePath('/')
  revalidatePath('/dashboard/profile')
}
