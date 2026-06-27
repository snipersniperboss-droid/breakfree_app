// StayBusy — curated activities + near-you events.
// Honest version: real categories of healthy activities with real descriptions,
// and a curated set of event templates by city (not real-time, but plausible).

export type ActivityCategory = 'move' | 'create' | 'connect' | 'outdoors' | 'learn' | 'serve' | 'rest';

export const CATEGORIES: Array<{ id: ActivityCategory; label: string; emoji: string; tagline: string; color: string }> = [
  { id: 'move', label: 'Move', emoji: '🏃', tagline: 'Get your body moving', color: '#f97316' },
  { id: 'create', label: 'Create', emoji: '🎨', tagline: 'Make something', color: '#a855f7' },
  { id: 'connect', label: 'Connect', emoji: '🤝', tagline: 'Be with people', color: '#06b6d4' },
  { id: 'outdoors', label: 'Outdoors', emoji: '🌲', tagline: 'Touch grass', color: '#22c55e' },
  { id: 'learn', label: 'Learn', emoji: '📚', tagline: 'Feed your brain', color: '#3b82f6' },
  { id: 'serve', label: 'Serve', emoji: '🙌', tagline: 'Help someone', color: '#ec4899' },
  { id: 'rest', label: 'Rest', emoji: '🌙', tagline: 'Be still', color: '#8b5cf6' },
];

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  duration: string; // "10 min" / "1 hour"
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  steps?: string[]; // optional guided steps
  bestWhen?: string[]; // mood tags where this fits: ['craving', 'low', 'anxious', 'bored', 'lonely']
  // Hobby matches — activity surfaces when user has matching hobby
  hobbyMatches?: string[];
  // Personality matches
  personalityMatches?: string[];
}

export const ACTIVITIES: Activity[] = [
  // MOVE
  {
    id: 'm_walk10',
    title: '10-minute walk, no phone',
    category: 'move',
    duration: '10 min',
    difficulty: 'easy',
    description: 'Step outside. No podcast, no music, no scrolling. Just your feet and the world.',
    bestWhen: ['craving', 'anxious', 'low', 'bored'],
    hobbyMatches: ['running', 'hiking', 'cycling'],
  },
  {
    id: 'm_stretch',
    title: '5-minute full-body stretch',
    category: 'move',
    duration: '5 min',
    difficulty: 'easy',
    description: 'Slow, deliberate stretches — neck, shoulders, back, hips, legs. Breathe into each one.',
    steps: [
      'Neck rolls — slow circles both directions',
      'Shoulder rolls — 5 forward, 5 back',
      'Reach for the ceiling, then touch your toes',
      'Hip circles — hands on hips',
      'Quad stretch — hold each side 30 seconds',
    ],
    bestWhen: ['anxious', 'low'],
    hobbyMatches: ['yoga', 'fitness', 'running'],
  },
  {
    id: 'm_run',
    title: 'Run until you can\'t, then keep going 5 more minutes',
    category: 'move',
    duration: '20–40 min',
    difficulty: 'hard',
    description: 'Cravings don\'t survive a hard run. Your body will be too busy complaining to want a drink.',
    bestWhen: ['craving', 'anxious'],
    hobbyMatches: ['running', 'fitness', 'cycling'],
    personalityMatches: ['analytical', 'tough'],
  },
  {
    id: 'm_youtube',
    title: 'YouTube yoga — 15 min',
    category: 'move',
    duration: '15 min',
    difficulty: 'easy',
    description: 'Search "15 min yoga for beginners". Hit play. Follow along in your living room.',
    bestWhen: ['anxious', 'low'],
    hobbyMatches: ['yoga', 'fitness'],
    personalityMatches: ['introvert', 'ambivert'],
  },
  {
    id: 'm_dance',
    title: 'Dance alone in your kitchen',
    category: 'move',
    duration: '5–20 min',
    difficulty: 'easy',
    description: 'Put on your favorite song. The one you would never play out loud. Move.',
    bestWhen: ['low', 'bored', 'anxious'],
    hobbyMatches: ['music', 'dancing', 'singing'],
  },
  {
    id: 'm_cold_shower',
    title: 'Cold shower, 60 seconds',
    category: 'move',
    duration: '3 min',
    difficulty: 'hard',
    description: 'End your shower with 60 seconds of cold. Your brain resets. Cravings feel smaller after.',
    bestWhen: ['craving', 'anxious'],
    personalityMatches: ['tough', 'analytical'],
  },

  // CREATE
  {
    id: 'c_journal',
    title: 'Write 3 sentences about right now',
    category: 'create',
    duration: '5 min',
    difficulty: 'easy',
    description: 'Open notes app or paper. Three honest sentences. No one will read it but you.',
    steps: [
      'What just happened?',
      'How does my body feel?',
      'What do I want next?',
    ],
    bestWhen: ['low', 'anxious', 'craving'],
    hobbyMatches: ['writing', 'reading'],
  },
  {
    id: 'c_sketch',
    title: 'Draw something you can see right now',
    category: 'create',
    duration: '15 min',
    difficulty: 'easy',
    description: 'Pick an object near you. Don\'t judge. Just look at it and put lines down.',
    bestWhen: ['bored', 'low', 'anxious'],
    hobbyMatches: ['art', 'photography', 'crafts'],
    personalityMatches: ['creative', 'quiet'],
  },
  {
    id: 'c_cook',
    title: 'Cook one new recipe from scratch',
    category: 'create',
    duration: '45–90 min',
    difficulty: 'medium',
    description: 'Pick something you\'ve never made. Read the recipe. Follow it. Eat it.',
    bestWhen: ['bored', 'low'],
    hobbyMatches: ['cooking', 'cooking-classes'],
    personalityMatches: ['creative', 'analytical'],
  },
  {
    id: 'c_playlist',
    title: 'Make a 10-song playlist for tomorrow',
    category: 'create',
    duration: '20 min',
    difficulty: 'easy',
    description: 'Future-you will hit play tomorrow. Choose 10 songs that feel like the day you want.',
    bestWhen: ['low', 'bored'],
    hobbyMatches: ['music', 'singing', 'dancing'],
    personalityMatches: ['creative', 'sensitive'],
  },
  {
    id: 'c_photowalk',
    title: 'Photo walk — 10 photos of your neighborhood',
    category: 'create',
    duration: '30 min',
    difficulty: 'easy',
    description: 'Walk with your camera (phone). Take 10 photos of things you\'ve walked past 100 times.',
    bestWhen: ['bored', 'low'],
    hobbyMatches: ['photography', 'hiking', 'walking'],
  },

  // CONNECT
  {
    id: 'c_textone',
    title: 'Text one person just to say hi',
    category: 'connect',
    duration: '2 min',
    difficulty: 'easy',
    description: 'Not to talk about recovery. Just "thinking of you." One text.',
    bestWhen: ['lonely', 'low'],
    hobbyMatches: [],
  },
  {
    id: 'c_call',
    title: 'Call someone you haven\'t talked to in a while',
    category: 'connect',
    duration: '15–30 min',
    difficulty: 'medium',
    description: 'Pick the person who\'d be happy to hear from you. They\'re probably wondering why you went quiet.',
    bestWhen: ['lonely', 'craving'],
  },
  {
    id: 'c_meeting',
    title: 'Drop into a support meeting (in-app or local)',
    category: 'connect',
    duration: '60 min',
    difficulty: 'easy',
    description: 'You don\'t have to talk. Just show up. The room does the work.',
    bestWhen: ['craving', 'lonely', 'low'],
  },
  {
    id: 'c_coffee',
    title: 'Coffee with one person, no agenda',
    category: 'connect',
    duration: '60 min',
    difficulty: 'medium',
    description: 'Reach out. Make a plan. Show up. Real human time.',
    bestWhen: ['lonely', 'low'],
    hobbyMatches: ['coffee'],
  },

  // OUTDOORS
  {
    id: 'o_park',
    title: 'Sit in a park for 20 minutes',
    category: 'outdoors',
    duration: '20 min',
    difficulty: 'easy',
    description: 'Find a bench or a patch of grass. Look at trees. Notice the sky. Be outside.',
    bestWhen: ['anxious', 'low', 'bored'],
    hobbyMatches: ['hiking', 'gardening', 'photography', 'dogs'],
    personalityMatches: ['quiet', 'introvert', 'sensitive'],
  },
  {
    id: 'o_sunrise',
    title: 'Watch the sunrise or sunset',
    category: 'outdoors',
    duration: '30 min',
    difficulty: 'medium',
    description: 'Set an alarm 30 min before sunrise. Go outside. Watch.',
    bestWhen: ['low', 'craving'],
    hobbyMatches: ['photography', 'meditation'],
    personalityMatches: ['spiritual', 'sensitive', 'curious'],
  },
  {
    id: 'o_hike',
    title: 'Find a trail near you and walk it',
    category: 'outdoors',
    duration: '1–3 hours',
    difficulty: 'medium',
    description: 'Search AllTrails or Google Maps for "trails near me." Pick one. Drive. Walk.',
    bestWhen: ['craving', 'low', 'bored'],
    hobbyMatches: ['hiking', 'photography', 'running'],
    personalityMatches: ['introvert', 'analytical', 'rebel'],
  },
  {
    id: 'o_sitoutside',
    title: 'Drink coffee outside',
    category: 'outdoors',
    duration: '20 min',
    difficulty: 'easy',
    description: 'Front steps, balcony, parking lot — doesn\'t matter. Just outside.',
    bestWhen: ['anxious', 'low', 'bored'],
    hobbyMatches: ['coffee', 'reading'],
  },

  // LEARN
  {
    id: 'l_podcast',
    title: 'Listen to one recovery podcast episode',
    category: 'learn',
    duration: '20–45 min',
    difficulty: 'easy',
    description: 'Try "The Recovery Show", "Beautiful Anonymous", "The Hilarious World of Depression", or anything that speaks to you.',
    bestWhen: ['craving', 'lonely', 'bored'],
    hobbyMatches: ['podcasts', 'reading'],
  },
  {
    id: 'l_book',
    title: 'Read one chapter of anything',
    category: 'learn',
    duration: '20 min',
    difficulty: 'easy',
    description: 'A book you\'ve been meaning to finish. Or a new one. Phone off.',
    bestWhen: ['low', 'anxious', 'bored'],
    hobbyMatches: ['reading', 'writing'],
    personalityMatches: ['introvert', 'analytical'],
  },
  {
    id: 'l_skill',
    title: 'YouTube one tutorial — learn something small',
    category: 'learn',
    duration: '15 min',
    difficulty: 'easy',
    description: 'Tie a tie. Change a tire. Cook an egg. Fold a fitted sheet. Pick something tiny.',
    bestWhen: ['bored', 'low'],
    hobbyMatches: ['crafts', 'cooking', 'music'],
    personalityMatches: ['analytical', 'curious'],
  },
  {
    id: 'l_doc',
    title: 'Watch a documentary that has nothing to do with recovery',
    category: 'learn',
    duration: '60–90 min',
    difficulty: 'easy',
    description: 'Anything that pulls your brain somewhere else — true crime, space, food, history.',
    bestWhen: ['bored', 'low'],
    hobbyMatches: ['movies', 'podcasts', 'reading'],
  },

  // SERVE
  {
    id: 's_volunteer',
    title: 'Volunteer — even 1 hour',
    category: 'serve',
    duration: '1–3 hours',
    difficulty: 'medium',
    description: 'Food bank, animal shelter, community garden. Search "volunteer near me." Show up.',
    bestWhen: ['low', 'bored', 'lonely'],
    hobbyMatches: ['volunteering', 'gardening', 'dogs', 'cats'],
    personalityMatches: ['empathetic', 'caring'],
  },
  {
    id: 's_help',
    title: 'Help someone without being asked',
    category: 'serve',
    duration: '15 min',
    difficulty: 'easy',
    description: 'A neighbor\'s groceries. A coworker\'s task. A stranger\'s direction. Anything.',
    bestWhen: ['low', 'bored'],
    personalityMatches: ['empathetic', 'caring'],
  },
  {
    id: 's_call_checkin',
    title: 'Check in on someone you care about',
    category: 'serve',
    duration: '10 min',
    difficulty: 'easy',
    description: 'Pick one person. "Just thinking of you. How are you, really?"',
    bestWhen: ['low', 'lonely'],
    personalityMatches: ['empathetic', 'caring'],
  },

  // REST
  {
    id: 'r_meditate',
    title: 'Meditate for 10 minutes (guided)',
    category: 'rest',
    duration: '10 min',
    difficulty: 'easy',
    description: 'Headspace, Calm, Insight Timer, or YouTube. 10 minutes. Don\'t try to be good at it.',
    steps: [
      'Sit. Eyes closed or down.',
      'Breathe slowly. Count to 4 in, 6 out.',
      'When your mind wanders, that\'s the practice. Notice and return.',
      'After 10 minutes, give yourself a moment before opening your eyes.',
    ],
    bestWhen: ['anxious', 'craving', 'low'],
    hobbyMatches: ['meditation', 'yoga'],
    personalityMatches: ['introvert', 'spiritual', 'anxious'],
  },
  {
    id: 'r_bath',
    title: 'Take a long bath or shower',
    category: 'rest',
    duration: '20–30 min',
    difficulty: 'easy',
    description: 'Hot water. Phone in another room. Just be in it.',
    bestWhen: ['anxious', 'low'],
    personalityMatches: ['introvert', 'sensitive'],
  },
  {
    id: 'r_nothing',
    title: 'Sit and do absolutely nothing for 15 minutes',
    category: 'rest',
    duration: '15 min',
    difficulty: 'medium',
    description: 'No phone. No book. No podcast. Just sit. Notice your breathing. Be bored on purpose.',
    bestWhen: ['anxious', 'craving', 'bored'],
    personalityMatches: ['introvert', 'spiritual'],
  },
  {
    id: 'r_tea',
    title: 'Make a real cup of tea (not coffee, not rushed)',
    category: 'rest',
    duration: '15 min',
    difficulty: 'easy',
    description: 'Boil water. Warm the cup. Steep the tea. Sit with it. Drink it slowly.',
    bestWhen: ['anxious', 'low'],
    hobbyMatches: ['coffee', 'reading'],
    personalityMatches: ['introvert', 'sensitive'],
  },
];

// Curated near-you events. These are templates — in production this would call
// Eventbrite/Meetup/local APIs. Honest placeholder.
export interface LocalEvent {
  id: string;
  title: string;
  type: 'meeting' | 'class' | 'group' | 'volunteer' | 'outdoors';
  description: string;
  when: string;
  where: string;
  city: string;
  url?: string;
}

export const SAMPLE_EVENTS: LocalEvent[] = [
  { id: 'e1', title: 'AA — Morning Meeting', type: 'meeting', description: 'Open share. Coffee provided. Everyone welcome.', when: 'Daily 7:00am', where: 'Community Center', city: '*' },
  { id: 'e2', title: 'AA — Big Book Study', type: 'meeting', description: 'Working through the Big Book together. Bring yours.', when: 'Tue 7:00pm', where: 'St. Marks Church', city: '*' },
  { id: 'e3', title: 'SMART Recovery', type: 'meeting', description: 'Science-based addiction recovery. Secular. All welcome.', when: 'Wed 6:30pm', where: 'Online + select cities', city: '*' },
  { id: 'e4', title: 'Morning Walkers', type: 'group', description: 'Casual 30-min walk. Bring coffee. No agenda, just company.', when: 'Sat 8:30am', where: 'Local park', city: '*' },
  { id: 'e5', title: 'Recovery Yoga', type: 'class', description: 'Gentle yoga, all levels. Free or sliding scale.', when: 'Mon/Thu 6pm', where: 'Yoga studio', city: '*' },
  { id: 'e6', title: 'Community Volunteer Day', type: 'volunteer', description: 'Sort food, plant trees, clean parks. Show up and help.', when: 'Sat 9am–noon', where: 'Local nonprofit', city: '*' },
  { id: 'e7', title: 'Refuge Recovery (Buddhist)', type: 'meeting', description: 'Buddhist-inspired recovery. Meditation + share.', when: 'Sun 6:30pm', where: 'Meditation center', city: '*' },
  { id: 'e8', title: 'Beginners Running Club', type: 'group', description: 'Walk/run intervals. Couch to 5K style. All paces.', when: 'Tue/Thu 6am', where: 'Track at high school', city: '*' },
];

export function getEventsForCity(_city: string | undefined): LocalEvent[] {
  // Honest: we don't have real events. Show the universal set + a note.
  return SAMPLE_EVENTS;
}
void getEventsForCity;

// Mood-filtered activities
const MOOD_KEYS: Record<string, string[]> = {
  craving: ['craving'],
  low: ['low'],
  anxious: ['anxious'],
  lonely: ['lonely'],
  bored: ['bored'],
};

export function activitiesForMood(mood: string | undefined): Activity[] {
  if (!mood) return ACTIVITIES.slice(0, 6);
  const keys = MOOD_KEYS[mood] ?? [];
  return ACTIVITIES.filter((a) => a.bestWhen?.some((k) => keys.includes(k)));
}

export function activitiesForProfile(
  hobbies: string[],
  personality: string[]
): Activity[] {
  // Score each activity by how well it matches the user's profile
  return [...ACTIVITIES]
    .map((a) => {
      let score = 0;
      a.hobbyMatches?.forEach((h) => {
        if (hobbies.includes(h)) score += 2;
      });
      a.personalityMatches?.forEach((p) => {
        if (personality.includes(p)) score += 2;
      });
      return { a, score };
    })
    .sort((x, y) => y.score - x.score)
    .slice(0, 6)
    .map((s) => s.a);
}
