// Realistic-feel avatar — focused on lifelike quality.
// Anatomy, layered skin, detailed eyes, real hair strands, subtle motion.

import { useEffect, useState } from 'react';
import type { SobrietyStage } from '../state/avatar';
import type { Theme, ItemDef } from '../data/items';
import { unlockedItems } from '../data/items';
import { THEMED_PALETTES, type Palette, defaultPalette } from '../data/avatar-palettes';

// ---------- Emotion model ----------

export type Emotion = 'joyful' | 'content' | 'neutral' | 'tired' | 'sad' | 'focused';

export function emotionForMood(mood?: number | null, stage?: number): Emotion {
  if (mood == null) {
    if (stage === 0) return 'tired';
    if (stage === undefined || stage <= 1) return 'content';
    return 'content';
  }
  if (mood >= 5) return 'joyful';
  if (mood >= 4) return 'content';
  if (mood === 3) return stage === 0 ? 'tired' : 'neutral';
  if (mood === 2) return 'tired';
  return 'sad';
}

function expression(emotion: Emotion) {
  switch (emotion) {
    case 'joyful':
      return { mouthCurve: 12, browLift: -2, eyeOpenness: 0.95, cheekGlow: 0.55, eyeCrinkle: 0.85 };
    case 'content':
      return { mouthCurve: 6, browLift: 0, eyeOpenness: 1.0, cheekGlow: 0.35, eyeCrinkle: 0.35 };
    case 'neutral':
      return { mouthCurve: 2, browLift: 0, eyeOpenness: 1.0, cheekGlow: 0.2, eyeCrinkle: 0 };
    case 'tired':
      return { mouthCurve: -3, browLift: 3, eyeOpenness: 0.75, cheekGlow: 0.12, eyeCrinkle: 0 };
    case 'sad':
      return { mouthCurve: -8, browLift: 5, eyeOpenness: 0.85, cheekGlow: 0.08, eyeCrinkle: 0 };
    case 'focused':
      return { mouthCurve: 1, browLift: -3, eyeOpenness: 0.92, cheekGlow: 0.18, eyeCrinkle: 0.2 };
  }
}

// ---------- Animation hooks ----------

// Realistic blink: 230ms with possible double-blink
function useBlink() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      if (!mounted) return;
      const double = Math.random() < 0.18;
      let t = 0;
      const tick = () => {
        if (!mounted) return;
        t += 16;
        if (t <= 90) setPhase(t / 90);
        else if (t <= 130) setPhase(1);
        else if (t <= 230) setPhase(1 - (t - 130) / 100);
        else {
          setPhase(0);
          if (double) {
            setTimeout(() => {
              if (!mounted) return;
              let t2 = 0;
              const tick2 = () => {
                if (!mounted) return;
                t2 += 16;
                if (t2 <= 80) setPhase(t2 / 80);
                else if (t2 <= 120) setPhase(1);
                else if (t2 <= 200) setPhase(1 - (t2 - 120) / 80);
                else {
                  setPhase(0);
                  scheduleNext();
                }
              };
              tick2();
            }, 80);
          } else scheduleNext();
          return;
        }
        timer = setTimeout(tick, 16);
      };
      tick();
    };
    const scheduleNext = () => {
      timer = setTimeout(loop, 2500 + Math.random() * 3000);
    };
    scheduleNext();
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);
  return phase;
}

// Look around with eye-lead then head-follow
function useLookAround() {
  const [s, setS] = useState({ gazeX: 0, gazeY: 0, headYaw: 0, headPitch: 0, headRoll: 0 });
  useEffect(() => {
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      const dwell = 1800 + Math.random() * 2400;
      const targetGazeX = (Math.random() - 0.5) * 5;
      const targetGazeY = (Math.random() - 0.5) * 3;
      const targetYaw = (Math.random() - 0.5) * 3;
      const targetPitch = (Math.random() - 0.5) * 1.5;
      const targetRoll = (Math.random() - 0.5) * 2;
      setS((cur) => ({
        gazeX: targetGazeX,
        gazeY: targetGazeY,
        headYaw: cur.headYaw,
        headPitch: cur.headPitch,
        headRoll: cur.headRoll,
      }));
      setTimeout(() => {
        if (!mounted) return;
        setS((cur) => ({ ...cur, headYaw: targetYaw, headPitch: targetPitch, headRoll: targetRoll }));
      }, 220);
      setTimeout(tick, dwell);
    };
    const start = setTimeout(tick, 800);
    return () => {
      mounted = false;
      clearTimeout(start);
    };
  }, []);
  return s;
}

// Subtle saccades — small eye flicks every 1.5-3s
function useSaccades() {
  const [s, setS] = useState({ dx: 0, dy: 0 });
  useEffect(() => {
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      const dx = (Math.random() - 0.5) * 1.5;
      const dy = (Math.random() - 0.5) * 0.8;
      setS({ dx, dy });
      setTimeout(() => mounted && setS({ dx: 0, dy: 0 }), 200);
      setTimeout(tick, 1500 + Math.random() * 1800);
    };
    const start = setTimeout(tick, 1000);
    return () => {
      mounted = false;
      clearTimeout(start);
    };
  }, []);
  return s;
}

// Smooth breathing
function useBreath() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let mounted = true;
    let last = performance.now();
    const period = 4400;
    const tick = (now: number) => {
      if (!mounted) return;
      const dt = now - last;
      last = now;
      setT((x) => (x + dt / period) % 1);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => {
      mounted = false;
    };
  }, []);
  return t;
}

// ---------- Full Avatar ----------

type Props = {
  stage: SobrietyStage;
  days: number;
  theme: Theme;
  mood?: number | null;
  size?: number;
  showLabel?: boolean;
};

export function Avatar({ stage, days, theme, mood, size = 380, showLabel = true }: Props) {
  const items = unlockedItems(theme, stage);
  const palette = (THEMED_PALETTES[theme] ?? defaultPalette)[stage];
  const itemsBySlot = groupBySlot(items);
  const blink = useBlink();
  const look = useLookAround();
  const saccades = useSaccades();
  const breath = useBreath();
  const emotion = emotionForMood(mood, stage);
  const expr = expression(emotion);
  const stageName = ['Awakening', 'Rising', 'Rooted', 'Growing', 'Blooming', 'Radiant'][stage];

  const breathScale = 1 + Math.sin(breath * Math.PI * 2) * 0.012;
  const shoulderLift = Math.sin(breath * Math.PI * 2) * 1.5;
  const bodySway = Math.sin(breath * Math.PI * 2 + 0.5) * 0.4;

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative" style={{ width: size, height: size * 1.35 }}>
        {itemsBySlot.aura && <AuraBackdrop palette={palette} />}

        {stage >= 2 && <HaloDisc palette={palette} stage={stage} />}

        <svg
          viewBox="0 0 320 432"
          className="relative w-full h-full drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
        >
          <defs>
            {/* Skin gradient — subsurface simulation: warm core, cool shadow */}
            <radialGradient id="avSkin" cx="42%" cy="32%" r="75%">
              <stop offset="0%" stopColor={palette.skinHighlight} />
              <stop offset="30%" stopColor={palette.skin} />
              <stop offset="65%" stopColor={palette.skinMid} />
              <stop offset="92%" stopColor={palette.skinDeep} />
            </radialGradient>
            {/* Skin warm subsurface for cheeks / lips */}
            <radialGradient id="avWarm" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={palette.lipDeep} stopOpacity="0.4" />
              <stop offset="60%" stopColor={palette.lipDeep} stopOpacity="0.1" />
              <stop offset="100%" stopColor={palette.lipDeep} stopOpacity="0" />
            </radialGradient>
            {/* Body gradient */}
            <linearGradient id="avBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={palette.body} />
              <stop offset="100%" stopColor={palette.bodyDeep} />
            </linearGradient>
            {/* Hair with shine */}
            <linearGradient id="avHair" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={palette.hairHighlight} />
              <stop offset="40%" stopColor={palette.hair} />
              <stop offset="100%" stopColor={palette.hairDeep} />
            </linearGradient>
            {/* Iris — multi-ring */}
            <radialGradient id="avIris" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor={palette.eye} />
              <stop offset="50%" stopColor={palette.eye} />
              <stop offset="80%" stopColor={palette.eyeDeep} />
              <stop offset="100%" stopColor="#000" />
            </radialGradient>
            {/* Halo */}
            <radialGradient id="avHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={palette.halo} stopOpacity="0.9" />
              <stop offset="100%" stopColor={palette.halo} stopOpacity="0" />
            </radialGradient>
            {/* Armor */}
            <linearGradient id="avArmor" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={palette.accent1} />
              <stop offset="100%" stopColor={palette.accent2} />
            </linearGradient>
            <linearGradient id="avArmorSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* WINGS behind body */}
          {itemsBySlot.wings && (
            <g style={{ transformOrigin: '160px 220px' }} className={stage >= 3 ? 'animate-wing-flap' : ''}>
              <Wings item={itemsBySlot.wings} palette={palette} />
            </g>
          )}

          {/* Aura particles */}
          {stage >= 4 && <AuraParticles palette={palette} count={stage === 5 ? 14 : 9} />}

          {/* Cape */}
          {itemsBySlot.wings?.theme === 'warrior' && <Cape palette={palette} />}

          {/* BODY (with breathing + sway) */}
          <g
            transform={`translate(${bodySway}, ${-shoulderLift}) scale(${breathScale}, ${1 + (breathScale - 1) * 1.4})`}
            style={{ transformOrigin: '160px 260px' }}
          >
            <Legs palette={palette} />
            <Torso palette={palette} />
            <Arms palette={palette} breath={breath} />
            {itemsBySlot.armor && <ArmorPlate item={itemsBySlot.armor} palette={palette} />}
            {itemsBySlot.amulet && <Amulet item={itemsBySlot.amulet} palette={palette} />}
            {/* Neck — proper anatomy with trapezius */}
            <Neck palette={palette} />
          </g>

          {/* HEAD — independent look */}
          <g
            transform={`translate(${look.headYaw * 0.3}, ${-shoulderLift * 0.3}) rotate(${look.headRoll} 160 110)`}
            style={{ transformOrigin: '160px 110px' }}
          >
            <g transform={`rotate(${look.headYaw} 160 110) translate(0, ${look.headPitch * 0.5})`}>
              <HairBack palette={palette} />
              <Ears palette={palette} />
              <Face palette={palette} />
              {/* Warm subsurface layer for cheeks */}
              <CheekSubsurface palette={palette} intensity={expr.cheekGlow} />
              <NoseDetailed palette={palette} />
              <Brows palette={palette} lift={expr.browLift} />
              <g transform={`translate(${look.gazeX + saccades.dx}, ${look.gazeY + saccades.dy})`}>
                <RealEyes
                  blink={blink}
                  openness={expr.eyeOpenness}
                  crinkle={expr.eyeCrinkle}
                  palette={palette}
                />
              </g>
              <Mouth palette={palette} emotion={emotion} stage={stage} />
              <HairFront palette={palette} />
            </g>
          </g>

          {/* Crown / headwear */}
          {itemsBySlot.crown && (
            <g transform={`rotate(${look.headRoll} 160 110)`}>
              <Crown item={itemsBySlot.crown} palette={palette} />
            </g>
          )}

          {/* Shackles */}
          {stage === 0 && <Shackles palette={palette} />}
          {stage === 1 && <Shackles palette={palette} faded />}
        </svg>

        {stage === 5 && <Sparkles palette={palette} />}
      </div>

      {showLabel && (
        <div className="mt-1 text-center">
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-semibold">
            Stage {stage + 1} · Day {days}
          </div>
          <div className="font-display text-lg font-bold text-white mt-0.5">{stageName}</div>
          {mood != null && (
            <div className="text-[10px] text-ink-300 mt-0.5 italic">
              {emotionLabel(emotion)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function emotionLabel(e: Emotion): string {
  switch (e) {
    case 'joyful': return 'feeling great today ✨';
    case 'content': return 'in a good place';
    case 'neutral': return 'steady';
    case 'tired': return 'a little worn';
    case 'sad': return 'holding space for you';
    case 'focused': return 'locked in';
  }
}

// ---------- Face parts (the new, detailed ones) ----------

function Face({ palette: p }: { palette: Palette }) {
  return (
    <g>
      {/* Face shape — egg/oval, defined jaw */}
      <path
        d="M 110 70
           Q 110 56 124 52
           Q 140 46 160 46
           Q 180 46 196 52
           Q 210 56 210 70
           Q 218 88 218 108
           Q 218 130 212 146
           Q 204 162 192 172
           Q 178 180 160 180
           Q 142 180 128 172
           Q 116 162 108 146
           Q 102 130 102 108
           Q 102 88 110 70 Z"
        fill="url(#avSkin)"
      />
      {/* Forehead highlight */}
      <ellipse cx="148" cy="68" rx="22" ry="7" fill={p.skinHighlight} opacity="0.45" />
      {/* Bridge of nose highlight (subtle vertical) */}
      <path
        d="M 156 70 Q 160 78 164 70"
        stroke={p.skinHighlight}
        strokeWidth="1.5"
        fill="none"
        opacity="0.35"
      />
      {/* Jawline shadow */}
      <path
        d="M 110 130 Q 110 158 130 175"
        stroke={p.skinDeep}
        strokeWidth="1.8"
        fill="none"
        opacity="0.32"
      />
      <path
        d="M 210 130 Q 210 158 190 175"
        stroke={p.skinDeep}
        strokeWidth="1.8"
        fill="none"
        opacity="0.32"
      />
      {/* Chin shadow */}
      <path
        d="M 145 175 Q 160 182 175 175"
        stroke={p.skinDeep}
        strokeWidth="1.5"
        fill="none"
        opacity="0.35"
      />
      {/* Cheekbone highlight (subtle) */}
      <ellipse cx="124" cy="118" rx="8" ry="4" fill={p.skinHighlight} opacity="0.3" />
      <ellipse cx="196" cy="118" rx="8" ry="4" fill={p.skinHighlight} opacity="0.3" />
    </g>
  );
}

function CheekSubsurface({ palette: p, intensity }: { palette: Palette; intensity: number }) {
  if (intensity <= 0.05) return null;
  return (
    <g>
      <ellipse cx="124" cy="128" rx="14" ry="8" fill={p.lipDeep} opacity={intensity * 0.6} />
      <ellipse cx="196" cy="128" rx="14" ry="8" fill={p.lipDeep} opacity={intensity * 0.6} />
    </g>
  );
}

function HairBack(_: { palette: Palette }) {
  // Volume behind head
  return (
    <g>
      <path
        d="M 100 90
           Q 96 50 130 40
           Q 160 32 190 40
           Q 224 50 220 90
           Q 226 110 220 125
           Q 210 140 196 148
           L 124 148
           Q 110 140 100 125
           Q 94 110 100 90 Z"
        fill="url(#avHair)"
        opacity="0.95"
      />
    </g>
  );
}

function HairFront({ palette: p }: { palette: Palette }) {
  // Fringe + side strands with individual hair strokes
  return (
    <g>
      {/* Main fringe */}
      <path
        d="M 106 78
           Q 112 50 134 44
           Q 150 38 168 40
           Q 186 44 200 52
           Q 212 60 214 78
           Q 212 70 206 65
           Q 196 56 184 54
           Q 168 52 152 56
           Q 138 60 124 68
           Q 114 74 106 78 Z"
        fill="url(#avHair)"
      />
      {/* Individual hair strokes for texture */}
      {[
        [118, 62], [128, 54], [140, 48], [152, 46], [164, 46], [176, 48], [188, 52], [200, 58],
        [122, 72], [136, 64], [148, 58], [160, 56], [172, 56], [184, 60], [196, 66],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M ${x} ${y} q -2 4 -1 8`}
          stroke={p.hairHighlight}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
          strokeLinecap="round"
        />
      ))}
      {/* Side strand left */}
      <path
        d="M 102 78 Q 96 100 102 130 Q 100 110 104 92 Z"
        fill={p.hair}
        opacity="0.9"
      />
      <path
        d="M 104 95 Q 102 110 105 125"
        stroke={p.hairHighlight}
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      {/* Side strand right */}
      <path
        d="M 218 78 Q 224 100 218 130 Q 220 110 216 92 Z"
        fill={p.hair}
        opacity="0.9"
      />
      <path
        d="M 216 95 Q 218 110 215 125"
        stroke={p.hairHighlight}
        strokeWidth="0.8"
        fill="none"
        opacity="0.5"
      />
      {/* Top highlight strand */}
      <path
        d="M 140 50 Q 160 44 180 48"
        stroke={p.hairHighlight}
        strokeWidth="2"
        fill="none"
        opacity="0.55"
        strokeLinecap="round"
      />
    </g>
  );
}

function Ears({ palette: p }: { palette: Palette }) {
  return (
    <g>
      {/* Left ear */}
      <g>
        <path
          d="M 100 110 Q 92 110 90 122 Q 90 134 96 140 Q 100 144 102 138 L 102 116 Z"
          fill="url(#avSkin)"
        />
        <path
          d="M 95 122 Q 94 130 98 138"
          stroke={p.skinDeep}
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        {/* inner ear shadow */}
        <path
          d="M 98 124 Q 96 130 99 136"
          stroke={p.skinDeep}
          strokeWidth="1.2"
          fill="none"
          opacity="0.45"
        />
      </g>
      {/* Right ear */}
      <g>
        <path
          d="M 220 110 Q 228 110 230 122 Q 230 134 224 140 Q 220 144 218 138 L 218 116 Z"
          fill="url(#avSkin)"
        />
        <path
          d="M 225 122 Q 226 130 222 138"
          stroke={p.skinDeep}
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 222 124 Q 224 130 221 136"
          stroke={p.skinDeep}
          strokeWidth="1.2"
          fill="none"
          opacity="0.45"
        />
      </g>
    </g>
  );
}

function NoseDetailed({ palette: p }: { palette: Palette }) {
  return (
    <g>
      {/* Bridge shadow */}
      <path
        d="M 158 78 Q 156 100 153 118"
        stroke={p.skinDeep}
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      {/* Bridge highlight (right side - light from upper-right) */}
      <path
        d="M 162 78 Q 164 100 167 118"
        stroke={p.skinHighlight}
        strokeWidth="1.2"
        fill="none"
        opacity="0.6"
      />
      {/* Tip */}
      <ellipse cx="160" cy="122" rx="6" ry="4" fill={p.skinMid} opacity="0.55" />
      <ellipse cx="161" cy="121" rx="2.5" ry="1.5" fill={p.skinHighlight} opacity="0.85" />
      {/* Nostrils */}
      <ellipse cx="156" cy="125" rx="2" ry="1.2" fill={p.skinDeep} opacity="0.7" />
      <ellipse cx="164" cy="125" rx="2" ry="1.2" fill={p.skinDeep} opacity="0.7" />
      {/* Underside shadow */}
      <path
        d="M 153 128 Q 160 130 167 128"
        stroke={p.skinDeep}
        strokeWidth="1.2"
        fill="none"
        opacity="0.4"
      />
    </g>
  );
}

function Brows({ palette: p, lift }: { palette: Palette; lift: number }) {
  // Eyebrows with individual hair strokes + expressiveness via lift
  return (
    <g>
      {/* Left brow — slight asymmetric angle for naturalism */}
      <g transform={`translate(0, ${-lift})`}>
        <path
          d="M 124 92 Q 138 86 152 92"
          stroke={p.hair}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {/* Hair strokes */}
        {[124, 130, 136, 142, 148].map((x, i) => (
          <path
            key={`l${i}`}
            d={`M ${x} ${92 + i * 0.5} l 2 -${3 - i * 0.3}`}
            stroke={p.hairDeep}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />
        ))}
        {/* subtle highlight */}
        <path
          d="M 130 90 Q 140 86 150 90"
          stroke={p.hairHighlight}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
      </g>
      {/* Right brow */}
      <g transform={`translate(0, ${-lift * 0.7})`}>
        <path
          d="M 168 92 Q 182 86 196 92"
          stroke={p.hair}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        {[172, 178, 184, 190].map((x, i) => (
          <path
            key={`r${i}`}
            d={`M ${x} ${92 + i * 0.4} l 2 -${3 - i * 0.3}`}
            stroke={p.hairDeep}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />
        ))}
        <path
          d="M 174 90 Q 184 86 194 90"
          stroke={p.hairHighlight}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
      </g>
    </g>
  );
}

function RealEyes({
  blink, openness, crinkle, palette: p,
}: {
  blink: number; openness: number; crinkle: number; palette: Palette;
}) {
  // Eyes are the focal point — most detail here
  const lidScale = blink === 0 ? 1 : blink <= 1 ? 1 - blink : blink - 1;
  const h = 6 * openness;

  return (
    <g>
      {/* Eye socket subtle shadow */}
      <ellipse cx="140" cy="108" rx="13" ry={h + 1.5} fill={p.skinDeep} opacity="0.18" />

      {/* LEFT EYE */}
      <g>
        {/* Eye white (sclera) */}
        <ellipse cx="140" cy="110" rx="9" ry={h} fill="#fcfaf6" />
        {/* Subtle warm tint at corners */}
        <path
          d="M 132 110 Q 131 113 132 115"
          stroke={p.lipDeep}
          strokeWidth="0.8"
          fill="none"
          opacity="0.25"
        />
        {blink < 0.9 && (
          <g style={{ opacity: 1 - lidScale }}>
            {/* Iris */}
            <circle cx="140" cy="110.5" r="3.6" fill="url(#avIris)" />
            {/* Iris ring detail */}
            <circle cx="140" cy="110.5" r="3.6" fill="none" stroke={p.eyeDeep} strokeWidth="0.5" opacity="0.5" />
            {/* Inner ring */}
            <circle cx="140" cy="110.5" r="2.2" fill="none" stroke={p.eye} strokeWidth="0.4" opacity="0.6" />
            {/* Pupil */}
            <circle cx="140" cy="110.5" r="1.4" fill="#000" />
            {/* Catchlight (main) — upper right */}
            <ellipse cx="142" cy="108.5" rx="1.4" ry="1.1" fill="#ffffff" />
            {/* Catchlight (small, lower) */}
            <ellipse cx="139" cy="112" rx="0.7" ry="0.5" fill="#ffffff" opacity="0.7" />
            {/* Lower crinkle */}
            {crinkle > 0 && (
              <path
                d={`M 130 ${110 + h * 0.55} Q 140 ${110 + h * 0.55 + crinkle * 1.6} 150 ${110 + h * 0.55}`}
                stroke={p.skinDeep}
                strokeWidth="1"
                fill="none"
                opacity={crinkle * 0.7}
              />
            )}
          </g>
        )}
        {/* Upper eyelid */}
        <path
          d={`M 130 110 Q 140 ${110 - 3.5 - lidScale * (h + 4)} 150 110`}
          fill="url(#avSkin)"
          opacity={0.92 + lidScale * 0.08}
        />
        {/* Upper eyelash line */}
        <path
          d="M 130 110 Q 140 108.5 150 110"
          stroke="#1a1208"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          opacity={1 - lidScale * 0.65}
        />
        {/* Individual upper eyelashes */}
        {[
          [131, 109.5, -3, -2],
          [134, 109, -1, -3],
          [137, 108.5, 0, -3.5],
          [140, 108, 0, -3.5],
          [143, 108.5, 1, -3.5],
          [146, 109, 2, -3],
          [149, 109.5, 3, -2],
        ].map(([x, y, dx, dy], i) => (
          <path
            key={`le${i}`}
            d={`M ${x} ${y} l ${dx} ${dy}`}
            stroke="#1a1208"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity={0.85 - lidScale * 0.5}
          />
        ))}
        {/* Lower lash hint */}
        <path
          d="M 131 112 Q 140 113 149 112"
          stroke={p.skinDeep}
          strokeWidth="0.8"
          fill="none"
          opacity="0.45"
        />
        {/* Eye crease */}
        <path
          d="M 130 104 Q 140 102 150 104"
          stroke={p.skinDeep}
          strokeWidth="0.7"
          fill="none"
          opacity="0.4"
        />
      </g>

      {/* RIGHT EYE — mirrored */}
      <g>
        <ellipse cx="180" cy="108" rx="13" ry={h + 1.5} fill={p.skinDeep} opacity="0.18" />
        <g>
          <ellipse cx="180" cy="110" rx="9" ry={h} fill="#fcfaf6" />
          <path
            d="M 188 110 Q 189 113 188 115"
            stroke={p.lipDeep}
            strokeWidth="0.8"
            fill="none"
            opacity="0.25"
          />
          {blink < 0.9 && (
            <g style={{ opacity: 1 - lidScale }}>
              <circle cx="180" cy="110.5" r="3.6" fill="url(#avIris)" />
              <circle cx="180" cy="110.5" r="3.6" fill="none" stroke={p.eyeDeep} strokeWidth="0.5" opacity="0.5" />
              <circle cx="180" cy="110.5" r="2.2" fill="none" stroke={p.eye} strokeWidth="0.4" opacity="0.6" />
              <circle cx="180" cy="110.5" r="1.4" fill="#000" />
              <ellipse cx="182" cy="108.5" rx="1.4" ry="1.1" fill="#ffffff" />
              <ellipse cx="179" cy="112" rx="0.7" ry="0.5" fill="#ffffff" opacity="0.7" />
              {crinkle > 0 && (
                <path
                  d={`M 170 ${110 + h * 0.55} Q 180 ${110 + h * 0.55 + crinkle * 1.6} 190 ${110 + h * 0.55}`}
                  stroke={p.skinDeep}
                  strokeWidth="1"
                  fill="none"
                  opacity={crinkle * 0.7}
                />
              )}
            </g>
          )}
          <path
            d={`M 170 110 Q 180 ${110 - 3.5 - lidScale * (h + 4)} 190 110`}
            fill="url(#avSkin)"
            opacity={0.92 + lidScale * 0.08}
          />
          <path
            d="M 170 110 Q 180 108.5 190 110"
            stroke="#1a1208"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            opacity={1 - lidScale * 0.65}
          />
          {[
            [171, 109.5, -3, -2],
            [174, 109, -2, -3],
            [177, 108.5, -1, -3.5],
            [180, 108, 0, -3.5],
            [183, 108.5, 1, -3.5],
            [186, 109, 1, -3],
            [189, 109.5, 2, -2],
          ].map(([x, y, dx, dy], i) => (
            <path
              key={`re${i}`}
              d={`M ${x} ${y} l ${dx} ${dy}`}
              stroke="#1a1208"
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity={0.85 - lidScale * 0.5}
            />
          ))}
          <path
            d="M 171 112 Q 180 113 189 112"
            stroke={p.skinDeep}
            strokeWidth="0.8"
            fill="none"
            opacity="0.45"
          />
          <path
            d="M 170 104 Q 180 102 190 104"
            stroke={p.skinDeep}
            strokeWidth="0.7"
            fill="none"
            opacity="0.4"
          />
        </g>
      </g>
    </g>
  );
}

function Mouth({ palette: p, emotion }: { palette: Palette; emotion: Emotion; stage?: number }) {
  const expr = expression(emotion);
  const y = 148;
  const asym = Math.sin(Date.now() / 800) * 0.3;
  const open = emotion === 'joyful' ? 0.6 : emotion === 'sad' ? 0.2 : 0;

  return (
    <g>
      {/* Philtrum (vertical line above upper lip) */}
      <path
        d="M 160 138 L 160 142"
        stroke={p.skinDeep}
        strokeWidth="1"
        opacity="0.35"
      />

      {/* Upper lip — cupid's bow (M-shape) */}
      <path
        d={`M 148 ${y - 1}
            Q 152 ${y - 4 + expr.mouthCurve * 0.1}
            156 ${y - 1.5}
            Q 160 ${y - 0.5}
            164 ${y - 1.5}
            Q 168 ${y - 4 + expr.mouthCurve * 0.1}
            172 ${y - 1}
            Q ${172 + asym} ${y + expr.mouthCurve}
            160 ${y + 3 + expr.mouthCurve}
            Q ${148 - asym} ${y + expr.mouthCurve}
            148 ${y - 1} Z`}
        fill={p.lip}
      />

      {/* Upper lip cupid's bow highlight */}
      <path
        d="M 158 144 Q 160 142 162 144"
        stroke={p.skinHighlight}
        strokeWidth="1"
        fill="none"
        opacity="0.6"
        strokeLinecap="round"
      />

      {/* Lower lip — fuller, with highlight */}
      <path
        d={`M 148 ${y + 2}
            Q 154 ${y + 8 + expr.mouthCurve * 0.3}
            160 ${y + 9 + expr.mouthCurve * 0.3}
            Q 166 ${y + 8 + expr.mouthCurve * 0.3}
            172 ${y + 2}
            Q 160 ${y + 4 + expr.mouthCurve * 0.5}
            148 ${y + 2} Z`}
        fill={p.lip}
        opacity="0.92"
      />

      {/* Lower lip highlight (sheen) */}
      <ellipse
        cx="160"
        cy={y + 6 + expr.mouthCurve * 0.3}
        rx="6"
        ry="1.4"
        fill={p.skinHighlight}
        opacity="0.5"
      />

      {/* Mouth opening if joyful */}
      {open > 0 && (
        <ellipse
          cx="160"
          cy={y + 3 + expr.mouthCurve * 0.4}
          rx="4.5"
          ry={open * 1.8}
          fill="#2a1010"
        />
      )}

      {/* Lip texture lines */}
      <path
        d={`M 152 ${y + 5} l 0 ${open > 0 ? 0 : 3}`}
        stroke={p.lipDeep}
        strokeWidth="0.5"
        opacity="0.4"
      />
      <path
        d={`M 168 ${y + 5} l 0 ${open > 0 ? 0 : 3}`}
        stroke={p.lipDeep}
        strokeWidth="0.5"
        opacity="0.4"
      />

      {/* Chin shadow */}
      <ellipse
        cx="160"
        cy={y + 12 + expr.mouthCurve * 0.4}
        rx="10"
        ry="2"
        fill={p.skinDeep}
        opacity={0.2 + (emotion === 'sad' ? 0.1 : 0)}
      />

      {/* Nasolabial fold hints (subtle) */}
      <path
        d="M 142 135 Q 146 145 150 148"
        stroke={p.skinDeep}
        strokeWidth="0.7"
        fill="none"
        opacity="0.2"
      />
      <path
        d="M 178 135 Q 174 145 170 148"
        stroke={p.skinDeep}
        strokeWidth="0.7"
        fill="none"
        opacity="0.2"
      />
    </g>
  );
}

function Neck({ palette: p }: { palette: Palette }) {
  return (
    <g>
      {/* Trapezius — wider at top, narrowing to base */}
      <path
        d="M 108 175 Q 110 168 122 165 L 198 165 Q 210 168 212 175 L 208 198 L 200 200 L 180 195 L 160 192 L 140 195 L 120 200 L 112 198 Z"
        fill="url(#avSkin)"
      />
      {/* Trapezius shadow */}
      <path
        d="M 122 168 Q 130 175 140 178"
        stroke={p.skinDeep}
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M 198 168 Q 190 175 180 178"
        stroke={p.skinDeep}
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />
      {/* Adam's apple hint */}
      <path
        d="M 158 178 Q 160 184 162 178"
        stroke={p.skinDeep}
        strokeWidth="1.2"
        fill="none"
        opacity="0.35"
      />
    </g>
  );
}

function Torso({ palette: p }: { palette: Palette }) {
  return (
    <g>
      {/* Chest/torso — proper anatomy */}
      <path
        d="M 116 195
           Q 114 200 114 208
           L 118 250
           Q 120 260 128 262
           L 132 262
           L 132 290
           L 188 290
           L 188 262
           L 192 262
           Q 200 260 202 250
           L 206 208
           Q 206 200 204 195
           L 188 192
           Q 180 198 160 198
           Q 140 198 132 192 Z"
        fill="url(#avBody)"
      />
      {/* Chest highlight */}
      <path
        d="M 130 210 Q 140 206 150 206"
        stroke={p.skinHighlight}
        strokeWidth="2.5"
        fill="none"
        opacity="0.35"
        strokeLinecap="round"
      />
      {/* Right side shadow */}
      <path
        d="M 202 208 L 198 248"
        stroke={p.bodyDeep}
        strokeWidth="3"
        fill="none"
        opacity="0.32"
      />
      {/* Center line */}
      <path
        d="M 160 200 L 160 285"
        stroke={p.bodyDeep}
        strokeWidth="1.2"
        fill="none"
        opacity="0.2"
      />
    </g>
  );
}

function Arms({ palette: p, breath }: { palette: Palette; breath: number }) {
  const sway = Math.sin(breath * Math.PI * 2 - 0.3) * 1.2;
  return (
    <g>
      {/* Left arm — shoulder → bicep → forearm → hand with fingers */}
      <g transform={`rotate(${sway} 122 200)`} style={{ transformOrigin: '122px 200px' }}>
        {/* Upper arm */}
        <path
          d="M 122 198
             Q 110 215 102 240
             Q 100 252 104 258
             L 112 258
             Q 118 252 120 240
             Q 124 218 128 202 Z"
          fill="url(#avBody)"
        />
        {/* Forearm */}
        <path
          d="M 102 258
             Q 96 270 94 282
             L 100 286
             Q 110 280 114 268
             L 112 258 Z"
          fill="url(#avBody)"
          opacity="0.95"
        />
        {/* Hand */}
        <ellipse cx="98" cy="290" rx="7" ry="8" fill={p.skin} />
        {/* Fingers */}
        <path d="M 93 296 L 92 300" stroke={p.skinDeep} strokeWidth="0.8" opacity="0.6" />
        <path d="M 96 297 L 95 301" stroke={p.skinDeep} strokeWidth="0.8" opacity="0.6" />
        <path d="M 99 297 L 99 301" stroke={p.skinDeep} strokeWidth="0.8" opacity="0.6" />
        <path d="M 102 296 L 103 299" stroke={p.skinDeep} strokeWidth="0.8" opacity="0.6" />
        {/* Thumb */}
        <ellipse cx="93" cy="287" rx="3" ry="4" fill={p.skin} transform="rotate(-25 93 287)" />
      </g>

      {/* Right arm */}
      <g transform={`rotate(${-sway} 198 200)`} style={{ transformOrigin: '198px 200px' }}>
        <path
          d="M 198 198
             Q 210 215 218 240
             Q 220 252 216 258
             L 208 258
             Q 202 252 200 240
             Q 196 218 192 202 Z"
          fill="url(#avBody)"
        />
        <path
          d="M 218 258
             Q 224 270 226 282
             L 220 286
             Q 210 280 206 268
             L 208 258 Z"
          fill="url(#avBody)"
          opacity="0.95"
        />
        <ellipse cx="222" cy="290" rx="7" ry="8" fill={p.skin} />
        <path d="M 218 296 L 218 300" stroke={p.skinDeep} strokeWidth="0.8" opacity="0.6" />
        <path d="M 221 297 L 222 301" stroke={p.skinDeep} strokeWidth="0.8" opacity="0.6" />
        <path d="M 224 297 L 225 301" stroke={p.skinDeep} strokeWidth="0.8" opacity="0.6" />
        <path d="M 227 296 L 228 299" stroke={p.skinDeep} strokeWidth="0.8" opacity="0.6" />
        <ellipse cx="227" cy="287" rx="3" ry="4" fill={p.skin} transform="rotate(25 227 287)" />
      </g>
    </g>
  );
}

function Legs({ palette: p }: { palette: Palette }) {
  return (
    <g>
      {/* Left leg */}
      <path
        d="M 138 285
           Q 134 320 132 360
           Q 132 372 138 374
           L 152 374
           Q 156 368 156 360
           Q 156 320 154 285 Z"
        fill="url(#avBody)"
      />
      <path
        d="M 138 300 Q 138 340 144 370"
        stroke={p.bodyDeep}
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
      {/* Right leg */}
      <path
        d="M 166 285
           Q 166 320 164 360
           Q 164 368 168 374
           L 182 374
           Q 188 372 188 360
           Q 186 320 182 285 Z"
        fill="url(#avBody)"
      />
      <path
        d="M 182 300 Q 182 340 176 370"
        stroke={p.bodyDeep}
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
      {/* Boots */}
      <ellipse cx="146" cy="376" rx="14" ry="5" fill={p.bodyDeep} />
      <ellipse cx="174" cy="376" rx="14" ry="5" fill={p.bodyDeep} />
      <ellipse cx="144" cy="374" rx="6" ry="1.5" fill={p.accent1} opacity="0.4" />
      <ellipse cx="176" cy="374" rx="6" ry="1.5" fill={p.accent1} opacity="0.4" />
    </g>
  );
}

function Shackles({ palette: p, faded = false }: { palette: Palette; faded?: boolean }) {
  const op = faded ? 0.5 : 0.9;
  return (
    <g opacity={op}>
      <ellipse cx="94" cy="288" rx="6" ry="3.5" fill={p.shackle} />
      <ellipse cx="226" cy="288" rx="6" ry="3.5" fill={p.shackle} />
      <path
        d="M 94 288 Q 160 296 226 288"
        stroke={p.shackle}
        strokeWidth="2"
        fill="none"
        strokeDasharray="3 2"
      />
    </g>
  );
}

function groupBySlot(items: ItemDef[]) {
  const out: Partial<Record<ItemDef['slot'], ItemDef>> = {};
  for (const it of items) out[it.slot] = it;
  return out;
}

// ---------- Items (kept compact, themed) ----------

function Crown({ item, palette: p }: { item: ItemDef; palette: Palette }) {
  if (item.theme === 'celestial') {
    return (
      <g transform="translate(160 60)">
        <circle cx="0" cy="0" r="22" fill="none" stroke={p.accent1} strokeWidth="2" opacity="0.85" />
        <circle cx="0" cy="0" r="3" fill={p.accent1} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return (
            <line key={i} x1={Math.cos(a) * 26} y1={Math.sin(a) * 26} x2={Math.cos(a) * 34} y2={Math.sin(a) * 34} stroke={p.accent1} strokeWidth="1.5" opacity="0.9" />
          );
        })}
        <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="20s" repeatCount="indefinite" />
      </g>
    );
  }
  if (item.theme === 'warrior') {
    return (
      <g transform="translate(0 0)">
        <path
          d="M 122 70 Q 122 52 145 48 L 175 48 Q 198 52 198 70 L 198 84 L 188 80 L 178 84 L 168 78 L 160 84 L 152 78 L 142 84 L 132 80 L 122 84 Z"
          fill={p.accent2}
          stroke={p.accent1}
          strokeWidth="1.5"
        />
        <rect x="135" y="68" width="50" height="2.5" fill={p.accent1} opacity="0.7" />
        <path d="M 160 48 L 156 38 L 164 38 Z" fill={p.accent1} />
      </g>
    );
  }
  if (item.theme === 'phoenix') {
    return (
      <g>
        <path
          d="M 130 78 Q 135 50 150 38 Q 155 46 160 36 Q 165 46 170 38 Q 185 50 190 78 Z"
          fill={p.accent1}
          opacity="0.95"
        />
        <path
          d="M 140 76 Q 150 60 160 50 Q 170 60 180 76 Z"
          fill={p.accent2}
          opacity="0.9"
        />
        <circle cx="160" cy="42" r="2" fill="#fff" opacity="0.9" />
      </g>
    );
  }
  return (
    <g>
      <path d="M 124 70 Q 132 54 150 54 Q 170 50 196 54 Q 200 54 196 70" fill="none" stroke={p.accent1} strokeWidth="2.5" />
      {[132, 145, 160, 175, 188].map((x, i) => (
        <ellipse key={i} cx={x} cy={54 - (i % 2) * 4} rx="5" ry="3" fill={p.accent1} transform={`rotate(${-20 + i * 12} ${x} ${54 - (i % 2) * 4})`} />
      ))}
      <g transform="translate(140 50)">
        <circle cx="0" cy="0" r="3.5" fill={p.accent2} />
        {[0, 1, 2, 3, 4].map((j) => {
          const a = (j * 72 * Math.PI) / 180;
          return <circle key={j} cx={Math.cos(a) * 4} cy={Math.sin(a) * 4} r="2.5" fill={p.accent1} />;
        })}
        <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
      </g>
    </g>
  );
}

function ArmorPlate({ item, palette: p }: { item: ItemDef; palette: Palette }) {
  if (item.theme === 'celestial') {
    return (
      <g>
        <path d="M 124 200 L 160 192 L 196 200 L 200 262 L 160 274 L 120 262 Z" fill="url(#avArmor)" opacity="0.9" />
        <path d="M 124 200 L 160 192 L 196 200 L 200 262 L 160 274 L 120 262 Z" fill="url(#avArmorSheen)" />
        {[148, 160, 172].map((x, i) => (
          <path key={i} d={`M ${x} 220 L ${x + 1.5} 225 L ${x + 6} 226 L ${x + 2} 229 L ${x + 3} 235 L ${x} 233 L ${x - 3} 235 L ${x - 2} 229 L ${x - 6} 226 L ${x - 1.5} 225 Z`} fill="#fff" opacity="0.85" />
        ))}
      </g>
    );
  }
  if (item.theme === 'warrior') {
    return (
      <g>
        <path d="M 122 200 L 160 192 L 198 200 L 200 262 L 175 274 L 145 274 L 120 262 Z" fill="url(#avArmor)" stroke={p.accent1} strokeWidth="1.5" />
        <path d="M 122 200 L 160 192 L 198 200 L 200 262 L 175 274 L 145 274 L 120 262 Z" fill="url(#avArmorSheen)" />
        <circle cx="160" cy="235" r="13" fill={p.accent1} />
        <path d="M 153 235 L 158 240 L 168 228" stroke={p.bodyDeep} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  }
  if (item.theme === 'phoenix') {
    return (
      <g>
        <path d="M 124 200 L 160 192 L 196 200 L 200 262 L 160 274 L 120 262 Z" fill="url(#avArmor)" opacity="0.85" />
        <path d="M 124 200 L 160 192 L 196 200 L 200 262 L 160 274 L 120 262 Z" fill="url(#avArmorSheen)" />
        <path d="M 160 218 Q 152 234 157 251 Q 160 246 163 251 Q 168 234 160 218 Z" fill={p.accent1} />
        <path d="M 160 230 Q 156 241 160 251 Q 164 241 160 230 Z" fill={p.accent2} opacity="0.85" />
      </g>
    );
  }
  return (
    <g>
      <path d="M 124 200 Q 132 196 142 196 L 160 192 L 178 196 Q 188 196 196 200 L 200 262 Q 160 274 120 262 Z" fill="url(#avArmor)" opacity="0.85" />
      <path d="M 124 200 Q 132 196 142 196 L 160 192 L 178 196 Q 188 196 196 200 L 200 262 Q 160 274 120 262 Z" fill="url(#avArmorSheen)" />
      <path d="M 130 220 Q 145 235 142 258 Q 148 270 144 280" stroke={p.accent1} strokeWidth="2" fill="none" />
      <path d="M 190 220 Q 175 235 178 258 Q 172 270 176 280" stroke={p.accent1} strokeWidth="2" fill="none" />
      {[
        [138, 232], [182, 232], [146, 264], [174, 264],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="5" ry="3" fill={p.accent2} transform={`rotate(${i * 30} ${x} ${y})`} />
      ))}
    </g>
  );
}

function Amulet({ item, palette: p }: { item: ItemDef; palette: Palette }) {
  if (item.theme === 'celestial') {
    return (
      <g>
        <line x1="160" y1="200" x2="160" y2="220" stroke={p.accent2} strokeWidth="1" />
        <circle cx="160" cy="228" r="6" fill={p.accent1} />
        <circle cx="160" cy="228" r="2.5" fill="#ffffff" />
      </g>
    );
  }
  if (item.theme === 'warrior') {
    return (
      <g>
        <line x1="160" y1="200" x2="160" y2="225" stroke={p.accent1} strokeWidth="1.5" />
        <path d="M 153 225 L 167 225 L 164 240 L 156 240 Z" fill={p.accent1} />
        <path d="M 156 236 L 164 236 L 162 244 L 158 244 Z" fill={p.bodyDeep} />
      </g>
    );
  }
  if (item.theme === 'phoenix') {
    return (
      <g>
        <line x1="160" y1="200" x2="160" y2="222" stroke={p.accent2} strokeWidth="1" />
        <path d="M 160 222 Q 152 232 156 244 Q 160 238 164 244 Q 168 232 160 222 Z" fill={p.accent1} />
      </g>
    );
  }
  return (
    <g>
      <line x1="160" y1="200" x2="160" y2="220" stroke={p.accent1} strokeWidth="1" />
      <circle cx="160" cy="228" r="5" fill={p.accent2} />
      <circle cx="160" cy="228" r="2" fill={p.accent1} />
    </g>
  );
}

function Wings({ item, palette: p }: { item: ItemDef; palette: Palette }) {
  if (item.theme === 'celestial') {
    return (
      <g transform="translate(160 220)" opacity="0.9">
        <path d="M -40 0 Q -70 -25 -80 5 Q -70 35 -30 35 Q -20 25 -15 20 Z" fill={p.accent1} opacity="0.85" />
        <path d="M 40 0 Q 70 -25 80 5 Q 70 35 30 35 Q 20 25 15 20 Z" fill={p.accent1} opacity="0.85" />
        <path d="M -50 -10 Q -60 0 -50 20" stroke={p.accent2} strokeWidth="1.5" fill="none" />
        <path d="M 50 -10 Q 60 0 50 20" stroke={p.accent2} strokeWidth="1.5" fill="none" />
      </g>
    );
  }
  if (item.theme === 'warrior') return null;
  if (item.theme === 'phoenix') {
    return (
      <g transform="translate(160 220)" opacity="0.9">
        <path d="M -40 10 Q -70 0 -75 40 Q -60 60 -25 50 Q -10 35 -10 25 Z" fill={p.accent2} />
        <path d="M 40 10 Q 70 0 75 40 Q 60 60 25 50 Q 10 35 10 25 Z" fill={p.accent2} />
        {[
          [-55, 30], [-40, 40], [-25, 30], [55, 30], [40, 40], [25, 30],
        ].map(([x, y], i) => (
          <path key={i} d={`M ${x} ${y} Q ${x + 2} ${y - 8} ${x} ${y - 14} Q ${x - 2} ${y - 8} ${x} ${y} Z`} fill={p.accent1} opacity="0.9" />
        ))}
      </g>
    );
  }
  return (
    <g transform="translate(160 220)" opacity="0.9">
      <path d="M -30 5 Q -70 -15 -75 25 Q -65 45 -25 45 Q -10 30 -8 20 Z" fill={p.accent1} />
      <path d="M 30 5 Q 70 -15 75 25 Q 65 45 25 45 Q 10 30 8 20 Z" fill={p.accent1} />
      <circle cx="-50" cy="22" r="5" fill={p.accent2} />
      <circle cx="-50" cy="22" r="2" fill={p.halo} />
      <circle cx="50" cy="22" r="5" fill={p.accent2} />
      <circle cx="50" cy="22" r="2" fill={p.halo} />
    </g>
  );
}

function Cape({ palette: p }: { palette: Palette }) {
  return (
    <g opacity="0.85">
      <path d="M 110 195 L 90 320 L 130 290 L 160 295 L 190 290 L 230 320 L 210 195 Z" fill={p.accent2} opacity="0.75" />
      <path d="M 110 195 L 90 320 L 130 290" stroke={p.accent1} strokeWidth="1.5" fill="none" />
      <path d="M 210 195 L 230 320 L 190 290" stroke={p.accent1} strokeWidth="1.5" fill="none" />
    </g>
  );
}

// ---------- Atmosphere ----------

function AuraBackdrop({ palette: p }: { palette: Palette }) {
  return (
    <>
      <div className="absolute inset-0 rounded-full animate-ring pointer-events-none" style={{ background: `radial-gradient(circle, ${p.halo}66 0%, transparent 65%)` }} />
      <div className="absolute inset-0 rounded-full animate-ring pointer-events-none" style={{ background: `radial-gradient(circle, ${p.accent1}33 0%, transparent 55%)`, animationDelay: '1.2s' }} />
    </>
  );
}

function HaloDisc({ palette: p, stage }: { palette: Palette; stage: number }) {
  return (
    <div className="absolute left-1/2 top-[8%] -translate-x-1/2 rounded-full animate-halo-pulse pointer-events-none" style={{ width: '70%', height: '32%', background: `radial-gradient(circle, ${p.halo}${stage >= 4 ? '99' : '55'} 0%, transparent 60%)` }} />
  );
}

function AuraParticles({ palette: p, count }: { palette: Palette; count: number }) {
  return (
    <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 320 432">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i * (360 / count) * Math.PI) / 180;
        const r = 110 + ((i * 17) % 50);
        const x = 160 + Math.cos(angle) * r;
        const y = 220 + Math.sin(angle) * r * 0.85;
        const dur = 2 + (i % 3);
        return (
          <circle key={i} cx={x} cy={y} r="1.8" fill={p.accent1} opacity="0.7">
            <animate attributeName="opacity" values="0.2;1;0.2" dur={`${dur}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="1.2;2.4;1.2" dur={`${dur + 0.5}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </svg>
  );
}

function Sparkles({ palette: p }: { palette: Palette }) {
  return (
    <svg className="absolute inset-0 pointer-events-none" viewBox="0 0 320 432">
      {[...Array(8)].map((_, i) => (
        <g key={i} transform={`translate(${50 + i * 28}, ${70 + (i % 3) * 90})`}>
          <path d="M0,-6 L1.5,-1.5 L6,0 L1.5,1.5 L0,6 L-1.5,1.5 L-6,0 L-1.5,-1.5 Z" fill={p.accent1} opacity="0.85">
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur={`${4 + i}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;1;0.2" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}
    </svg>
  );
}

// ---------- Face close-up for Coach ----------

export function AvatarFace({
  stage, theme, size = 200, talking = false, thinking = false, mood,
}: {
  stage: SobrietyStage;
  theme: Theme;
  size?: number;
  talking?: boolean;
  thinking?: boolean;
  mood?: number | null;
}) {
  const palette = (THEMED_PALETTES[theme] ?? defaultPalette)[stage];
  const items = unlockedItems(theme, stage);
  const itemsBySlot = groupBySlot(items);
  const blink = useBlink();
  const look = useLookAround();
  const saccades = useSaccades();
  const breath = useBreath();
  const emotion: Emotion = thinking ? 'focused' : emotionForMood(mood, stage);
  const expr = expression(emotion);

  const [mouthFrame, setMouthFrame] = useState(0);
  useEffect(() => {
    if (!talking) {
      setMouthFrame(0);
      return;
    }
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      setMouthFrame((f) => (f + 1) % 4);
      setTimeout(tick, 110 + Math.random() * 80);
    };
    tick();
    return () => {
      mounted = false;
    };
  }, [talking]);

  const talkPulse = talking ? Math.sin(breath * Math.PI * 2) * 0.8 : 0;
  const breathScale = 1 + Math.sin(breath * Math.PI * 2) * 0.008;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {itemsBySlot.aura && (
        <div className="absolute inset-0 rounded-full animate-halo-pulse" style={{ background: `radial-gradient(circle, ${palette.halo}55 0%, transparent 65%)` }} />
      )}
      {stage >= 2 && (
        <div className="absolute inset-0 rounded-full animate-breathe" style={{ background: `radial-gradient(circle at 50% 35%, ${palette.halo}88 0%, transparent 50%)` }} />
      )}

      <svg viewBox="0 0 320 360" className="relative w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
        <defs>
          <radialGradient id="faceSkinF" cx="42%" cy="32%" r="75%">
            <stop offset="0%" stopColor={palette.skinHighlight} />
            <stop offset="30%" stopColor={palette.skin} />
            <stop offset="65%" stopColor={palette.skinMid} />
            <stop offset="92%" stopColor={palette.skinDeep} />
          </radialGradient>
          <linearGradient id="faceBodyF" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.body} />
            <stop offset="100%" stopColor={palette.bodyDeep} />
          </linearGradient>
          <linearGradient id="faceHairF" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.hairHighlight} />
            <stop offset="40%" stopColor={palette.hair} />
            <stop offset="100%" stopColor={palette.hairDeep} />
          </linearGradient>
          <radialGradient id="faceIrisF" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor={palette.eye} />
            <stop offset="50%" stopColor={palette.eye} />
            <stop offset="80%" stopColor={palette.eyeDeep} />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <radialGradient id="faceHaloF" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.halo} stopOpacity="0.9" />
            <stop offset="100%" stopColor={palette.halo} stopOpacity="0" />
          </radialGradient>
        </defs>

        <HairBack palette={palette} />
        {itemsBySlot.wings && itemsBySlot.wings.theme !== 'warrior' && (
          <g transform="translate(160 280) scale(0.55)" opacity="0.85">
            <g transform="translate(-160 -220)">
              <Wings item={itemsBySlot.wings} palette={palette} />
            </g>
          </g>
        )}

        <g style={{ transformOrigin: '160px 280px' }} transform={`scale(1, ${breathScale})`}>
          <path d="M 90 285 Q 90 275 105 270 L 215 270 Q 230 275 230 285 L 230 360 L 90 360 Z" fill="url(#faceBodyF)" />
          <Neck palette={palette} />
          {itemsBySlot.armor && (
            <g transform="translate(0 35) scale(0.55)">
              <g transform="translate(-160 -160)">
                <ArmorPlate item={itemsBySlot.armor} palette={palette} />
              </g>
            </g>
          )}
          {itemsBySlot.amulet && (
            <g transform="scale(0.55)">
              <g transform="translate(-160 -110)">
                <Amulet item={itemsBySlot.amulet} palette={palette} />
              </g>
            </g>
          )}
        </g>

        <g transform={`translate(${look.headYaw * 0.4}, ${-talkPulse}) rotate(${look.headRoll} 160 150)`} style={{ transformOrigin: '160px 150px' }}>
          <g transform={`rotate(${look.headYaw} 160 150) translate(0, ${look.headPitch * 0.6})`}>
            <Ears palette={palette} />
            <g transform="scale(1.5) translate(-53 -55)">
              <Face palette={palette} />
              <CheekSubsurface palette={palette} intensity={expr.cheekGlow} />
              <NoseDetailed palette={palette} />
              <Brows palette={palette} lift={expr.browLift} />
              <g transform={`translate(${look.gazeX + saccades.dx}, ${look.gazeY + saccades.dy})`}>
                <RealEyes blink={blink} openness={expr.eyeOpenness} crinkle={expr.eyeCrinkle} palette={palette} />
              </g>
              {talking ? <TalkingMouth frame={mouthFrame} palette={palette} /> : <Mouth palette={palette} emotion={emotion} stage={stage} />}
              <HairFront palette={palette} />
            </g>
            {itemsBySlot.crown && (
              <g transform="scale(1.5) translate(-53 -55)">
                <Crown item={itemsBySlot.crown} palette={palette} />
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}

function TalkingMouth({ frame, palette: p }: { frame: number; palette: Palette }) {
  const open = [[4, 6], [6, 10], [5, 7], [3, 5]][frame];
  return (
    <g>
      <ellipse cx="160" cy="148" rx={open[0] + 1} ry={open[1] / 2 + 1} fill={p.lip} />
      <ellipse cx="160" cy="149" rx={open[0]} ry={open[1] / 2} fill="#1a0808" />
      {frame % 2 === 1 && (
        <rect x={160 - open[0] + 1} y={148} width={(open[0] - 1) * 2} height="1.5" fill="#f4ecd8" opacity="0.8" />
      )}
    </g>
  );
}

// ---------- Streak ring (kept) ----------

export function StreakRing({
  days, target = 365, size = 200,
}: {
  days: number; target?: number; size?: number;
}) {
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(days / target, 1);
  const offset = circumference * (1 - progress);
  const pct = Math.round(progress * 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="streakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9be7c5" />
            <stop offset="50%" stopColor="#43c486" />
            <stop offset="100%" stopColor="#26855f" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#streakGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-5xl font-bold gradient-text">{days}</div>
        <div className="text-xs text-ink-400 uppercase tracking-widest mt-1">{days === 1 ? 'day' : 'days'}</div>
        <div className="text-[10px] text-sage-300/80 mt-1">{pct}% of a year</div>
      </div>
    </div>
  );
}
