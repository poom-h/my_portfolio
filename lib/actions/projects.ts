'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data
}

export async function createProject(data: {
  title: string
  subtitle: string
  description: string
  tech_stack: string[]
  github_url?: string
  demo_url?: string
  featured: boolean
  sort_order: number
  year: number
}) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('projects').insert({
    ...data,
    github_url: data.github_url || null,
    demo_url:   data.demo_url   || null,
  })
  if (error) throw error
  revalidatePath('/')
  revalidatePath('/dashboard/projects')
}

export async function updateProject(
  id: string,
  data: {
    title: string
    subtitle: string
    description: string
    tech_stack: string[]
    github_url?: string
    demo_url?: string
    featured: boolean
    sort_order: number
    year: number
  },
) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('projects')
    .update({
      ...data,
      github_url: data.github_url || null,
      demo_url:   data.demo_url   || null,
    })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/')
  revalidatePath('/dashboard/projects')
}

export async function deleteProject(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/')
  revalidatePath('/dashboard/projects')
}
