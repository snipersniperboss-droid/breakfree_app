import { useApp } from '../state/store';
import { Avatar } from '../components/AvatarImage';
import { STAGE_THRESHOLDS } from '../state/avatar';
import { unlockedItems } from '../data/items';

export default function AvatarDetail() {
  const { days, stage, state, reset } = useApp();
  const profile = state.profile!;
  const theme = profile.theme;
  const myItems = unlockedItems(theme, stage);
  const allStages: Array<0 | 1 | 2 | 3 | 4 | 5> = [0, 1, 2, 3, 4, 5];

  return (
    <div className="app-bg min-h-full pb-28 px-4 pt-5">
      <h1 className="font-display text-2xl font-bold text-white mb-1">Your avatar</h1>
      <p className="text-ink-400 text-sm mb-5">
        Day {days} · Stage {stage + 1} of 6 · {profile.theme} path
      </p>

      {/* Current avatar large */}
      <div className="glass-strong rounded-3xl p-4 mb-5 flex flex-col items-center">
        <Avatar avatarId={profile.avatarId} stage={stage} size={300} />
      </div>

      {/* Items gallery */}
      <div className="mb-6">
        <div className="text-xs text-ink-400 uppercase tracking-widest mb-3 px-1">
          Your collection ({myItems.length})
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {myItems.map((item) => (
            <div
              key={item.id}
              className="glass rounded-2xl p-3 text-center"
            >
              <div className="text-2xl mb-1">
                {item.slot === 'crown' && '👑'}
                {item.slot === 'armor' && '🛡️'}
                {item.slot === 'wings' && (theme === 'warrior' ? '🜲' : '🪽')}
                {item.slot === 'amulet' && '🔮'}
                {item.slot === 'aura' && '✨'}
              </div>
              <div className="text-[10px] font-semibold text-white leading-tight">
                {item.name}
              </div>
              <div className="text-[9px] text-ink-400 mt-0.5">Day {STAGE_THRESHOLDS[item.stage].day}+</div>
            </div>
          ))}
        </div>
      </div>

      {/* Evolution timeline */}
      <div className="text-xs text-ink-400 uppercase tracking-widest mb-3 px-1">
        Evolution timeline
      </div>
      <div className="space-y-3">
        {allStages.map((s) => {
          const info = STAGE_THRESHOLDS[s];
          const reached = days >= info.day;
          const isCurrent = s === stage;
          return (
            <div
              key={s}
              className={`rounded-3xl p-3 flex items-center gap-3 transition ${
                isCurrent
                  ? 'bg-sage-500/15 border-2 border-sage-500/50 shadow-glow'
                  : reached
                  ? 'glass'
                  : 'glass opacity-50'
              }`}
            >
              <div className="w-20 h-24 flex-shrink-0 flex items-center justify-center">
                <Avatar avatarId={profile.avatarId} stage={s} size={76} showLabel={false} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-[10px] text-ink-400 uppercase tracking-widest">
                    Day {info.day}+
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] uppercase tracking-widest text-sage-300 font-bold">
                      · You are here
                    </span>
                  )}
                  {!reached && (
                    <span className="text-[9px] uppercase tracking-widest text-ink-400">
                      · {info.day - days} days to go
                    </span>
                  )}
                </div>
                <div className="font-display text-base font-bold text-white">{info.name}</div>
                <div className="text-xs text-ink-400">{info.tagline}</div>
              </div>
              {reached && !isCurrent && (
                <span className="text-sage-300 text-xl flex-shrink-0">✓</span>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          if (confirm('Reset everything? This deletes your data.')) {
            reset();
            window.location.reload();
          }
        }}
        className="mt-8 text-xs text-ink-400 underline hover:text-ink-200 mx-auto block"
      >
        Reset all data
      </button>
    </div>
  );
}
