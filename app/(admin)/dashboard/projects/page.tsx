import ProjectsAdminClient from './client'
import { getProjects } from '@/lib/actions/projects'
import { projects as staticProjects } from '@/lib/data/portfolio'

export default async function ProjectsAdminPage() {
  const projects = await getProjects().catch(() => staticProjects)
  return <ProjectsAdminClient initialItems={projects} />
}
