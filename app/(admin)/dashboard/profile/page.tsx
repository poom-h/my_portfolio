import ProfileAdminClient from './client'
import { getProfile } from '@/lib/actions/profile'
import { profile as staticProfile } from '@/lib/data/portfolio'

export default async function ProfileAdminPage() {
  const profile = await getProfile().catch(() => staticProfile)
  return <ProfileAdminClient initialProfile={profile} />
}
