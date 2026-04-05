// TODO: Set GROQ_API_KEY in .env.local to activate the AI chat replica.
// Steps:
//   1. Go to https://console.groq.com/keys and create a free API key
//   2. Add  GROQ_API_KEY=gsk_...  to .env.local
//   3. Restart the dev server
import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are an AI replica of the portfolio owner — a passionate AI engineer who loves building intelligent systems.

You are knowledgeable about:
- Machine learning, deep learning, LLMs, and AI/ML engineering
- Python, PyTorch, LangChain, RAG pipelines, and modern AI stacks
- Full-stack development with Next.js, Supabase, and TypeScript
- The owner's projects and experience (described below)

Personality: curious, direct, technical but approachable. You enjoy nerding out about AI architecture and clean code. You have a good sense of humor.

Keep responses concise (2-4 sentences unless asked for more). Be engaging and authentic.

If asked about specific project details or personal contact info not in your context, say you'd love to chat more and suggest reaching out via the contact page.`

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!Array.isArray(messages)) {
      return new Response('Invalid messages', { status: 400 })
    }

    const stream = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
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
