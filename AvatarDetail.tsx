// 6 pre-made photorealistic avatar presets.
// Each is themed and gendered; user picks one at onboarding.

import type { Theme } from './items';

export type AvatarId =
  | 'm_sage'
  | 'm_celestial'
  | 'm_warrior'
  | 'f_sage'
  | 'f_celestial'
  | 'f_phoenix'
  | 'f_warrior';

export interface AvatarPreset {
  id: AvatarId;
  label: string;
  gender: 'm' | 'f';
  theme: Theme;
  image: string;          // path under /public
  tagline: string;
  description: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'm_sage',
    label: 'Kofi',
    gender: 'm',
    theme: 'sage',
    image: '/avatars/m_sage.png',
    tagline: 'The Steady',
    description: 'Grounded, weathered, kind. 45. Olive overshirt. The kind of calm that comes from years of being the person others lean on.',
  },
  {
    id: 'm_celestial',
    label: 'Min-jun',
    gender: 'm',
    theme: 'celestial',
    image: '/avatars/m_celestial.png',
    tagline: 'The Quiet Star',
    description: '32. Indigo knit. Thinks before he speaks, listens like it matters. The sky at the moment before sunrise.',
  },
  {
    id: 'm_warrior',
    label: 'Marcus',
    gender: 'm',
    theme: 'warrior',
    image: '/avatars/m_warrior.png',
    tagline: 'The Vanguard',
    description: '36. Charcoal military jacket, bronze pin. Stoic, steady, the one who walks into a room and earns the silence. He doesn\'t flinch.',
  },
  {
    id: 'f_sage',
    label: 'Anjali',
    gender: 'f',
    theme: 'sage',
    image: '/avatars/f_sage.png',
    tagline: 'The Cultivator',
    description: '42. Sage tunic, silver pendant. Nurturing, patient, the one who reminds you to drink water and call your mother.',
  },
  {
    id: 'f_celestial',
    label: 'Lena',
    gender: 'f',
    theme: 'celestial',
    image: '/avatars/f_celestial.png',
    tagline: 'The Moon',
    description: '28. Silk blouse, starlight in her eyes. Calm, luminous, sees you even when you\'re trying to disappear.',
  },
  {
    id: 'f_phoenix',
    label: 'Amara',
    gender: 'f',
    theme: 'phoenix',
    image: '/avatars/f_phoenix.png',
    tagline: 'The Flame',
    description: '35. Braids, amber earrings, burnished copper. Confident, grounded, warm. She chose herself and never looked back.',
  },
  {
    id: 'f_warrior',
    label: 'Nia',
    gender: 'f',
    theme: 'warrior',
    image: '/avatars/f_warrior.png',
    tagline: 'The Vanguard',
    description: '35. Olive military jacket, brass buttons. Composed, present, the one who makes you feel safe without saying much.',
  },
];

export function getAvatar(id?: string | null): AvatarPreset {
  return AVATAR_PRESETS.find((a) => a.id === id) ?? AVATAR_PRESETS[0];
}

export const DEFAULT_AVATAR: AvatarId = 'm_sage';
