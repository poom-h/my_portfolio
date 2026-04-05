-- ============================================================
-- Portfolio Schema
-- Run this in Supabase SQL Editor → New Query
-- ============================================================

-- Profile (single row)
create table if not exists profile (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  tagline       text not null,
  bio           text not null,
  email         text not null,
  phone         text,
  location      text not null,
  github_url    text not null,
  linkedin_url  text not null,
  avatar_url    text,
  open_to_work  boolean not null default true,
  updated_at    timestamptz default now()
);

-- Skills
create table if not exists skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null,
  proficiency integer not null check (proficiency between 1 and 100),
  icon        text,
  sort_order  integer not null default 0,
  created_at  timestamptz default now()
);

-- Experience
create table if not exists experience (
  id                uuid primary key default gen_random_uuid(),
  company           text not null,
  role              text not null,
  employment_type   text not null,  -- Full-time | Internship | Freelance
  location          text not null,
  start_date        text not null,  -- 'YYYY-MM'
  end_date          text,           -- null = present
  description       text[] not null default '{}',
  tech_stack        text[] not null default '{}',
  sort_order        integer not null default 0,
  created_at        timestamptz default now()
);

-- Projects
create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  subtitle    text not null,
  description text not null,
  tech_stack  text[] not null default '{}',
  github_url  text,
  demo_url    text,
  image_url   text,
  featured    boolean not null default false,
  sort_order  integer not null default 0,
  year        integer not null,
  created_at  timestamptz default now()
);

-- Education
create table if not exists education (
  id          uuid primary key default gen_random_uuid(),
  degree      text not null,
  major       text not null,
  institution text not null,
  location    text not null,
  start_year  integer not null,
  end_year    integer not null,
  grade       text,
  sort_order  integer not null default 0,
  created_at  timestamptz default now()
);

-- Certificates
create table if not exists certificates (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  issuer         text not null,
  issued_date    text,
  credential_url text,
  created_at     timestamptz default now()
);

-- ============================================================
-- Row Level Security (public read, authenticated write)
-- ============================================================
alter table profile      enable row level security;
alter table skills       enable row level security;
alter table experience   enable row level security;
alter table projects     enable row level security;
alter table education    enable row level security;
alter table certificates enable row level security;

-- Public read
create policy "Public read profile"      on profile      for select using (true);
create policy "Public read skills"       on skills       for select using (true);
create policy "Public read experience"   on experience   for select using (true);
create policy "Public read projects"     on projects     for select using (true);
create policy "Public read education"    on education    for select using (true);
create policy "Public read certificates" on certificates for select using (true);

-- Authenticated write
create policy "Auth write profile"      on profile      for all using (auth.role() = 'authenticated');
create policy "Auth write skills"       on skills       for all using (auth.role() = 'authenticated');
create policy "Auth write experience"   on experience   for all using (auth.role() = 'authenticated');
create policy "Auth write projects"     on projects     for all using (auth.role() = 'authenticated');
create policy "Auth write education"    on education    for all using (auth.role() = 'authenticated');
create policy "Auth write certificates" on certificates for all using (auth.role() = 'authenticated');

-- ============================================================
-- Seed with your data (optional — run after creating tables)
-- ============================================================

insert into profile (name, tagline, bio, email, phone, location, github_url, linkedin_url, open_to_work)
values (
  'Poom Hirunwiwatkul',
  'ML Engineer · Data Engineer · Agentic AI',
  'Building production-ready AI systems — from LLM pipelines and agentic workflows to scalable data infrastructure. Passionate about closing the gap between raw data and intelligent products.',
  'poomhirunwiwatkul@gmail.com',
  '+66 95-801-6979',
  'Bangkok, Thailand',
  'https://github.com/poom-h',
  'https://linkedin.com/in/poom-hirunwiwatkul',
  true
);

insert into skills (name, category, proficiency, sort_order) values
  ('LLM / Agentic AI',          'AI & ML',          92, 1),
  ('RAG Pipelines',             'AI & ML',          90, 2),
  ('PyTorch',                   'AI & ML',          85, 3),
  ('TensorFlow / Keras',        'AI & ML',          80, 4),
  ('Scikit-learn',              'AI & ML',          85, 5),
  ('LangChain',                 'Frameworks',       90, 1),
  ('LangGraph',                 'Frameworks',       85, 2),
  ('FastAPI',                   'Frameworks',       82, 3),
  ('Streamlit',                 'Frameworks',       88, 4),
  ('n8n',                       'Frameworks',       75, 5),
  ('Python',                    'Languages',        95, 1),
  ('SQL',                       'Languages',        85, 2),
  ('Java',                      'Languages',        70, 3),
  ('C#',                        'Languages',        68, 4),
  ('Data Pipelines / ETL',      'Data Engineering', 88, 1),
  ('SQL Optimization',          'Data Engineering', 85, 2),
  ('Pandas / NumPy',            'Data Engineering', 90, 3),
  ('Databricks',                'Data Engineering', 80, 4),
  ('AWS (SageMaker, Lambda, S3, EC2)', 'Cloud & MLOps', 82, 1),
  ('Docker / ECR',              'Cloud & MLOps',    75, 2),
  ('Git',                       'Cloud & MLOps',    88, 3);

insert into experience (company, role, employment_type, location, start_date, end_date, description, tech_stack, sort_order) values
  ('RPI AI LAB', 'Data AI/ML Engineer', 'Full-time', 'Bangkok, Thailand', '2024-01', null,
   array['Designed, built, and optimized data pipelines for ingestion, transformation, and preparation of large-scale datasets.',
         'Developed ML applications including chatbots, automated scoring systems, and image generation tools with a strong focus on agentic AI using RAG frameworks.',
         'Led and collaborated on multiple end-to-end ML projects using LangGraph, LangChain, FastAPI, and Streamlit.',
         'Designed and prototyped generative AI solutions, continuously refining agentic workflows through research and experimentation.',
         'Gained hands-on experience with AWS (ECR, EC2, VPC) and Databricks; managed infrastructure and deployed ML apps in production.',
         'Partnered with senior engineers to define cloud architecture strategies and documented internal best-practice guidelines.'],
   array['Python','LangChain','LangGraph','FastAPI','AWS','Databricks','RAG','Streamlit'], 1),
  ('VML (Mirum Team)', 'Software Developer Intern', 'Internship', 'Bangkok, Thailand', '2024-01', '2024-06',
   array['Worked extensively with the Mirum Team in development and project management roles.',
         'Gained strong communication skills, solid understanding of project planning, and hands-on experience in web application development.'],
   array['Web Development','Project Management'], 2),
  ('Metis Solution', 'Freelance Developer', 'Freelance', 'Bangkok, Thailand', '2023-01', '2024-01',
   array['Developed "EasyFit" — an AR Fitting Room web application for the Line Shopping e-commerce platform as part of Line Shopping Incubator 2024.',
         'Secured top-eight position at Line Shopping Incubator 2024, enhancing the online shopping experience with AR technology.'],
   array['Python','Flask','OpenCV','Unity','WebRTC'], 3);

insert into projects (title, subtitle, description, tech_stack, featured, sort_order, year) values
  ('Agentic AI Chatbot & Scoring System', 'Production LLM Application',
   'Designed and deployed a production-grade agentic chatbot with automated scoring, leveraging RAG frameworks and LangGraph for multi-step reasoning workflows.',
   array['Python','LangGraph','LangChain','RAG','FastAPI','AWS'], true, 1, 2024),
  ('EasyFit — AR Fitting Room', 'Line Shopping Incubator 2024 · Top 8',
   'Web-based AR fitting room for Line Shopping e-commerce platform. Users can virtually try on clothing using computer vision and AR overlays.',
   array['Python','Flask','OpenCV','Unity','WebRTC'], true, 2, 2024),
  ('Procedural 3D Generation via GPT', 'University of Bristol · MSc Project',
   'Explored GPT technology to procedurally generate 3D virtual environments from text prompts. Built an application comparing AI-generated environments vs. traditional methods.',
   array['Python','Unity','C#','OpenAI GPT-4','Shap-e','REST API'], true, 3, 2023),
  ('Brain Disease Diagnosis via fMRI', 'University of Sheffield · BSc Dissertation',
   'Applied deep learning and classical ML models to diagnose autism from fMRI brain scans using the ABIDE dataset. Implemented novel feature reduction achieving 73% accuracy.',
   array['Python','Keras','Pandas','Scikit-learn','Google Colab'], false, 4, 2022);

insert into education (degree, major, institution, location, start_year, end_year, grade, sort_order) values
  ('MSc', 'Immersive Technology',                    'University of Bristol',  'Bristol, England',   2022, 2023, 'Merit',               1),
  ('BSc', 'Computer Science and Artificial Intelligence', 'University of Sheffield', 'Sheffield, England', 2019, 2022, 'First Class Honours', 2);

insert into certificates (name, issuer) values
  ('AWS Certified Machine Learning Engineer – Associate', 'Amazon Web Services'),
  ('Databricks Certified Generative AI Engineer Associate', 'Databricks');
