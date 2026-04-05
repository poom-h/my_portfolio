import EducationAdminClient from './client'
import { getEducation } from '@/lib/actions/education'
import { education as staticEducation } from '@/lib/data/portfolio'

export default async function EducationAdminPage() {
  const education = await getEducation().catch(() => staticEducation)
  return <EducationAdminClient initialItems={education} />
}
