import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { path, referrer, session_id, device } = await request.json()

    if (!path || !session_id) {
      return new Response('Missing fields', { status: 400 })
    }

    const supabase = createAdminClient()
    await supabase.from('page_views').insert({
      path,
      referrer: referrer || null,
      session_id,
      device: device || 'desktop',
    })

    return new Response('ok', { status: 200 })
  } catch (err) {
    console.error('/api/track error:', err)
    return new Response('error', { status: 500 })
  }
}
