import SkillsAdminClient from './client'
import { getSkills } from '@/lib/actions/skills'
import { skills as staticSkills } from '@/lib/data/portfolio'

export default async function SkillsAdminPage() {
  const skills = await getSkills().catch(() => staticSkills)
  return <SkillsAdminClient initialItems={skills} />
}
