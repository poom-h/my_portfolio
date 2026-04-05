import HeroClient        from '@/components/portfolio/HeroClient'
import AboutSection      from '@/components/portfolio/sections/AboutSection'
import SkillsSection     from '@/components/portfolio/sections/SkillsSection'
import ExperienceSection from '@/components/portfolio/sections/ExperienceSection'
import ProjectsSection   from '@/components/portfolio/sections/ProjectsSection'
import EducationSection  from '@/components/portfolio/sections/EducationSection'
import ContactSection    from '@/components/portfolio/sections/ContactSection'

import { getProfile, getCertificates } from '@/lib/actions/profile'
import { getSkills }      from '@/lib/actions/skills'
import { getExperiences } from '@/lib/actions/experience'
import { getProjects }    from '@/lib/actions/projects'
import { getEducation }   from '@/lib/actions/education'

import {
  profile      as staticProfile,
  skills       as staticSkills,
  experiences  as staticExperiences,
  projects     as staticProjects,
  education    as staticEducation,
  certificates as staticCertificates,
} from '@/lib/data/portfolio'

export default async function PortfolioPage() {
  const [profile, certificates, skills, experiences, projects, education] = await Promise.all([
    getProfile()      .catch(() => staticProfile),
    getCertificates() .catch(() => staticCertificates),
    getSkills()       .catch(() => staticSkills),
    getExperiences()  .catch(() => staticExperiences),
    getProjects()     .catch(() => staticProjects),
    getEducation()    .catch(() => staticEducation),
  ])

  return (
    <>
      <HeroClient profile={profile} certificates={certificates} />

      <main>
        <AboutSection      profile={profile}          certificates={certificates} />
        <SkillsSection     skills={skills} />
        <ExperienceSection experiences={experiences} />
        <ProjectsSection   projects={projects} />
        <EducationSection  education={education} />
        <ContactSection    profile={profile} />
      </main>
    </>
  )
}
