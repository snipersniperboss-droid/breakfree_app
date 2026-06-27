// Community data: seed members, scheduled sessions, peer chat rooms,
// and canned responses that fire on a timer to simulate live presence.

import type { Theme } from './items';

export interface Member {
  id: string;
  name: string;
  days: number;
  theme: Theme;
  bio: string; // one short line
  badges: string[]; // small emoji badges
  online: boolean;
}

// Stable seed members. They're not "real" — but they let the UI feel alive
// without inventing fake people each session.
export const SEED_MEMBERS: Member[] = [
  {
    id: 'm_marcus',
    name: 'Marcus',
    days: 247,
    theme: 'warrior',
    bio: 'Quiet voice, big heart. Day 247 from alcohol.',
    badges: ['🛡️', '12-step'],
    online: true,
  },
  {
    id: 'm_priya',
    name: 'Priya',
    days: 52,
    theme: 'celestial',
    bio: 'Mom of two. Early days, hanging on.',
    badges: ['✨', 'New here'],
    online: true,
  },
  {
    id: 'm_jordan',
    name: 'Jordan',
    days: 1089,
    theme: 'phoenix',
    bio: 'Three years sober. Here to listen.',
    badges: ['🔥', 'Mentor'],
    online: true,
  },
  {
    id: 'm_sasha',
    name: 'Sasha',
    days: 14,
    theme: 'sage',
    bio: 'New, scared, showing up anyway.',
    badges: ['🌱'],
    online: true,
  },
  {
    id: 'm_diego',
    name: 'Diego',
    days: 89,
    theme: 'warrior',
    bio: 'Gambling recovery. Day 89.',
    badges: ['⚔️', '90 in 90'],
    online: true,
  },
  {
    id: 'm_amelia',
    name: 'Amelia',
    days: 401,
    theme: 'celestial',
    bio: 'Year-plus. Loves morning meetings.',
    badges: ['✨', '1 year'],
    online: false,
  },
  {
    id: 'm_kenji',
    name: 'Kenji',
    days: 33,
    theme: 'phoenix',
    bio: 'Coming back from a slip. Holding on.',
    badges: ['🔥', 'Restart'],
    online: true,
  },
  {
    id: 'm_fatima',
    name: 'Fatima',
    days: 612,
    theme: 'sage',
    bio: 'Quit smoking two years ago today 🎉',
    badges: ['🌿', 'Nicotine-free'],
    online: false,
  },
];

// Scheduled live group sessions.
// offsetMinutes = minutes from "now" when session starts (negative = already started)
export interface LiveSession {
  id: string;
  title: string;
  host: string; // member id
  hostName: string;
  topic: string;
  startsInMin: number; // negative = already started, used for "live now"
  durationMin: number;
  attendees: number;
  capacity: number;
  format: 'voice' | 'text';
  tags: string[];
}

export const SEED_SESSIONS: LiveSession[] = [
  {
    id: 's_morning_checkin',
    title: 'Morning Check-in',
    host: 'm_priya',
    hostName: 'Priya',
    topic: 'A gentle space to start the day. Share where you are, no pressure.',
    startsInMin: -3, // live now
    durationMin: 30,
    attendees: 7,
    capacity: 12,
    format: 'voice',
    tags: ['Morning', 'Open share'],
  },
  {
    id: 's_early_days',
    title: 'Early Days Circle',
    host: 'm_jordan',
    hostName: 'Jordan',
    topic: 'For anyone in their first 90 days. Stories, struggles, survival tips.',
    startsInMin: 22,
    durationMin: 60,
    attendees: 14,
    capacity: 20,
    format: 'voice',
    tags: ['Days 1–90', 'Support'],
  },
  {
    id: 's_text_aa_share',
    title: 'Text-Only Daily Share',
    host: 'm_marcus',
    hostName: 'Marcus',
    topic: 'Voice off, hearts open. Type one thing you’re grateful for today.',
    startsInMin: 48,
    durationMin: 45,
    attendees: 23,
    capacity: 40,
    format: 'text',
    tags: ['Text', 'Gratitude'],
  },
  {
    id: 's_evening_winddown',
    title: 'Evening Wind-Down',
    host: 'm_diego',
    hostName: 'Diego',
    topic: 'Wind down the day with people who get it. Reflection + plans for tomorrow.',
    startsInMin: 195,
    durationMin: 45,
    attendees: 6,
    capacity: 15,
    format: 'voice',
    tags: ['Evening', 'Reflection'],
  },
  {
    id: 's_family_support',
    title: 'Family & Loved Ones',
    host: 'm_amelia',
    hostName: 'Amelia',
    topic: 'For partners, parents, and friends supporting someone in recovery.',
    startsInMin: 720,
    durationMin: 60,
    attendees: 4,
    capacity: 25,
    format: 'voice',
    tags: ['Family', 'Ally'],
  },
  {
    id: 's_milestone_celebration',
    title: 'Milestone Celebration',
    host: 'm_jordan',
    hostName: 'Jordan',
    topic: 'Hit a milestone this week? Come share and be celebrated.',
    startsInMin: 1440,
    durationMin: 30,
    attendees: 11,
    capacity: 30,
    format: 'text',
    tags: ['Milestone', 'Celebration'],
  },
];

// Chat rooms in the peer chat.
export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  audienceDays?: [number, number]; // for early/late segmentation
  icon: string;
  onlineNow: number;
}

export const CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'r_general',
    name: 'General Recovery',
    description: 'The open room. Anything recovery, anytime.',
    icon: '🌍',
    onlineNow: 142,
  },
  {
    id: 'r_early',
    name: 'Early Days',
    description: 'For days 1–30. Real talk, no judgment, lots of coffee.',
    icon: '🌱',
    audienceDays: [1, 30],
    onlineNow: 38,
  },
  {
    id: 'r_90plus',
    name: 'Long-term Recovery',
    description: '90+ days. Pay it forward.',
    icon: '🌳',
    audienceDays: [90, 9999],
    onlineNow: 67,
  },
  {
    id: 'r_gratitude',
    name: 'Gratitude Wall',
    description: 'One thing you’re grateful for today.',
    icon: '💛',
    onlineNow: 19,
  },
  {
    id: 'r_gambling',
    name: 'Gambling Recovery',
    description: 'For gamblers anonymous and anyone struggling with betting.',
    icon: '🎲',
    onlineNow: 12,
  },
];

// Canned "ambient" messages that drift in from other members.
// Used by the chat simulator to give the room a heartbeat.
export const AMBIENT_MESSAGES: Record<string, Array<{ memberId: string; text: string; minutesAgo: number }>> = {
  r_general: [
    { memberId: 'm_marcus', text: 'morning everyone. coffee #1.', minutesAgo: 2 },
    { memberId: 'm_priya', text: 'made it through my kid\'s birthday party without a drink. so proud and so tired.', minutesAgo: 6 },
    { memberId: 'm_diego', text: 'day 89. one more and i get my chip.', minutesAgo: 14 },
    { memberId: 'm_jordan', text: 'remember: the only way out is through. you don\'t have to like it to do it.', minutesAgo: 22 },
    { memberId: 'm_sasha', text: 'hi. first time posting. just wanted to say hi.', minutesAgo: 28 },
    { memberId: 'm_marcus', text: 'welcome sasha 💚', minutesAgo: 27 },
    { memberId: 'm_kenji', text: 'having a craving morning. sending love.', minutesAgo: 35 },
  ],
  r_early: [
    { memberId: 'm_sasha', text: 'day 14. is it normal to feel worse before better?', minutesAgo: 5 },
    { memberId: 'm_priya', text: 'completely normal. week 2 is brutal. you\'re doing great.', minutesAgo: 4 },
    { memberId: 'm_kenji', text: 'the ice cream trick helps me. cold + sugar + distraction.', minutesAgo: 16 },
    { memberId: 'm_sasha', text: 'thank you 🥲', minutesAgo: 15 },
  ],
  r_90plus: [
    { memberId: 'm_jordan', text: 'three years ago i couldn\'t imagine tomorrow. today i can\'t imagine drinking.', minutesAgo: 11 },
    { memberId: 'm_amelia', text: 'morning meeting crew — see you at 7? 💛', minutesAgo: 25 },
    { memberId: 'm_diego', text: 'in. bringing the good chair.', minutesAgo: 23 },
  ],
  r_gratitude: [
    { memberId: 'm_fatima', text: 'two years nicotine-free today. my lungs. my money. my mornings. all back.', minutesAgo: 8 },
    { memberId: 'm_amelia', text: 'sunrise run. cold air. quiet street. this is what I fought for.', minutesAgo: 19 },
    { memberId: 'm_marcus', text: 'my daughter laughed in her sleep last night. i was right there for it.', minutesAgo: 41 },
  ],
  r_gambling: [
    { memberId: 'm_diego', text: 'almost placed a bet on the game last night. sat with my hands. didn\'t do it. day 89 still alive.', minutesAgo: 12 },
    { memberId: 'm_jordan', text: 'proud of you. that\'s the work right there.', minutesAgo: 11 },
  ],
};

// Quick canned replies users can tap
export const QUICK_REPLIES = [
  'Welcome 💚',
  'Proud of you',
  'One day at a time',
  'I hear you',
  'You\'ve got this',
  'Sending love',
  'Here if you need to talk',
  'Day 1 is day 1. Keep going.',
];
