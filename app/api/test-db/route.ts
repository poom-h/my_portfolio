import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/test-db
 * Quick health-check: queries the `profile` table and returns the result.
 * Remove this file (or protect it behind auth) before going to production.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profile')
      .select('name, email, tagline, location')
      .single()

    if (error) {
      return Response.json({ ok: false, error: error.message, hint: error.hint }, { status: 500 })
    }

    return Response.json({ ok: true, profile: data })
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
