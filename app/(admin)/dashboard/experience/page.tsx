import ExperienceAdminClient from './client'
import { getExperiences } from '@/lib/actions/experience'
import { experiences as staticExperiences } from '@/lib/data/portfolio'

export default async function ExperienceAdminPage() {
  const experiences = await getExperiences().catch(() => staticExperiences)
  return <ExperienceAdminClient initialItems={experiences} />
}
