'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getEducation() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data
}

export async function createEducation(data: {
  degree: string
  major: string
  institution: string
  location: string
  start_year: number
  end_year: number
  grade?: string
  sort_order: number
}) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('education').insert({
    ...data,
    grade: data.grade || null,
  })
  if (error) throw error
  revalidatePath('/')
  revalidatePath('/dashboard/education')
}

export async function updateEducation(
  id: string,
  data: {
    degree: string
    major: string
    institution: string
    location: string
    start_year: number
    end_year: number
    grade?: string
    sort_order: number
  },
) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('education')
    .update({ ...data, grade: data.grade || null })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/')
  revalidatePath('/dashboard/education')
}

export async function deleteEducation(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('education').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/')
  revalidatePath('/dashboard/education')
}
