import Groq from 'groq-sdk'
import { createAdminClient } from '@/lib/supabase/admin'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

async function buildSystemPrompt(): Promise<string> {
  try {
    const supabase = createAdminClient()

    const [
      { data: profile },
      { data: skills },
      { data: experiences },
      { data: projects },
      { data: education },
      { data: certificates },
    ] = await Promise.all([
      supabase.from('profile').select('*').single(),
      supabase.from('skills').select('*').order('category').order('sort_order'),
      supabase.from('experience').select('*').order('start_date', { ascending: false }),
      supabase.from('projects').select('*').order('sort_order'),
      supabase.from('education').select('*').order('start_year', { ascending: false }),
      supabase.from('certificates').select('*').order('issued_date', { ascending: false }),
    ])

    const skillsByCategory = (skills ?? []).reduce<Record<string, string[]>>((acc, s) => {
      if (!acc[s.category]) acc[s.category] = []
      acc[s.category].push(`${s.name} (${s.proficiency}%)`)
      return acc
    }, {})

    const skillsText = Object.entries(skillsByCategory)
      .map(([cat, items]) => `  ${cat}: ${items.join(', ')}`)
      .join('\n')

    const expText = (experiences ?? []).map(e =>
      `  - ${e.role} @ ${e.company} (${e.start_date} → ${e.end_date ?? 'Present'})\n    ${e.description}`
    ).join('\n')

    const projectsText = (projects ?? []).map(p =>
      `  - ${p.title}${p.featured ? ' ⭐' : ''}: ${p.description}\n    Tech: ${p.tech_stack?.join(', ') ?? 'N/A'}${p.url ? `\n    URL: ${p.url}` : ''}`
    ).join('\n')

    const eduText = (education ?? []).map(e =>
      `  - ${e.degree} in ${e.field}, ${e.institution} (${e.start_year}–${e.end_year ?? 'Present'})${e.grade ? `, GPA/Grade: ${e.grade}` : ''}`
    ).join('\n')

    const certText = (certificates ?? []).map(c =>
      `  - ${c.name} by ${c.issuer}${c.issued_date ? ` (${c.issued_date})` : ''}`
    ).join('\n')

    return `You are an AI version of ${profile?.name ?? 'Poom Hirunwiwatkul'} — respond in first person as if you ARE Poom. You are not an assistant, you are him.

PERSONALITY:
- Curious, direct, and technical but approachable
- Passionate about AI/ML and building real production systems
- Good sense of humour, casual tone
- Currently living in Bangkok, Thailand
- Keep responses concise and natural (2–4 sentences unless asked for more)
- Never say "As an AI" or "I'm an AI assistant" — you are Poom's AI persona

CONTACT & LINKS:
- Email: ${profile?.email}
- GitHub: ${profile?.github_url}
- LinkedIn: ${profile?.linkedin_url}
- Location: ${profile?.location}

BIO:
${profile?.bio}

SKILLS:
${skillsText}

WORK EXPERIENCE:
${expText}

PROJECTS:
${projectsText}

EDUCATION:
${eduText}

CERTIFICATIONS:
${certText}

If someone asks something you genuinely don't know (e.g. very personal life details), say you'd rather they reach out directly via the contact section.`
  } catch {
    // Fallback if DB is unreachable
    return `You are an AI version of Poom Hirunwiwatkul, a passionate ML/Data/AI engineer based in Bangkok. Respond in first person as if you ARE Poom. Be curious, direct, technical but friendly. Keep responses to 2-4 sentences.`
  }
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!Array.isArray(messages)) {
      return new Response('Invalid messages', { status: 400 })
    }

    const systemPrompt = await buildSystemPrompt()

    const stream = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10),
      ],
      stream: true,
    })

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (err) {
    console.error('/api/chat error:', err)
    return new Response('Internal server error', { status: 500 })
  }
}
