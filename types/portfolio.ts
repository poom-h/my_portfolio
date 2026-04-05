export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number   // 1-100
  icon?: string
  sort_order: number
}

export interface Experience {
  id: string
  company: string
  role: string
  employment_type: string   // full-time | internship | freelance
  location: string
  start_date: string
  end_date: string | null   // null = current
  description: string[]
  tech_stack: string[]
  sort_order: number
}

export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  tech_stack: string[]
  github_url?: string
  demo_url?: string
  image_url?: string
  featured: boolean
  sort_order: number
  year: number
}

export interface Education {
  id: string
  degree: string
  major: string
  institution: string
  location: string
  start_year: number
  end_year: number
  grade?: string
  sort_order: number
}

export interface Certificate {
  id: string
  name: string
  issuer: string
  issued_date?: string
  credential_url?: string
}

export interface Profile {
  id: string
  name: string
  tagline: string
  bio: string
  email: string
  phone?: string
  location: string
  github_url: string
  linkedin_url: string
  avatar_url?: string
  open_to_work: boolean
}
