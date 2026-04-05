import type { Skill, Experience, Project, Education, Certificate, Profile } from '@/types/portfolio'

export const profile: Profile = {
  id: '1',
  name: 'Poom Hirunwiwatkul',
  tagline: 'ML Engineer · Data Engineer · Agentic AI',
  bio: 'Building production-ready AI systems — from LLM pipelines and agentic workflows to scalable data infrastructure. Passionate about closing the gap between raw data and intelligent products.',
  email: 'poomhirunwiwatkul@gmail.com',
  phone: '+66 95-801-6979',
  location: 'Bangkok, Thailand',
  github_url: 'https://github.com/poom-h',
  linkedin_url: 'https://linkedin.com/in/poom-hirunwiwatkul',
  avatar_url: '/avatar.jpg',
  open_to_work: true,
}

export const skills: Skill[] = [
  // Core AI/ML
  { id: 's1',  name: 'LLM / Agentic AI',    category: 'AI & ML',        proficiency: 92, sort_order: 1 },
  { id: 's2',  name: 'RAG Pipelines',        category: 'AI & ML',        proficiency: 90, sort_order: 2 },
  { id: 's3',  name: 'PyTorch',              category: 'AI & ML',        proficiency: 85, sort_order: 3 },
  { id: 's4',  name: 'TensorFlow / Keras',   category: 'AI & ML',        proficiency: 80, sort_order: 4 },
  { id: 's5',  name: 'Scikit-learn',         category: 'AI & ML',        proficiency: 85, sort_order: 5 },
  // Frameworks
  { id: 's6',  name: 'LangChain',            category: 'Frameworks',     proficiency: 90, sort_order: 1 },
  { id: 's7',  name: 'LangGraph',            category: 'Frameworks',     proficiency: 85, sort_order: 2 },
  { id: 's8',  name: 'FastAPI',              category: 'Frameworks',     proficiency: 82, sort_order: 3 },
  { id: 's9',  name: 'Streamlit',            category: 'Frameworks',     proficiency: 88, sort_order: 4 },
  { id: 's10', name: 'n8n',                  category: 'Frameworks',     proficiency: 75, sort_order: 5 },
  // Languages
  { id: 's11', name: 'Python',               category: 'Languages',      proficiency: 95, sort_order: 1 },
  { id: 's12', name: 'SQL',                  category: 'Languages',      proficiency: 85, sort_order: 2 },
  { id: 's13', name: 'Java',                 category: 'Languages',      proficiency: 70, sort_order: 3 },
  { id: 's14', name: 'C#',                   category: 'Languages',      proficiency: 68, sort_order: 4 },
  // Data Engineering
  { id: 's15', name: 'Data Pipelines / ETL', category: 'Data Engineering', proficiency: 88, sort_order: 1 },
  { id: 's16', name: 'SQL Optimization',     category: 'Data Engineering', proficiency: 85, sort_order: 2 },
  { id: 's17', name: 'Pandas / NumPy',       category: 'Data Engineering', proficiency: 90, sort_order: 3 },
  { id: 's18', name: 'Databricks',           category: 'Data Engineering', proficiency: 80, sort_order: 4 },
  // Cloud & MLOps
  { id: 's19', name: 'AWS (SageMaker, Lambda, S3, EC2)', category: 'Cloud & MLOps', proficiency: 82, sort_order: 1 },
  { id: 's20', name: 'Docker / ECR',         category: 'Cloud & MLOps', proficiency: 75, sort_order: 2 },
  { id: 's21', name: 'Git',                  category: 'Cloud & MLOps', proficiency: 88, sort_order: 3 },
]

export const experiences: Experience[] = [
  {
    id: 'e1',
    company: 'RPI AI LAB',
    role: 'Data AI/ML Engineer',
    employment_type: 'Full-time',
    location: 'Bangkok, Thailand',
    start_date: '2024-01',
    end_date: null,
    description: [
      'Designed, built, and optimized data pipelines for ingestion, transformation, and preparation of large-scale datasets.',
      'Developed ML applications including chatbots, automated scoring systems, and image generation tools with a strong focus on agentic AI using RAG frameworks.',
      'Led and collaborated on multiple end-to-end ML projects using LangGraph, LangChain, FastAPI, and Streamlit.',
      'Designed and prototyped generative AI solutions, continuously refining agentic workflows through research and experimentation.',
      'Gained hands-on experience with AWS (ECR, EC2, VPC) and Databricks; managed infrastructure and deployed ML apps in production.',
      'Partnered with senior engineers to define cloud architecture strategies and documented internal best-practice guidelines.',
    ],
    tech_stack: ['Python', 'LangChain', 'LangGraph', 'FastAPI', 'AWS', 'Databricks', 'RAG', 'Streamlit'],
    sort_order: 1,
  },
  {
    id: 'e2',
    company: 'VML (Mirum Team)',
    role: 'Software Developer Intern',
    employment_type: 'Internship',
    location: 'Bangkok, Thailand',
    start_date: '2024-01',
    end_date: '2024-06',
    description: [
      'Worked extensively with the Mirum Team in development and project management roles.',
      'Gained strong communication skills, solid understanding of project planning, and hands-on experience in web application development.',
    ],
    tech_stack: ['Web Development', 'Project Management'],
    sort_order: 2,
  },
  {
    id: 'e3',
    company: 'Metis Solution',
    role: 'Freelance Developer',
    employment_type: 'Freelance',
    location: 'Bangkok, Thailand',
    start_date: '2023-01',
    end_date: '2024-01',
    description: [
      'Developed "EasyFit" — an AR Fitting Room web application for the Line Shopping e-commerce platform as part of Line Shopping Incubator 2024.',
      'Secured top-eight position at Line Shopping Incubator 2024, enhancing the online shopping experience with AR technology.',
    ],
    tech_stack: ['Python', 'Flask', 'OpenCV', 'Unity', 'WebRTC'],
    sort_order: 3,
  },
]

export const projects: Project[] = [
  {
    id: 'p1',
    title: 'Agentic AI Chatbot & Scoring System',
    subtitle: 'Production LLM Application',
    description: 'Designed and deployed a production-grade agentic chatbot with automated scoring, leveraging RAG frameworks and LangGraph for multi-step reasoning workflows.',
    tech_stack: ['Python', 'LangGraph', 'LangChain', 'RAG', 'FastAPI', 'AWS'],
    featured: true,
    sort_order: 1,
    year: 2024,
  },
  {
    id: 'p2',
    title: 'EasyFit — AR Fitting Room',
    subtitle: 'Line Shopping Incubator 2024 · Top 8',
    description: 'Web-based AR fitting room for Line Shopping e-commerce platform. Users can virtually try on clothing using computer vision and AR overlays.',
    tech_stack: ['Python', 'Flask', 'OpenCV', 'Unity', 'WebRTC'],
    featured: true,
    sort_order: 2,
    year: 2024,
  },
  {
    id: 'p3',
    title: 'Procedural 3D Generation via GPT',
    subtitle: 'University of Bristol · MSc Project',
    description: 'Explored GPT technology to procedurally generate 3D virtual environments from text prompts. Built an application comparing AI-generated environments vs. traditional methods.',
    tech_stack: ['Python', 'Unity', 'C#', 'OpenAI GPT-4', 'Shap-e', 'REST API'],
    featured: true,
    sort_order: 3,
    year: 2023,
  },
  {
    id: 'p4',
    title: 'Brain Disease Diagnosis via fMRI',
    subtitle: 'University of Sheffield · BSc Dissertation',
    description: 'Applied deep learning and classical ML models to diagnose autism from fMRI brain scans using the ABIDE dataset. Implemented novel feature reduction achieving 73% accuracy.',
    tech_stack: ['Python', 'Keras', 'Pandas', 'Scikit-learn', 'Google Colab'],
    featured: false,
    sort_order: 4,
    year: 2022,
  },
]

export const education: Education[] = [
  {
    id: 'ed1',
    degree: 'MSc',
    major: 'Immersive Technology',
    institution: 'University of Bristol',
    location: 'Bristol, England',
    start_year: 2022,
    end_year: 2023,
    grade: 'Merit',
    sort_order: 1,
  },
  {
    id: 'ed2',
    degree: 'BSc',
    major: 'Computer Science and Artificial Intelligence',
    institution: 'University of Sheffield',
    location: 'Sheffield, England',
    start_year: 2019,
    end_year: 2022,
    grade: 'First Class Honours',
    sort_order: 2,
  },
]

export const certificates: Certificate[] = [
  {
    id: 'c1',
    name: 'AWS Certified Machine Learning Engineer – Associate',
    issuer: 'Amazon Web Services',
  },
  {
    id: 'c2',
    name: 'Databricks Certified Generative AI Engineer Associate',
    issuer: 'Databricks',
  },
]
