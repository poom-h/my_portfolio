'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getExperiences() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data
}

export async function createExperience(data: {
  company: string
  role: string
  employment_type: string
  location: string
  start_date: string
  end_date: string | null
  description: string[]
  tech_stack: string[]
  sort_order: number
}) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('experience').insert(data)
  if (error) throw error
  revalidatePath('/')
  revalidatePath('/dashboard/experience')
}

export async function updateExperience(
  id: string,
  data: {
    company: string
    role: string
    employment_type: string
    location: string
    start_date: string
    end_date: string | null
    description: string[]
    tech_stack: string[]
    sort_order: number
  },
) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('experience').update(data).eq('id', id)
  if (error) throw error
  revalidatePath('/')
  revalidatePath('/dashboard/experience')
}

export async function deleteExperience(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('experience').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/')
  revalidatePath('/dashboard/experience')
}
