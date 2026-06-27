import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useApp, formatDateLong, SUBSTANCE_LABELS, todayKey } from '../state/store';
import { Avatar } from '../components/AvatarImage';
import { quoteForDay } from '../data/quotes';
import { nextMilestone, progressToNextStage } from '../state/avatar';
import { WinSheet } from '../components/WinSheet';

export default function Home() {
  const { state, days, stage } = useApp();
  const profile = state.profile!;
  const next = nextMilestone(days);
  const progress = progressToNextStage(days);
  const today = todayKey();
  const checkedToday = state.checkIns.some((c) => c.date === today);
  const quote = quoteForDay(days);
  const subLabel =
    profile.substance === 'other' ? profile.customSubstance || 'Something else' : SUBSTANCE_LABELS[profile.substance];
  const recentMood = state.checkIns.length > 0 ? state.checkIns[state.checkIns.length - 1].mood : null;
  const recentWins = [...state.wins].slice(-3).reverse();
  const winToday = state.wins.some((w) => w.at.slice(0, 10) === today);
  const [winSheet, setWinSheet] = useState(false);

  // Compute win streak — consecutive days with at least one win
  const winStreak = (() => {
    if (state.wins.length === 0) return 0;
    const winDays = new Set(state.wins.map((w) => w.at.slice(0, 10)));
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (winDays.has(key)) streak++;
      else break;
    }
    return streak;
  })();

  return (
    <div className="app-bg min-h-full pb-28 px-3 pt-4">
      {/* Top header strip */}
      <div className="flex items-center justify-between px-2 mb-2">
        <div>
          <div className="text-[10px] text-ink-400 uppercase tracking-widest">Day {days}</div>
          <h1 className="font-display text-xl font-bold text-white leading-tight">
            Hey {profile.name} 👋
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/pricing"
            className="text-[10px] text-amber-300 uppercase tracking-widest hover:text-amber-200 font-semibold"
          >
            ✨ Pro
          </Link>
          <Link
            to="/avatar"
            className="text-[10px] text-sage-300 uppercase tracking-widest hover:text-white"
          >
            Evolution →
          </Link>
        </div>
      </div>

      {/* The HERO — big avatar */}
      <div className="relative">
        <Avatar avatarId={profile.avatarId} stage={stage} mood={recentMood} size={380} />
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-2 -mt-2 mb-4 px-1">
        <MiniStat label="Days" value={days.toString()} />
        <MiniStat label="Stage" value={`${stage + 1}/6`} />
        <MiniStat label="Free from" value={subLabel} small />
      </div>

      {/* Next milestone */}
      {next ? (
        <div className="glass rounded-3xl p-4 mb-3 mx-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[10px] text-ink-400 uppercase tracking-widest">Next stage</div>
              <div className="text-white font-semibold mt-0.5">{next.name}</div>
            </div>
            <div className="text-sage-300 text-sm font-medium">
              {next.daysLeft} {next.daysLeft === 1 ? 'day' : 'days'}
            </div>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sage-400 to-sage-600 rounded-full transition-all duration-1000"
              style={{ width: `${progress.pct * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="glass rounded-3xl p-4 mb-3 mx-1 text-center">
          <div className="text-sage-300 text-sm">✨ Highest stage reached. Every day is victory.</div>
        </div>
      )}

      {/* Daily check-in card */}
      <Link
        to="/checkin"
        className="block glass-strong rounded-3xl p-4 mx-1 mb-3 hover:bg-white/[0.04] transition"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-ink-400 uppercase tracking-widest">
              Daily check-in
            </div>
            <div className="text-white font-semibold mt-0.5">
              {checkedToday ? '✓ Done for today' : 'How are you, really?'}
            </div>
            <div className="text-[10px] text-ink-400 mt-0.5">{formatDateLong()}</div>
          </div>
          <div className="text-2xl">{checkedToday ? '🌿' : '✍️'}</div>
        </div>
      </Link>

      {/* Daily Win card */}
      <button
        onClick={() => setWinSheet(true)}
        className="w-full glass-strong rounded-3xl p-4 mx-1 mb-3 hover:bg-white/[0.04] transition text-left relative overflow-hidden block"
        style={{ marginLeft: 0, marginRight: 0 }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="text-[10px] text-amber-300 uppercase tracking-widest">
              Today's win {winStreak > 0 && `· ${winStreak}-day streak ✨`}
            </div>
            <div className="text-white font-semibold mt-0.5">
              {winToday ? "What's another one?" : 'Log your first win today'}
            </div>
            <div className="text-[10px] text-ink-400 mt-0.5">No win is too small.</div>
          </div>
          <div className="text-2xl">{winToday ? '⭐' : '✨'}</div>
        </div>
      </button>

      {/* Recent wins */}
      {recentWins.length > 0 && (
        <div className="glass rounded-3xl p-4 mx-1 mb-3">
          <div className="text-[10px] text-amber-300 uppercase tracking-widest mb-2">
            Recent wins
          </div>
          <div className="space-y-2">
            {recentWins.map((w) => (
              <div key={w.id} className="flex items-start gap-2">
                <span className="text-amber-300 text-sm mt-0.5">★</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm leading-relaxed">{w.text}</p>
                  <p className="text-[10px] text-ink-400 mt-0.5">
                    {timeAgo(w.at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2 mb-4 px-1">
        <Link to="/coach" className="glass rounded-2xl p-4 hover:bg-white/[0.04] transition">
          <div className="text-2xl mb-1.5">💬</div>
          <div className="font-semibold text-white text-sm">Talk to Sage</div>
          <div className="text-[10px] text-ink-400 mt-0.5">Always here</div>
        </Link>
        <Link to="/progress" className="glass rounded-2xl p-4 hover:bg-white/[0.04] transition">
          <div className="text-2xl mb-1.5">📈</div>
          <div className="font-semibold text-white text-sm">Progress</div>
          <div className="text-[10px] text-ink-400 mt-0.5">Streaks, journal</div>
        </Link>
      </div>

      {/* Quote */}
      <div className="glass rounded-3xl p-4 mx-1 mb-3">
        <div className="text-sage-300 text-[10px] uppercase tracking-widest mb-2">For today</div>
        <p className="text-white text-sm leading-relaxed italic mb-2">"{quote.text}"</p>
        <div className="text-ink-400 text-xs">— {quote.author}</div>
      </div>

      {/* Why */}
      {profile.why && (
        <div className="glass rounded-3xl p-4 mx-1 mb-3">
          <div className="text-sage-300 text-[10px] uppercase tracking-widest mb-2">Your why</div>
          <p className="text-white text-sm leading-relaxed">{profile.why}</p>
        </div>
      )}

      {/* Crisis banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3.5 mx-1">
        <div className="text-amber-300 text-[10px] font-semibold mb-1">
          ⚠️ Need immediate help?
        </div>
        <div className="text-ink-200 text-[11px] leading-relaxed">
          Call or text <span className="font-bold text-white">988</span> (US) or visit{' '}
          <a className="underline text-amber-200" href="https://findahelpline.com" target="_blank" rel="noreferrer">
            findahelpline.com
          </a>
        </div>
      </div>

      <WinSheet open={winSheet} onClose={() => setWinSheet(false)} />
    </div>
  );
}

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function MiniStat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="glass rounded-2xl px-3 py-2.5 text-center">
      <div className="text-[9px] text-ink-400 uppercase tracking-widest">{label}</div>
      <div className={`font-display font-bold mt-0.5 ${small ? 'text-xs text-white' : 'text-xl gradient-text'}`}>
        {value}
      </div>
    </div>
  );
}
