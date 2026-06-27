// Avatar evolves through 6 stages (0-5) based on days sober.
// Thresholds reflect meaningful recovery milestones.

export type SobrietyStage = 0 | 1 | 2 | 3 | 4 | 5;

export function stageFromDays(days: number): SobrietyStage {
  if (days >= 365) return 5;
  if (days >= 180) return 4;
  if (days >= 90) return 3;
  if (days >= 30) return 2;
  if (days >= 7) return 1;
  return 0;
}

export const STAGE_THRESHOLDS: Array<{ day: number; stage: SobrietyStage; name: string; tagline: string }> = [
  { day: 0, stage: 0, name: 'Awakening', tagline: 'The first breath' },
  { day: 7, stage: 1, name: 'Rising', tagline: 'Standing taller' },
  { day: 30, stage: 2, name: 'Rooted', tagline: 'Finding ground' },
  { day: 90, stage: 3, name: 'Growing', tagline: 'Light returning' },
  { day: 180, stage: 4, name: 'Blooming', tagline: 'Aura of strength' },
  { day: 365, stage: 5, name: 'Radiant', tagline: 'Fully alive' },
];

export function nextMilestone(days: number): { day: number; name: string; daysLeft: number } | null {
  for (const m of STAGE_THRESHOLDS) {
    if (m.day > days) {
      return { day: m.day, name: m.name, daysLeft: m.day - days };
    }
  }
  return null;
}

export function progressToNextStage(days: number): { current: number; next: number; pct: number } {
  const cur = STAGE_THRESHOLDS.findLast((m) => m.day <= days) ?? STAGE_THRESHOLDS[0];
  const nextIdx = STAGE_THRESHOLDS.findIndex((m) => m.day === cur.day) + 1;
  const next = STAGE_THRESHOLDS[nextIdx];
  if (!next) return { current: cur.day, next: cur.day, pct: 1 };
  const span = next.day - cur.day;
  const into = days - cur.day;
  return { current: cur.day, next: next.day, pct: Math.min(into / span, 1) };
}
