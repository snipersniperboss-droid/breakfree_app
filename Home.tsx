// Themes + unlockable items.
// Each theme has 5 items gated by stage milestones.
// Items render as SVG groups layered onto the avatar.

export type Theme = 'sage' | 'celestial' | 'warrior' | 'phoenix';

export interface ThemeMeta {
  id: Theme;
  name: string;
  tagline: string;
  icon: string; // emoji for picker
  swatch: string[]; // gradient colors for the picker card
}

export const THEMES: ThemeMeta[] = [
  {
    id: 'sage',
    name: 'Sage',
    tagline: 'Patient growth from soil to sky',
    icon: '🌿',
    swatch: ['#bce6cf', '#5fbd92', '#1e6a4d'],
  },
  {
    id: 'celestial',
    name: 'Celestial',
    tagline: 'Light from the stars above',
    icon: '✨',
    swatch: ['#e0d4ff', '#a78bfa', '#5b21b6'],
  },
  {
    id: 'warrior',
    name: 'Warrior',
    tagline: 'Forged through every battle',
    icon: '⚔️',
    swatch: ['#fcd9b6', '#e89c5a', '#8a4a1f'],
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    tagline: 'Born again from the fire',
    icon: '🔥',
    swatch: ['#ffe4b0', '#ff7a3d', '#a31a1a'],
  },
];

// Items per theme, indexed by stage they unlock at.
// Stages: 0 (day 1) → 5 (day 365+)
// slot: 'crown' | 'aura' | 'armor' | 'wings' | 'amulet'
export interface ItemDef {
  id: string;
  theme: Theme;
  slot: 'crown' | 'aura' | 'armor' | 'wings' | 'amulet';
  stage: 0 | 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
}

export const ITEMS: ItemDef[] = [
  // SAGE
  { id: 'sage_band', theme: 'sage', slot: 'crown', stage: 1, name: 'Willow Band', description: 'A simple circlet woven from your first week.' },
  { id: 'sage_armor', theme: 'sage', slot: 'armor', stage: 2, name: 'Bark Plate', description: 'Carved from the tree you became after 30 days.' },
  { id: 'sage_wings', theme: 'sage', slot: 'wings', stage: 3, name: 'Moth Wings', description: 'Born quietly, like recovery itself.' },
  { id: 'sage_crown', theme: 'sage', slot: 'crown', stage: 4, name: 'Bloom Crown', description: 'A wreath of flowers only you could grow.' },
  { id: 'sage_aura', theme: 'sage', slot: 'aura', stage: 5, name: 'Verdant Aura', description: 'A year of life, radiating.' },

  // CELESTIAL
  { id: 'cel_band', theme: 'celestial', slot: 'crown', stage: 1, name: 'Moonstone Pin', description: 'A sliver of the night sky.' },
  { id: 'cel_armor', theme: 'celestial', slot: 'armor', stage: 2, name: 'Stardust Robe', description: 'Woven from constellations.' },
  { id: 'cel_wings', theme: 'celestial', slot: 'wings', stage: 3, name: 'Aurora Wings', description: 'Light bending around you.' },
  { id: 'cel_crown', theme: 'celestial', slot: 'crown', stage: 4, name: 'Halo of Dawn', description: 'A circle of first light.' },
  { id: 'cel_aura', theme: 'celestial', slot: 'aura', stage: 5, name: 'Eternal Glow', description: 'You carry the sun now.' },

  // WARRIOR
  { id: 'war_band', theme: 'warrior', slot: 'crown', stage: 1, name: 'Bronze Circlet', description: 'Mark of someone who showed up.' },
  { id: 'war_armor', theme: 'warrior', slot: 'armor', stage: 2, name: 'Iron Cuirass', description: 'Forged in your first crucible.' },
  { id: 'war_wings', theme: 'warrior', slot: 'wings', stage: 3, name: 'Battle Cape', description: 'Heavy with stories you survived.' },
  { id: 'war_crown', theme: 'warrior', slot: 'crown', stage: 4, name: 'Helm of Command', description: 'You lead by example now.' },
  { id: 'war_aura', theme: 'warrior', slot: 'aura', stage: 5, name: 'Warfield Aura', description: 'Battle-scarred and unbroken.' },

  // PHOENIX
  { id: 'pho_band', theme: 'phoenix', slot: 'crown', stage: 1, name: 'Ember Ring', description: 'First spark of the new fire.' },
  { id: 'pho_armor', theme: 'phoenix', slot: 'armor', stage: 2, name: 'Ash Plate', description: 'From what burned down, this rose.' },
  { id: 'pho_wings', theme: 'phoenix', slot: 'wings', stage: 3, name: 'Phoenix Wings', description: 'Outstretched, mid-rebirth.' },
  { id: 'pho_crown', theme: 'phoenix', slot: 'crown', stage: 4, name: 'Crown of Flame', description: 'The fire that does not consume.' },
  { id: 'pho_aura', theme: 'phoenix', slot: 'aura', stage: 5, name: 'Solar Radiance', description: 'You are the dawn.' },
];

// Items unlocked for a given theme + stage.
export function unlockedItems(theme: Theme, stage: number): ItemDef[] {
  return ITEMS.filter((i) => i.theme === theme && i.stage <= stage);
}

// Latest item just unlocked — used for celebration modal.
export function newestItem(theme: Theme, stage: number): ItemDef | null {
  const list = unlockedItems(theme, stage);
  if (list.length === 0) return null;
  return list.reduce((a, b) => (a.stage > b.stage ? a : b));
}
