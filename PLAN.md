# AI Engineer Portfolio — Project Plan

> **Author:** Portfolio Owner
> **Date:** 2026-04-04
> **Stack:** Next.js · Supabase · Three.js · Framer Motion · Claude API · Tailwind CSS · TypeScript

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Two-Interface Architecture](#2-two-interface-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Database Schema (Supabase)](#4-database-schema-supabase)
5. [Project Structure](#5-project-structure)
6. [Feature Breakdown](#6-feature-breakdown)
7. [Neural Network Visualization Design](#7-neural-network-visualization-design)
8. [AI Chat Replica Design](#8-ai-chat-replica-design)
9. [Admin Panel Design](#9-admin-panel-design)
10. [API Routes](#10-api-routes)
11. [Environment Variables](#11-environment-variables)
12. [Dependencies](#12-dependencies)
13. [Implementation Phases](#13-implementation-phases)

---

## 1. Project Overview

A personal portfolio website for an AI engineer with two distinct goals:

- **Impress visitors** with a unique, interactive experience — a live neural network that IS the portfolio, where every node is a skill or project, and visitors can chat with an AI replica of the owner.
- **Easy self-management** — a private admin panel to CRUD all portfolio content, backed by Supabase, so no code changes are needed to update the portfolio.

---

## 2. Two-Interface Architecture

The application runs as a single Next.js codebase but serves two completely different UIs depending on the `INTERFACE` environment variable.

| `INTERFACE` value | Who uses it | What it shows |
|---|---|---|
| `portfolio` (default) | Public visitors | The full portfolio experience |
| `admin` | Owner only | CRUD panel for all portfolio content |

Switching is handled in `middleware.ts` which reads `process.env.INTERFACE` and routes/blocks accordingly. Each interface lives in its own [Route Group](https://nextjs.org/docs/app/building-your-application/routing/route-groups):

- `app/(portfolio)/` → public portfolio
- `app/(admin)/` → admin panel

Running locally:
```bash
# Public portfolio
INTERFACE=portfolio npm run dev

# Admin panel (different port recommended)
INTERFACE=admin npm run dev -- --port 3001
```

---

## 3. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js (App Router) | Full-stack React framework |
| Database | Supabase (PostgreSQL) | All portfolio content + auth |
| 3D Visualization | Three.js | Neural network hero |
| Animations | Framer Motion | Section reveals, transitions |
| Styling | Tailwind CSS | Utility-first CSS |
| AI Chat | Anthropic Claude API (Haiku) | AI replica chat |
| Language | TypeScript | Type safety throughout |
| Deploy | Vercel | Hosting |
| Storage | Supabase Storage | Images, PDFs |

---

## 4. Database Schema (Supabase)

### Design Principles

- All public tables have `is_published: boolean` — only published rows are visible to visitors
- `display_order: integer` on ordered content for drag-to-reorder in admin
- `created_at` / `updated_at` on every table (auto-managed via trigger)
- UUIDs as primary keys
- Row Level Security (RLS) enabled on all tables

---

### 4.1 `profile` — Singleton row, owner's core identity

```sql
CREATE TABLE profile (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name      text NOT NULL,
  tagline        text NOT NULL,        -- "AI Engineer & Researcher"
  bio_short      text NOT NULL,        -- 2-3 sentence hero blurb
  bio_long       text NOT NULL,        -- full About section (markdown)
  avatar_url     text,                 -- Supabase Storage URL
  resume_url     text,                 -- Supabase Storage PDF URL
  open_to_work   boolean NOT NULL DEFAULT false,
  location       text,                 -- "Kuala Lumpur, MY"
  is_published   boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Enforce singleton (only one row ever)
CREATE UNIQUE INDEX profile_singleton ON profile ((true));
```

---

### 4.2 `contact_info` — Social links and contact methods

```sql
CREATE TABLE contact_info (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform       text NOT NULL,   -- 'email' | 'github' | 'linkedin' | 'twitter' | 'website'
  label          text NOT NULL,   -- display text e.g. "john@example.com"
  url            text NOT NULL,   -- href value; for email use mailto:
  icon_name      text NOT NULL,   -- Lucide icon name e.g. "Github"
  display_order  integer NOT NULL DEFAULT 0,
  is_visible     boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
```

---

### 4.3 `skill_categories` — Groups of skills (e.g., "ML Frameworks", "Languages")

```sql
CREATE TABLE skill_categories (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL UNIQUE,           -- "Machine Learning Frameworks"
  slug           text NOT NULL UNIQUE,           -- "ml-frameworks"
  description    text,
  color_hex      text NOT NULL DEFAULT '#6366f1', -- accent color for neural net nodes
  display_order  integer NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
```

---

### 4.4 `skills` — Individual skills, each belonging to a category

```sql
CREATE TYPE proficiency_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

CREATE TABLE skills (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     uuid NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  name            text NOT NULL,              -- "PyTorch"
  slug            text NOT NULL UNIQUE,       -- "pytorch"
  proficiency     proficiency_level NOT NULL DEFAULT 'intermediate',
  years_exp       numeric(4,1),               -- 3.5 years
  icon_url        text,                       -- skill logo
  description     text,                       -- tooltip / hover text
  display_order   integer NOT NULL DEFAULT 0,
  is_published    boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
```

**Node size in neural network** is driven by `proficiency`:
- `beginner` → 0.4x
- `intermediate` → 0.6x
- `advanced` → 0.8x
- `expert` → 1.0x

---

### 4.5 `experience` — Work history

```sql
CREATE TABLE experience (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name     text NOT NULL,
  company_url      text,
  company_logo_url text,
  role_title       text NOT NULL,
  employment_type  text NOT NULL DEFAULT 'full-time', -- 'full-time' | 'part-time' | 'contract' | 'internship'
  location         text,                              -- "Remote" or "Kuala Lumpur, MY"
  started_at       date NOT NULL,
  ended_at         date,                              -- NULL = current position
  is_current       boolean NOT NULL DEFAULT false,
  description      text NOT NULL,                     -- markdown bullet points of achievements
  tech_stack       text[] NOT NULL DEFAULT '{}',      -- ["Python", "PyTorch", "AWS"]
  display_order    integer NOT NULL DEFAULT 0,
  is_published     boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT experience_current_check
    CHECK (NOT (is_current = true AND ended_at IS NOT NULL))
);
```

---

### 4.6 `projects` — Portfolio projects

```sql
CREATE TABLE projects (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text NOT NULL,
  slug              text NOT NULL UNIQUE,
  short_description text NOT NULL,              -- 1-2 sentences for card view
  long_description  text NOT NULL,              -- full markdown for detail view
  thumbnail_url     text,                       -- primary card image
  demo_url          text,                       -- live URL
  repo_url          text,                       -- GitHub etc.
  paper_url         text,                       -- arxiv / HuggingFace paper
  status            text NOT NULL DEFAULT 'complete', -- 'complete' | 'in-progress' | 'archived'
  is_featured       boolean NOT NULL DEFAULT false,   -- pinned to top of grid
  display_order     integer NOT NULL DEFAULT 0,
  is_published      boolean NOT NULL DEFAULT true,
  started_at        date,
  ended_at          date,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
```

---

### 4.7 `tags` + `project_tags` — Tagging projects

```sql
CREATE TABLE tags (
  id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name  text NOT NULL UNIQUE,   -- "NLP", "Computer Vision"
  slug  text NOT NULL UNIQUE
);

CREATE TABLE project_tags (
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tag_id      uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);
```

---

### 4.8 `project_images` — Additional screenshots per project

```sql
CREATE TABLE project_images (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url           text NOT NULL,
  caption       text,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);
```

---

### 4.9 `project_skills` — Links projects to skills (POWERS THE NEURAL NETWORK EDGES)

```sql
CREATE TABLE project_skills (
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_id    uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);
```

> Every row here becomes an **edge** in the Three.js neural network visualization.

---

### 4.10 `education`

```sql
CREATE TABLE education (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution     text NOT NULL,
  institution_url text,
  logo_url        text,
  degree          text NOT NULL,          -- "Master of Science"
  field_of_study  text NOT NULL,          -- "Computer Science - AI Track"
  started_at      date NOT NULL,
  ended_at        date,
  is_current      boolean NOT NULL DEFAULT false,
  gpa             numeric(3,2),
  description     text,                   -- thesis, honors, coursework (markdown)
  display_order   integer NOT NULL DEFAULT 0,
  is_published    boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
```

---

### 4.11 `certifications`

```sql
CREATE TABLE certifications (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name             text NOT NULL,
  issuer           text NOT NULL,
  issuer_logo_url  text,
  credential_id    text,
  credential_url   text,
  issued_at        date NOT NULL,
  expires_at       date,             -- NULL = no expiry
  skills           text[] DEFAULT '{}',
  display_order    integer NOT NULL DEFAULT 0,
  is_published     boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
```

---

### 4.12 `neural_network_config` — Controls the Three.js visualization (singleton)

```sql
CREATE TABLE neural_network_config (
  id                              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Layout
  layout_algorithm                text NOT NULL DEFAULT 'force-directed',
  -- Visual
  background_color                text NOT NULL DEFAULT '#0a0a0f',
  edge_color_default              text NOT NULL DEFAULT '#334155',
  edge_color_active               text NOT NULL DEFAULT '#818cf8',
  node_color_project              text NOT NULL DEFAULT '#8b5cf6',
  glow_intensity                  numeric(3,2) NOT NULL DEFAULT 0.6,
  particle_density                integer NOT NULL DEFAULT 80,
  -- Behavior
  rotation_speed                  numeric(4,3) NOT NULL DEFAULT 0.001,
  hover_zoom_factor               numeric(3,2) NOT NULL DEFAULT 1.3,
  show_labels                     boolean NOT NULL DEFAULT true,
  -- Connection rules
  connect_skills_in_category      boolean NOT NULL DEFAULT true,
  connect_projects_shared_skills  boolean NOT NULL DEFAULT true,
  min_shared_skills_for_edge      integer NOT NULL DEFAULT 1,
  updated_at                      timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX nn_config_singleton ON neural_network_config ((true));
```

---

### 4.13 `neural_network_node_overrides` — Manual node position/size overrides

```sql
CREATE TABLE neural_network_node_overrides (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_type      text NOT NULL,      -- 'skill' | 'project'
  node_id        uuid NOT NULL,      -- FK to skills.id or projects.id
  pinned         boolean NOT NULL DEFAULT false,
  pos_x          numeric(8,3),       -- normalized space position
  pos_y          numeric(8,3),
  pos_z          numeric(8,3),
  size_override  numeric(4,2),       -- multiplier, default 1.0
  color_override text,               -- hex override
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (node_type, node_id)
);
```

---

### 4.14 `ai_chat_config` — Claude chat replica configuration (singleton)

```sql
CREATE TABLE ai_chat_config (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name             text NOT NULL DEFAULT 'AI Replica',
  avatar_url               text,
  greeting_message         text NOT NULL,
  system_prompt            text NOT NULL,           -- full system prompt
  personality_traits       text[] NOT NULL DEFAULT '{}',
  forbidden_topics         text[] NOT NULL DEFAULT '{}',
  max_tokens               integer NOT NULL DEFAULT 1024,
  temperature              numeric(3,2) NOT NULL DEFAULT 0.7,
  model                    text NOT NULL DEFAULT 'claude-haiku-4-5-20251001',
  max_messages_per_session integer NOT NULL DEFAULT 20,
  session_timeout_minutes  integer NOT NULL DEFAULT 30,
  is_enabled               boolean NOT NULL DEFAULT true,
  chat_bubble_position     text NOT NULL DEFAULT 'bottom-right',
  updated_at               timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX ai_chat_config_singleton ON ai_chat_config ((true));
```

---

### 4.15 `chat_sessions` + `chat_messages` — Anonymous chat analytics

```sql
CREATE TABLE chat_sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token text NOT NULL UNIQUE,
  message_count integer NOT NULL DEFAULT 0,
  started_at    timestamptz NOT NULL DEFAULT now(),
  last_active   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE chat_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role        text NOT NULL CHECK (role IN ('user', 'assistant')),
  content     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

---

### 4.16 Row Level Security (RLS) Policies

```sql
-- Pattern for all public-facing tables:
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;

-- Anonymous visitors: read published rows only
CREATE POLICY "public read" ON <table>
  FOR SELECT TO anon USING (is_published = true);

-- Admin (authenticated): full access
CREATE POLICY "admin full access" ON <table>
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tables without is_published (e.g. skill_categories, tags, contact_info):
CREATE POLICY "public read" ON <table>
  FOR SELECT TO anon USING (true);

-- chat_sessions: anon can INSERT, admin can SELECT
CREATE POLICY "anon insert sessions" ON chat_sessions
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "admin read sessions" ON chat_sessions
  FOR SELECT TO authenticated USING (true);
```

---

### 4.17 `updated_at` Auto-Update Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply to every table that has updated_at:
CREATE TRIGGER set_updated_at BEFORE UPDATE ON <table>
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 5. Project Structure

```
/myportfolio
├── app/
│   ├── (portfolio)/                    ← Public portfolio interface
│   │   ├── layout.tsx                  ← Root layout: nav + chat bubble + framer
│   │   ├── page.tsx                    ← Hero: full-screen neural network
│   │   ├── about/page.tsx
│   │   ├── experience/page.tsx
│   │   ├── skills/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── education/page.tsx
│   │   └── contact/page.tsx
│   │
│   ├── (admin)/                        ← Private admin interface
│   │   ├── layout.tsx                  ← Root layout: sidebar + auth guard
│   │   ├── login/page.tsx
│   │   └── dashboard/
│   │       ├── page.tsx                ← Overview / stats
│   │       ├── profile/page.tsx
│   │       ├── skills/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── experience/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── projects/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── education/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── certifications/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── neural-network/page.tsx  ← Neural net config + preview
│   │       └── ai-chat/page.tsx         ← Chat persona config + test
│   │
│   └── api/
│       ├── chat/route.ts               ← POST: streaming Claude chat proxy
│       └── revalidate/route.ts         ← POST: on-demand cache revalidation
│
├── components/
│   ├── portfolio/
│   │   ├── NeuralNetworkCanvas.tsx     ← 'use client' — Three.js scene
│   │   ├── ChatBubble.tsx              ← 'use client' — floating toggle button
│   │   ├── ChatWindow.tsx              ← 'use client' — message list + input
│   │   ├── Nav.tsx
│   │   ├── SectionWrapper.tsx          ← Framer Motion scroll reveal
│   │   ├── SkillCard.tsx
│   │   ├── ExperienceCard.tsx
│   │   ├── ProjectCard.tsx
│   │   └── ContactForm.tsx             ← 'use client'
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── DataTable.tsx               ← Generic CRUD table
│   │   ├── ProfileForm.tsx
│   │   ├── SkillForm.tsx
│   │   ├── ExperienceForm.tsx
│   │   ├── ProjectForm.tsx             ← Multi-tab form
│   │   ├── EducationForm.tsx
│   │   ├── CertificationForm.tsx
│   │   ├── NeuralNetworkConfigurator.tsx
│   │   └── AIChatConfigurator.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Select.tsx
│       ├── Badge.tsx
│       ├── Modal.tsx
│       ├── Toast.tsx
│       └── ImageUpload.tsx             ← Supabase Storage uploader
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   ← Browser client
│   │   ├── server.ts                   ← Server client (reads cookies)
│   │   └── admin.ts                    ← Service-role client (mutations)
│   ├── claude.ts                       ← Anthropic SDK init
│   ├── data/                           ← Server-only data fetch functions
│   │   ├── profile.ts
│   │   ├── skills.ts
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   ├── education.ts
│   │   ├── neural-network.ts
│   │   └── ai-chat.ts
│   ├── actions/                        ← Server Functions ('use server')
│   │   ├── profile.ts
│   │   ├── skills.ts
│   │   ├── experience.ts
│   │   ├── projects.ts
│   │   ├── education.ts
│   │   ├── certifications.ts
│   │   ├── neural-network.ts
│   │   └── ai-chat.ts
│   └── utils.ts
│
├── hooks/
│   ├── useChat.ts                      ← Chat state machine
│   ├── useThreeScene.ts                ← Three.js scene lifecycle
│   └── useAdminAuth.ts                 ← Supabase session guard
│
├── types/
│   ├── database.ts                     ← Generated Supabase types
│   └── index.ts
│
├── middleware.ts                       ← Interface switching logic
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 6. Feature Breakdown

### 6.1 Portfolio Interface

#### Hero (`/`)
- Full-viewport Three.js neural network canvas
- Overlaid headline + CTA buttons (Framer Motion fade-up)
- Scroll indicator at bottom
- Nav fades in on scroll past hero

#### About (`/about`)
- Profile photo + animated entrance
- Long-form bio from markdown
- Key stats: years of experience, projects shipped, models trained
- "Open to work" badge (conditional)

#### Skills (`/skills`)
- Category tabs with horizontal scroll on mobile
- Skill cards: icon, name, proficiency bar (animated on viewport entry), years exp
- Filter by category
- Clicking a skill highlights its node in the neural network

#### Experience (`/experience`)
- Vertical timeline
- Company logo, role, dates, markdown description, tech stack chips
- "Currently here" pulse indicator for `is_current` rows

#### Projects (`/projects` + `/projects/[slug]`)
- Masonry grid with filter chips by tag
- Featured projects rendered larger
- Detail page: full markdown, image gallery, skills used, related projects

#### Education (`/education`)
- Card per institution with logo
- GPA if present, markdown description

#### Contact (`/contact`)
- Contact form (Server Action → transactional email)
- Social links from `contact_info` table
- Location display

#### Chat Bubble (global, on all portfolio pages)
- Fixed bottom-right floating button
- Opens `ChatWindow` panel with slide-up animation
- Streaming Claude responses
- Session-based rate limiting
- "Powered by Claude" attribution

---

### 6.2 Admin Interface

#### Login (`/login`)
- Supabase email + password auth
- Session stored as httpOnly cookie

#### Dashboard (`/dashboard`)
- Overview cards: total skills, projects, experience entries
- Quick links to each section
- "Preview portfolio" link

#### Per-section CRUD pages
See [Section 9 — Admin Panel Design](#9-admin-panel-design) for full details.

---

## 7. Neural Network Visualization Design

### Node Types

| Type | Source | Shape | Color | Size |
|---|---|---|---|---|
| `skill` | `skills` table | Sphere | `skill_categories.color_hex` | Driven by `proficiency` |
| `project` | `projects` table | Icosahedron | `node_color_project` config | `is_featured` = 1.4x |

### Edge (Connection) Rules

1. **Skill → Project**: Every row in `project_skills` = one edge
2. **Skill → Skill (same category)**: All skills in same category are weakly connected (thin edges)
3. **Project → Project**: Two projects with ≥ `min_shared_skills_for_edge` skills in common share an edge; width scales with shared skill count

### Layout

Force-directed simulation running in a **Web Worker** (non-blocking):
- Repulsion between all nodes
- Spring attraction along edges
- Category gravity: skills cluster by category
- Projects float in the outer shell
- Pinned nodes (`neural_network_node_overrides.pinned = true`) skip simulation

### Interactions

| Action | Result |
|---|---|
| Hover node | Scale up, highlight connected edges, dim unconnected nodes, show tooltip |
| Click skill node | Camera dolly to cluster, slide-in panel with skill detail + projects using it |
| Click project node | Camera dolly, slide-in panel with project card + skills used |
| Double-click node | Navigate to `/skills` or `/projects/[slug]` |
| Drag background | Orbit camera |
| Scroll | Zoom (FOV) |
| Double-click background | Reset camera |

### Technical Notes

- `NeuralNetworkCanvas` is `'use client'`, wraps a `<canvas>` element
- `useThreeScene` hook manages scene lifecycle
- Labels use `CSS2DRenderer` (lighter than `TextGeometry`)
- `ShaderMaterial` for node glow (fresnel additive blend)
- `THREE.Points` for background particles with vertex shader animation
- Animation loop paused via `document.visibilityState` (tab hidden = no render)

---

## 8. AI Chat Replica Design

### Flow

```
Visitor clicks chat bubble
  → ChatWindow opens (Framer Motion slide-up)
  → Visitor types message
  → POST /api/chat { messages, sessionToken }
  → Server: load ai_chat_config, prepend system_prompt, call Claude API (streaming)
  → ReadableStream response piped to ChatWindow
  → Tokens rendered as they arrive (streaming UI)
  → session message_count incremented
  → On limit reached: "I've said all I can for now — reach out directly!" message
```

### System Prompt Design

The `ai_chat_config.system_prompt` field contains a full persona prompt. Example structure:

```
You are an AI replica of [Owner Name], an AI engineer.

Background:
- [Pulled dynamically from profile.bio_short]
- Current role: [from experience where is_current = true]

Personality: [personality_traits joined]

You can talk about:
- Your projects and work
- Your skills and experience
- Your opinions on AI/ML topics
- How to get in touch

You must NOT discuss: [forbidden_topics joined]

Always be [traits]. Keep responses concise but engaging.
If asked something you don't know, say so honestly.
```

### Rate Limiting

- `session_token` stored in `sessionStorage` (client-side)
- `chat_sessions.message_count` incremented server-side per response
- When `message_count >= max_messages_per_session`, API returns a graceful limit message
- Session expires after `session_timeout_minutes` of inactivity

---

## 9. Admin Panel Design

### Profile
Single-form page. Fields: all `profile` columns. Rich text editor for `bio_long`. Image/PDF upload to Supabase Storage.

### Skills
- **List**: table with category filter, drag-to-reorder (`display_order`)
- **Create/Edit**: modal form with icon upload
- **Skill Categories**: separate list + inline create with color picker

### Experience
- **List**: sorted by `started_at DESC`, shows role + company + dates
- **Create/Edit**: full form with markdown editor for `description`, array input for `tech_stack`

### Projects
- **List**: card or table view, filter by status + `is_featured`
- **Create/Edit**: multi-tab form:
  - Tab 1: Basic info (title, slug, descriptions, status, dates)
  - Tab 2: Media (thumbnail + additional images via Supabase Storage)
  - Tab 3: Links (demo, repo, paper)
  - Tab 4: Metadata (tags multi-select, **skills multi-select** — this populates `project_skills` and therefore the neural network edges)

### Education + Certifications
Standard list + create/edit/delete forms.

### Neural Network Configurator (`/dashboard/neural-network`)
- Form for all `neural_network_config` fields: sliders, color pickers, toggles
- Node overrides table: pin/unpin, manual position, size/color override
- Live miniature preview panel (re-renders on save)
- "Reset to defaults" button

### AI Chat Configurator (`/dashboard/ai-chat`)
- System prompt textarea (character/token count indicator)
- Personality traits tag input
- Forbidden topics tag input
- Temperature slider + max tokens input
- Greeting message input
- Toggle `is_enabled`
- **Embedded test chat panel**: test real requests with current (unsaved) config — requires admin session

### Authentication
- Supabase `@supabase/ssr` package for server-side session management
- Admin layout reads session via `supabase.auth.getUser()` — redirects to `/login` if unauthenticated
- All Server Functions also validate session (defense in depth)
- Middleware provides a third layer: blocks `/dashboard/*` when `INTERFACE=portfolio`

---

## 10. API Routes

### `POST /api/chat`

```typescript
// Request body
{
  messages: { role: 'user' | 'assistant', content: string }[],
  sessionToken: string,
  configOverride?: Partial<AiChatConfig>  // admin-only, verified server-side
}

// Response: text/event-stream (Server-Sent Events)
// Streams Claude tokens as they arrive
```

Steps:
1. Look up `chat_sessions` by `sessionToken`, check `message_count` against limit
2. Load `ai_chat_config` from Supabase (cached)
3. If `configOverride` present, verify admin auth before applying
4. Build messages array with system prompt prepended
5. Call Anthropic client with `stream: true`
6. Return `ReadableStream` response
7. After stream ends: increment `chat_sessions.message_count`

### `POST /api/revalidate`

Admin-triggered cache revalidation after content updates. Calls `revalidatePath('/')` (and other affected paths) so the portfolio reflects latest Supabase data without a redeploy.

---

## 11. Environment Variables

```bash
# .env.local — NEVER commit this file

# Interface selection
INTERFACE=portfolio                           # 'portfolio' | 'admin'

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...              # server-only, never NEXT_PUBLIC_

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...                  # server-only

# Optional: contact form emails
RESEND_API_KEY=re_...
CONTACT_EMAIL=you@example.com
```

---

## 12. Dependencies

```bash
# Supabase
npm install @supabase/supabase-js @supabase/ssr

# Anthropic
npm install @anthropic-ai/sdk

# 3D / Animation
npm install three @types/three
npm install framer-motion

# UI Utilities
npm install lucide-react
npm install clsx tailwind-merge

# Forms + Validation
npm install zod react-hook-form @hookform/resolvers

# Admin Rich Text Editor
npm install @uiw/react-md-editor

# Utilities
npm install date-fns
npm install react-hot-toast
```

---

## 13. Implementation Phases

### Phase 1 — Foundation
- [ ] Install all dependencies
- [ ] Configure Tailwind (dark theme, custom color palette)
- [ ] Set up Supabase project, run all SQL migrations, enable RLS
- [ ] Create `lib/supabase/client.ts`, `server.ts`, `admin.ts`
- [ ] Generate TypeScript types: `npx supabase gen types typescript`
- [ ] Set up `middleware.ts` for interface switching
- [ ] Remove root `app/layout.tsx`; create both route group layouts

### Phase 2 — Admin Panel
- [ ] Admin login page + Supabase auth flow
- [ ] Admin sidebar layout with navigation
- [ ] Profile editor (validates full data pipeline end-to-end)
- [ ] Skills + categories CRUD
- [ ] Experience CRUD
- [ ] Projects CRUD (multi-tab form + image upload)
- [ ] Education + Certifications CRUD
- [ ] Neural network configurator form
- [ ] AI chat configurator form

### Phase 3 — Portfolio Data Layer
- [ ] All `lib/data/*.ts` server-only query functions
- [ ] All `lib/actions/*.ts` Server Functions

### Phase 4 — Portfolio UI
- [ ] Portfolio layout (nav, footer, chat bubble scaffold)
- [ ] About, Skills, Experience, Education, Contact pages
- [ ] Projects list + detail pages
- [ ] Add Framer Motion animations (section reveal, stagger, entrance)

### Phase 5 — Three.js Neural Network
- [ ] `useThreeScene` hook: scene, camera, renderer
- [ ] Node rendering from skills + projects data
- [ ] Force-directed layout in Web Worker
- [ ] Edge rendering from `project_skills` data
- [ ] Hover + click interaction handlers
- [ ] CSS2DRenderer labels
- [ ] Framer Motion side panel for node details
- [ ] Particle background
- [ ] Performance tuning (visibility API pause)

### Phase 6 — AI Chat
- [ ] `/api/chat` route with streaming
- [ ] `useChat` hook with session management
- [ ] `ChatWindow` + `ChatBubble` components
- [ ] Rate limiting + session persistence
- [ ] Admin test chat panel

### Phase 7 — Production Polish
- [ ] `metadata` exports for SEO on all pages
- [ ] Dynamic OG image generation
- [ ] `robots.ts` + `sitemap.ts`
- [ ] Error boundaries (`error.tsx`) per section
- [ ] `loading.tsx` skeletons
- [ ] Responsive audit (mobile, tablet)
- [ ] Accessibility audit (ARIA, keyboard nav)
- [ ] Supabase Storage bucket policies
- [ ] Deploy to Vercel + set environment variables

---

*This document is the single source of truth for the project. Update it as decisions change.*
