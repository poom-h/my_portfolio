import { createAdminClient } from '@/lib/supabase/admin'
import { Monitor, Smartphone, Tablet, Users, Eye, TrendingUp, Clock } from 'lucide-react'

async function getAnalytics() {
  const supabase = createAdminClient()

  const { data: rows } = await supabase
    .from('page_views')
    .select('*')
    .order('created_at', { ascending: false })

  if (!rows || rows.length === 0) return null

  const now        = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart  = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 6)

  const total        = rows.length
  const unique       = new Set(rows.map(r => r.session_id)).size
  const todayViews   = rows.filter(r => new Date(r.created_at) >= todayStart).length
  const weekViews    = rows.filter(r => new Date(r.created_at) >= weekStart).length

  // Last 7 days breakdown
  const days: { label: string; count: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d     = new Date(todayStart); d.setDate(d.getDate() - i)
    const next  = new Date(d);          next.setDate(next.getDate() + 1)
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    const count = rows.filter(r => {
      const t = new Date(r.created_at)
      return t >= d && t < next
    }).length
    days.push({ label, count })
  }

  // Device breakdown
  const devices = {
    desktop: rows.filter(r => r.device === 'desktop').length,
    mobile:  rows.filter(r => r.device === 'mobile').length,
    tablet:  rows.filter(r => r.device === 'tablet').length,
  }

  // Top referrers
  const refMap: Record<string, number> = {}
  rows.forEach(r => {
    const ref = r.referrer ? new URL(r.referrer).hostname.replace('www.', '') : 'Direct'
    refMap[ref] = (refMap[ref] ?? 0) + 1
  })
  const referrers = Object.entries(refMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Recent visits
  const recent = rows.slice(0, 20)

  return { total, unique, todayViews, weekViews, days, devices, referrers, recent }
}

export default async function AnalyticsPage() {
  const data = await getAnalytics()

  if (!data) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Analytics</h1>
        <p className="text-slate-400 text-sm mb-6">Visitor tracking for your portfolio.</p>
        <div className="rounded-2xl border border-dashed border-[#2d2d4a] bg-[#0f0f1a] p-12 text-center">
          <Eye size={32} className="mx-auto mb-3 text-slate-600" />
          <p className="text-slate-400 font-medium">No visits recorded yet</p>
          <p className="text-slate-600 text-sm mt-1">
            Make sure you've run the <code className="text-indigo-400">page_views</code> SQL in Supabase,
            then visit your portfolio to log the first event.
          </p>
        </div>
      </div>
    )
  }

  const maxDay = Math.max(...data.days.map(d => d.count), 1)

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Live visitor data from your portfolio.</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total Views',     value: data.total,      icon: Eye,        color: 'text-indigo-400' },
          { label: 'Unique Visitors', value: data.unique,     icon: Users,      color: 'text-violet-400' },
          { label: 'Views Today',     value: data.todayViews, icon: Clock,      color: 'text-emerald-400' },
          { label: 'Last 7 Days',     value: data.weekViews,  icon: TrendingUp, color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500">{label}</p>
              <Icon size={15} className={color} />
            </div>
            <p className={`text-3xl font-bold ${color}`}>{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* ── 7-day bar chart ── */}
      <div className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] p-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-6">Views — last 7 days</h2>
        <div className="flex items-end gap-3 h-32">
          {data.days.map(({ label, count }) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[10px] text-slate-500">{count || ''}</span>
              <div className="w-full rounded-t-md bg-indigo-500/20 relative overflow-hidden" style={{ height: '80px' }}>
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-md bg-gradient-to-t from-indigo-600 to-violet-500 transition-all duration-500"
                  style={{ height: `${(count / maxDay) * 100}%` }}
                />
              </div>
              <span className="text-[9px] text-slate-600 text-center leading-tight">{label.split(',')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Device breakdown ── */}
        <div className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] p-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-5">Devices</h2>
          <div className="space-y-3">
            {[
              { label: 'Desktop', count: data.devices.desktop, icon: Monitor },
              { label: 'Mobile',  count: data.devices.mobile,  icon: Smartphone },
              { label: 'Tablet',  count: data.devices.tablet,  icon: Tablet },
            ].map(({ label, count, icon: Icon }) => {
              const pct = data.total ? Math.round((count / data.total) * 100) : 0
              return (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={14} className="text-slate-500 shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{label}</span>
                      <span className="text-slate-500">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#1e1e33]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Top referrers ── */}
        <div className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] p-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-5">Top Referrers</h2>
          {data.referrers.length === 0 ? (
            <p className="text-sm text-slate-600">No referrer data yet.</p>
          ) : (
            <div className="space-y-2">
              {data.referrers.map(([ref, count]) => {
                const pct = data.total ? Math.round((count / data.total) * 100) : 0
                return (
                  <div key={ref} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 truncate">{ref}</span>
                        <span className="text-slate-500 shrink-0 ml-2">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#1e1e33]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent visits ── */}
      <div className="rounded-2xl border border-[#2d2d4a] bg-[#0f0f1a] overflow-hidden">
        <div className="border-b border-[#2d2d4a] px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-300">Recent Visits</h2>
        </div>
        <div className="divide-y divide-[#1e2035]">
          {data.recent.map(row => (
            <div key={row.id} className="flex items-center gap-4 px-6 py-3 hover:bg-[#161625] transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 font-mono">{row.path}</p>
                {row.referrer && (
                  <p className="text-xs text-slate-500 truncate">from {row.referrer}</p>
                )}
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                row.device === 'mobile'  ? 'bg-violet-500/10 text-violet-400' :
                row.device === 'tablet'  ? 'bg-amber-500/10 text-amber-400' :
                                           'bg-indigo-500/10 text-indigo-400'
              }`}>
                {row.device}
              </span>
              <span className="shrink-0 text-xs text-slate-600">
                {new Date(row.created_at).toLocaleString('en-US', {
                  month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
