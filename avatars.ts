// Photorealistic preset avatar renderer.
// Replaces the SVG <Avatar> in most contexts.

import { getAvatar } from '../data/avatars';
import type { SobrietyStage } from '../state/avatar';
import { emotionForMood, type Emotion } from './Avatar';

interface Props {
  avatarId: string | null | undefined;
  stage: SobrietyStage;
  mood?: number | null;
  size?: number;
  showLabel?: boolean;
  showStage?: boolean;
  className?: string;
}

// Mood → CSS filter map (preserves the realistic look while still expressing state)
const moodFilters: Record<Emotion, string> = {
  joyful: 'brightness(1.05) saturate(1.12) drop-shadow(0 0 24px rgba(255,210,140,0.18))',
  content: 'brightness(1.0) saturate(1.0)',
  neutral: 'brightness(0.97) saturate(0.9)',
  tired: 'brightness(0.86) saturate(0.7) contrast(0.95)',
  sad: 'brightness(0.78) saturate(0.55) contrast(0.95) sepia(0.08) hue-rotate(-10deg)',
  focused: 'brightness(0.98) saturate(0.95) contrast(1.05)',
};

const stageGlow: Record<SobrietyStage, string> = {
  0: 'transparent',
  1: 'rgba(155, 231, 197, 0.12)',
  2: 'rgba(155, 231, 197, 0.18)',
  3: 'rgba(180, 200, 255, 0.22)',
  4: 'rgba(255, 215, 150, 0.28)',
  5: 'rgba(255, 230, 180, 0.38)',
};

const STAGE_NAMES = ['Awakening', 'Rising', 'Rooted', 'Growing', 'Blooming', 'Radiant'];

export function Avatar({ avatarId, stage, mood, size = 320, showLabel = true, showStage = true, className = '' }: Props) {
  const preset = getAvatar(avatarId);
  const emotion = emotionForMood(mood, stage);
  const filter = moodFilters[emotion];
  const glow = stageGlow[stage];

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{ width: size, height: size * 1.15 }}
      >
        {/* Stage glow backdrop */}
        {stage >= 1 && (
          <div
            className="absolute inset-0 pointer-events-none animate-breathe"
            style={{ background: `radial-gradient(circle at 50% 35%, ${glow} 0%, transparent 70%)` }}
          />
        )}

        {/* The actual portrait image */}
        <img
          src={preset.image}
          alt={preset.label}
          className="relative w-full h-full object-cover animate-soft-breathe"
          style={{ filter, transition: 'filter 0.6s ease' }}
          loading="eager"
          draggable={false}
        />

        {/* Subtle vignette that deepens with stage */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,${0.1 + stage * 0.05}) 100%)`,
          }}
        />

        {/* Stage 5: sparkles overlay */}
        {stage === 5 && <Sparkles />}
      </div>

      {showLabel && showStage && (
        <div className="mt-2 text-center">
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-semibold">
            Stage {stage + 1} · {preset.label}
          </div>
          <div className="font-display text-lg font-bold text-white mt-0.5">
            {STAGE_NAMES[stage]}
          </div>
        </div>
      )}
    </div>
  );
}

// A small face-only crop version (used in Coach header, chat lists, etc.)
export function AvatarFace({
  avatarId, size = 80, mood, stage = 2,
}: {
  avatarId: string | null | undefined;
  size?: number;
  mood?: number | null;
  stage?: SobrietyStage;
}) {
  const preset = getAvatar(avatarId);
  const emotion = emotionForMood(mood, stage);
  const filter = moodFilters[emotion];

  return (
    <div
      className="relative rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/10"
      style={{ width: size, height: size }}
    >
      <img
        src={preset.image}
        alt={preset.label}
        className="w-full h-full object-cover"
        style={{ filter, objectPosition: '50% 28%' }}
        draggable={false}
      />
    </div>
  );
}

function Sparkles() {
  return (
    <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 200 230">
      {[...Array(8)].map((_, i) => {
        const x = 20 + (i * 23) % 170;
        const y = 15 + ((i * 31) % 200);
        return (
          <path
            key={i}
            d="M0,-5 L1.2,-1.2 L5,0 L1.2,1.2 L0,5 L-1.2,1.2 L-5,0 L-1.2,-1.2 Z"
            fill="#fff7d6"
            opacity="0.85"
            transform={`translate(${x} ${y})`}
          >
            <animateTransform attributeName="transform" type="rotate" from={`0 ${x} ${y}`} to={`360 ${x} ${y}`} dur={`${4 + (i % 3)}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;1;0.2" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
          </path>
        );
      })}
    </svg>
  );
}
