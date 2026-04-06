'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getSkills() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category')
    .order('sort_order')
  if (error) throw error
  return data
}

export async function createSkill(data: {
  name: string
  category: string
  proficiency: number
  sort_order: number
}) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('skills').insert(data)
  if (error) throw error
  revalidatePath('/')
  revalidatePath('/dashboard/skills')
}

export async function updateSkill(
  id: string,
  data: { name: string; category: string; proficiency: number; sort_order: number },
) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('skills').update(data).eq('id', id)
  if (error) throw error
  revalidatePath('/')
  revalidatePath('/dashboard/skills')
}

export async function deleteSkill(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/')
  revalidatePath('/dashboard/skills')
}

export async function renameCategory(oldName: string, newName: string) {
  const trimmed = newName.trim()
  if (!trimmed || trimmed === oldName) return
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('skills')
    .update({ category: trimmed })
    .eq('category', oldName)
  if (error) throw error
  revalidatePath('/')
  revalidatePath('/dashboard/skills')
}
