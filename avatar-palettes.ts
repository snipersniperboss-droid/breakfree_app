// Compact avatar for chat lists, attendee tiles, member rosters.
import type { Theme } from '../data/items';
import { stageFromDays } from '../state/avatar';
import { THEMED_PALETTES } from '../data/avatar-palettes';

export function AvatarBubble({
  days,
  theme,
  size = 36,
  online,
  ring,
}: {
  days: number;
  theme: Theme;
  size?: number;
  online?: boolean;
  ring?: string; // ring color override
}) {
  const stage = stageFromDays(days);
  const palette = (THEMED_PALETTES[theme] ?? THEMED_PALETTES.sage)[stage];
  return (
    <div className="relative inline-block flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 60 60" width={size} height={size}>
        <defs>
          <radialGradient id={`bub-${theme}-${stage}`} cx="40%" cy="30%" r="80%">
            <stop offset="0%" stopColor={palette.skinHighlight} />
            <stop offset="50%" stopColor={palette.skin} />
            <stop offset="100%" stopColor={palette.skinDeep} />
          </radialGradient>
          <linearGradient id={`bub-h-${theme}-${stage}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.hairHighlight} />
            <stop offset="100%" stopColor={palette.hair} />
          </linearGradient>
        </defs>
        {/* Background */}
        <circle cx="30" cy="30" r="30" fill={palette.bgTop} />
        {/* Hair back */}
        <path d="M 14 28 Q 12 14 22 12 Q 30 8 38 12 Q 48 14 46 28 Q 46 32 44 32 L 16 32 Q 14 32 14 28 Z" fill={`url(#bub-h-${theme}-${stage})`} />
        {/* Face */}
        <ellipse cx="30" cy="32" rx="13" ry="14" fill={`url(#bub-${theme}-${stage})`} />
        {/* Eyes */}
        <ellipse cx="25" cy="32" rx="1.6" ry="1.8" fill="#fff" />
        <ellipse cx="35" cy="32" rx="1.6" ry="1.8" fill="#fff" />
        <circle cx="25" cy="32.5" r="0.8" fill={palette.eyeDeep} />
        <circle cx="35" cy="32.5" r="0.8" fill={palette.eyeDeep} />
        {/* Smile */}
        <path d="M 26 39 Q 30 41 34 39" stroke={palette.hair} strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* Hair front */}
        <path d="M 16 24 Q 22 14 30 14 Q 38 14 44 24 Q 40 18 30 18 Q 22 18 16 24 Z" fill={`url(#bub-h-${theme}-${stage})`} />
      </svg>
      {online !== undefined && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2 border-ink-900"
          style={{
            width: size * 0.28,
            height: size * 0.28,
            background: online ? '#43c486' : '#7c8499',
            boxShadow: online ? '0 0 8px rgba(67,196,134,0.6)' : 'none',
          }}
        />
      )}
      {ring && (
        <span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: `0 0 0 2px ${ring}` }}
        />
      )}
    </div>
  );
}
