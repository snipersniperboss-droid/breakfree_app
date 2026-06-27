// Color palettes for the avatar, per theme + stage.
// All values are hex; the SVG references them directly.

import type { Theme } from './items';

export interface Palette {
  skin: string; // face/head
  skinHighlight: string; // bright highlight on skin
  skinMid: string; // mid tone for shading
  skinDeep: string; // shadows on face
  body: string; // main body
  bodyDeep: string; // deep shadow
  hair: string; // hair, eyebrows
  hairHighlight: string; // hair shine
  hairDeep: string; // hair shadow
  eye: string; // iris light
  eyeDeep: string; // iris dark / pupil
  lip: string; // mouth
  lipDeep: string; // mouth shadow
  halo: string; // glow / aura
  accent1: string; // primary theme accent (armor, wings, crown detail)
  accent2: string; // secondary accent (deep)
  bgTop: string; // sky disc top
  bgBottom: string; // sky disc bottom
  shackle: string; // stage 0 shackles
}

// Per-theme base color tokens
const themeTokens: Record<
  Theme,
  {
    skin: string;
    skinHighlight: string;
    skinMid: string;
    skinDeep: string;
    body: string;
    bodyDeep: string;
    hair: string;
    hairHighlight: string;
    hairDeep: string;
    eye: string;
    eyeDeep: string;
    lip: string;
    lipDeep: string;
  }
> = {
  sage: {
    skin: '#f0d8b8',
    skinHighlight: '#fce8c8',
    skinMid: '#e0bf99',
    skinDeep: '#c4a482',
    body: '#7fb89a',
    bodyDeep: '#3b6a55',
    hair: '#2d3a30',
    hairHighlight: '#5a6e60',
    hairDeep: '#15201a',
    eye: '#3d6a52',
    eyeDeep: '#1a3024',
    lip: '#c46858',
    lipDeep: '#8a3a30',
  },
  celestial: {
    skin: '#f7e8d4',
    skinHighlight: '#fef4e0',
    skinMid: '#e8d0aa',
    skinDeep: '#c8a87c',
    body: '#b8a4e0',
    bodyDeep: '#5e4a8a',
    hair: '#3a2a5a',
    hairHighlight: '#6a5a8e',
    hairDeep: '#1a1230',
    eye: '#5a3aaa',
    eyeDeep: '#2a1858',
    lip: '#c478a0',
    lipDeep: '#8a4878',
  },
  warrior: {
    skin: '#f0d0a8',
    skinHighlight: '#fce4c0',
    skinMid: '#d8aa80',
    skinDeep: '#a87850',
    body: '#9a8270',
    bodyDeep: '#5a4438',
    hair: '#2a1f18',
    hairHighlight: '#5a4030',
    hairDeep: '#100a06',
    eye: '#5a3018',
    eyeDeep: '#2a1408',
    lip: '#b85838',
    lipDeep: '#7a3018',
  },
  phoenix: {
    skin: '#fdd6b0',
    skinHighlight: '#ffe6c8',
    skinMid: '#e8b088',
    skinDeep: '#b87850',
    body: '#e88a5a',
    bodyDeep: '#8a3a1a',
    hair: '#5a1a08',
    hairHighlight: '#a04020',
    hairDeep: '#2a0a04',
    eye: '#8a2a08',
    eyeDeep: '#3a1004',
    lip: '#c44830',
    lipDeep: '#7a2008',
  },
};

const stageOverlay: Record<
  number,
  { halo: string; accent1: string; accent2: string; bgTop: string; bgBottom: string; shackle: string }
> = {
  0: { halo: '#6a7286', accent1: '#4a5165', accent2: '#2a3142', bgTop: '#1a1d28', bgBottom: '#0a0c14', shackle: '#3b4051' },
  1: { halo: '#7fb89a', accent1: '#5fbd92', accent2: '#26855f', bgTop: '#15252b', bgBottom: '#08120e', shackle: '#5a6173' },
  2: { halo: '#43c486', accent1: '#5fbd92', accent2: '#26855f', bgTop: '#102a23', bgBottom: '#06120e', shackle: '#5a6173' },
  3: { halo: '#9be7c5', accent1: '#6fd6a3', accent2: '#3aa676', bgTop: '#0e2c25', bgBottom: '#051810', shackle: '#5a6173' },
  4: { halo: '#bce6cf', accent1: '#9be7c5', accent2: '#43c486', bgTop: '#0d2a23', bgBottom: '#041410', shackle: '#5a6173' },
  5: { halo: '#ffffff', accent1: '#cdfbe1', accent2: '#6fd6a3', bgTop: '#0a2820', bgBottom: '#031008', shackle: '#5a6173' },
};

// For non-sage themes, override the stage accent colors so each theme has its own personality.
const themedStageAccents: Record<Theme, Record<number, { accent1: string; accent2: string; halo: string }>> = {
  sage: {
    0: { accent1: '#4a5165', accent2: '#2a3142', halo: '#6a7286' },
    1: { accent1: '#5fbd92', accent2: '#26855f', halo: '#7fb89a' },
    2: { accent1: '#5fbd92', accent2: '#26855f', halo: '#43c486' },
    3: { accent1: '#6fd6a3', accent2: '#3aa676', halo: '#9be7c5' },
    4: { accent1: '#9be7c5', accent2: '#43c486', halo: '#bce6cf' },
    5: { accent1: '#cdfbe1', accent2: '#6fd6a3', halo: '#ffffff' },
  },
  celestial: {
    0: { accent1: '#5a4a7a', accent2: '#3a2a5a', halo: '#7a6a9a' },
    1: { accent1: '#a78bfa', accent2: '#7c3aed', halo: '#c4b5fd' },
    2: { accent1: '#c4b5fd', accent2: '#a78bfa', halo: '#ddd6fe' },
    3: { accent1: '#ddd6fe', accent2: '#a78bfa', halo: '#ede9fe' },
    4: { accent1: '#f0eaff', accent2: '#c4b5fd', halo: '#ffffff' },
    5: { accent1: '#ffffff', accent2: '#ddd6fe', halo: '#ffffff' },
  },
  warrior: {
    0: { accent1: '#5a4438', accent2: '#3a2a20', halo: '#7a5e4e' },
    1: { accent1: '#b8865a', accent2: '#8a5e3a', halo: '#d4a578' },
    2: { accent1: '#cd9a6a', accent2: '#9a6a3a', halo: '#e0b890' },
    3: { accent1: '#e0b890', accent2: '#b8865a', halo: '#f0d4ad' },
    4: { accent1: '#f0d4ad', accent2: '#cd9a6a', halo: '#ffe4c4' },
    5: { accent1: '#ffe4c4', accent2: '#e0b890', halo: '#ffffff' },
  },
  phoenix: {
    0: { accent1: '#5a2a18', accent2: '#3a1a08', halo: '#7a3a28' },
    1: { accent1: '#ff7a3d', accent2: '#cc4a18', halo: '#ff9a5d' },
    2: { accent1: '#ff9a5d', accent2: '#ff5a1d', halo: '#ffba7d' },
    3: { accent1: '#ffba7d', accent2: '#ff7a3d', halo: '#ffda9d' },
    4: { accent1: '#ffda9d', accent2: '#ff9a5d', halo: '#fff0c0' },
    5: { accent1: '#fff0c0', accent2: '#ffba7d', halo: '#ffffff' },
  },
};

export const THEMED_PALETTES: Record<Theme, Palette[]> = (() => {
  const out: Record<Theme, Palette[]> = {} as Record<Theme, Palette[]>;
  (['sage', 'celestial', 'warrior', 'phoenix'] as Theme[]).forEach((t) => {
    out[t] = [0, 1, 2, 3, 4, 5].map((s) => {
      const tokens = themeTokens[t];
      const base = stageOverlay[s];
      const acc = themedStageAccents[t][s];
      return {
        skin: tokens.skin,
        skinHighlight: tokens.skinHighlight,
        skinMid: tokens.skinMid,
        skinDeep: tokens.skinDeep,
        body: tokens.body,
        bodyDeep: tokens.bodyDeep,
        hair: tokens.hair,
        hairHighlight: tokens.hairHighlight,
        hairDeep: tokens.hairDeep,
        eye: tokens.eye,
        eyeDeep: tokens.eyeDeep,
        lip: tokens.lip,
        lipDeep: tokens.lipDeep,
        halo: acc.halo,
        accent1: acc.accent1,
        accent2: acc.accent2,
        bgTop: base.bgTop,
        bgBottom: base.bgBottom,
        shackle: base.shackle,
      };
    });
  });
  return out;
})();

export const defaultPalette: Palette = THEMED_PALETTES.sage[0];
