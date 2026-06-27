import { useState } from 'react';
import { useApp } from '../state/store';
import { STAGE_THRESHOLDS, stageFromDays } from '../state/avatar';

export default function Progress() {
  const { state, days, stage, addJournal } = useApp();
  const [tab, setTab] = useState<'overview' | 'journal' | 'checkins' | 'wins'>('overview');
  const [draft, setDraft] = useState('');

  const submitJournal = () => {
    if (!draft.trim()) return;
    addJournal(draft.trim());
    setDraft('');
  };

  // Mood trend (last 14 days)
  const moodTrend = state.checkIns.slice(-14).map((c) => c.mood);

  return (
    <div className="app-bg min-h-full pb-28 px-5 pt-6">
      <h1 className="font-display text-2xl font-bold text-white mb-1">Your progress</h1>
      <p className="text-ink-400 text-sm mb-5">
        Day {days} · Stage {stage + 1}
      </p>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-2xl p-1 mb-5">
        {(['overview', 'wins', 'journal', 'checkins'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition ${
              tab === t ? 'bg-sage-500/30 text-white' : 'text-ink-300 hover:text-white'
            }`}
          >
            {t === 'checkins' ? 'Check-ins' : t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">


          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Days free" value={days.toString()} accent />
            <StatCard label="Current stage" value={`${stage + 1} / 6`} />
            <StatCard label="Wins logged" value={state.wins.length.toString()} accent />
            <StatCard label="Journal entries" value={state.journal.length.toString()} />
          </div>

          {/* Mood sparkline */}
          {moodTrend.length > 1 && (
            <div className="glass rounded-3xl p-5">
              <div className="text-xs text-ink-400 uppercase tracking-widest mb-3">
                Mood · last {moodTrend.length} days
              </div>
              <Sparkline data={moodTrend} max={5} />
            </div>
          )}

          {/* Milestones */}
          <div className="glass rounded-3xl p-5">
            <div className="text-xs text-ink-400 uppercase tracking-widest mb-3">
              Milestones
            </div>
            <div className="space-y-2">
              {STAGE_THRESHOLDS.map((m) => {
                const reached = days >= m.day;
                const isCurrent = stageFromDays(days) === m.stage;
                return (
                  <div
                    key={m.day}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      reached
                        ? 'bg-sage-500/10 border border-sage-500/20'
                        : 'bg-white/3 border border-white/5'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      reached ? 'bg-sage-500 text-ink-900' : 'bg-white/10 text-ink-400'
                    }`}>
                      {reached ? '✓' : '·'}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${reached ? 'text-white' : 'text-ink-300'}`}>
                        Day {m.day} — {m.name}
                      </div>
                      <div className="text-[10px] text-ink-400">{m.tagline}</div>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] uppercase tracking-widest text-sage-300 font-semibold">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'wins' && (
        <div>
          {state.wins.length === 0 && (
            <div className="text-center text-ink-400 text-sm py-10 leading-relaxed">
              No wins yet. Tap the ✨ button on Home to log your first one.<br />
              No win is too small.
            </div>
          )}
          <div className="space-y-3">
            {[...state.wins].reverse().map((w) => (
              <div key={w.id} className="glass rounded-2xl p-4">
                <div className="flex items-start gap-2.5">
                  <span className="text-amber-300 text-lg mt-0.5 flex-shrink-0">★</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm leading-relaxed">{w.text}</p>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] text-ink-400">
                        {new Date(w.at).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                      {w.tags.length > 0 && (
                        <>
                          <span className="text-[10px] text-ink-400">·</span>
                          {w.tags.slice(0, 3).map((t) => (
                            <span key={t} className="text-[9px] uppercase tracking-widest text-amber-300/80 bg-amber-400/10 px-2 py-0.5 rounded-full">
                              {t.replace('-', ' ')}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'journal' && (
        <div>
          <div className="glass rounded-3xl p-4 mb-4">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="What's on your mind? No one sees this but you."
              rows={4}
              className="w-full bg-transparent text-white placeholder:text-ink-400 focus:outline-none resize-none text-sm"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={submitJournal}
                disabled={!draft.trim()}
                className="btn-primary !rounded-lg !py-2 !px-4 !text-sm disabled:opacity-40"
              >
                Save entry
              </button>
            </div>
          </div>

          {state.journal.length === 0 && (
            <div className="text-center text-ink-400 text-sm py-10">
              No entries yet. Future you will thank you for starting today.
            </div>
          )}

          <div className="space-y-3">
            {[...state.journal].reverse().map((j) => (
              <div key={j.id} className="glass rounded-2xl p-4">
                <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-1.5">
                  {new Date(j.at).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </div>
                <p className="text-ink-100 text-sm whitespace-pre-wrap leading-relaxed">{j.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'checkins' && (
        <div className="space-y-3">
          {state.checkIns.length === 0 && (
            <div className="text-center text-ink-400 text-sm py-10">
              No check-ins yet. Try the daily check-in from the home screen.
            </div>
          )}
          {[...state.checkIns].reverse().map((c) => (
            <div key={c.date} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] text-ink-400 uppercase tracking-widest">
                  {new Date(c.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span>😊 {c.mood}</span>
                  <span>🔥 {c.craving}</span>
                </div>
              </div>
              {c.note && <p className="text-ink-100 text-sm mb-1">{c.note}</p>}
              {c.wins && (
                <p className="text-sage-300 text-sm">
                  ✨ {c.wins}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${accent ? 'bg-gradient-to-br from-sage-500/20 to-sage-700/10 border border-sage-500/30' : 'glass'}`}>
      <div className="text-[10px] text-ink-400 uppercase tracking-widest">{label}</div>
      <div className={`font-display text-3xl font-bold mt-1 ${accent ? 'gradient-text' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}

function Sparkline({ data, max }: { data: number[]; max: number }) {
  const w = 280;
  const h = 60;
  const step = w / Math.max(data.length - 1, 1);
  const pts = data.map((v, i) => `${i * step},${h - (v / max) * h}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h + 4}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#43c486" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#43c486" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,${h} ${pts} ${w},${h}`}
        fill="url(#sparkFill)"
        stroke="none"
      />
      <polyline
        points={pts}
        fill="none"
        stroke="#43c486"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => (
        <circle key={i} cx={i * step} cy={h - (v / max) * h} r="2" fill="#9be7c5" />
      ))}
    </svg>
  );
}
