// Hobbies, personality traits, and "things you love" tags used in onboarding.
// Sage references these in conversation.

export interface TagOption {
  id: string;
  label: string;
  emoji: string;
}

export const HOBBY_TAGS: TagOption[] = [
  { id: 'reading', label: 'Reading', emoji: '📚' },
  { id: 'writing', label: 'Writing', emoji: '✍️' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'cooking', label: 'Cooking', emoji: '🍳' },
  { id: 'coffee', label: 'Coffee snob', emoji: '☕' },
  { id: 'fitness', label: 'Fitness', emoji: '🏋️' },
  { id: 'running', label: 'Running', emoji: '🏃' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘' },
  { id: 'hiking', label: 'Hiking / outdoors', emoji: '🥾' },
  { id: 'gardening', label: 'Gardening', emoji: '🌱' },
  { id: 'art', label: 'Art / drawing', emoji: '🎨' },
  { id: 'photography', label: 'Photography', emoji: '📷' },
  { id: 'movies', label: 'Movies / TV', emoji: '🎬' },
  { id: 'podcasts', label: 'Podcasts', emoji: '🎙️' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'dogs', label: 'Dogs', emoji: '🐕' },
  { id: 'cats', label: 'Cats', emoji: '🐈' },
  { id: 'cooking-classes', label: 'Trying new foods', emoji: '🍜' },
  { id: 'crafts', label: 'Crafts / DIY', emoji: '🧶' },
  { id: 'volunteering', label: 'Volunteering', emoji: '🤝' },
  { id: 'meditation', label: 'Meditation', emoji: '🕉️' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'skateboarding', label: 'Skateboarding', emoji: '🛹' },
  { id: 'swimming', label: 'Swimming', emoji: '🏊' },
  { id: 'cycling', label: 'Cycling', emoji: '🚴' },
  { id: 'dancing', label: 'Dancing', emoji: '💃' },
  { id: 'singing', label: 'Singing', emoji: '🎤' },
  { id: 'gaming-tabletop', label: 'Board games', emoji: '🎲' },
  { id: 'fishing', label: 'Fishing', emoji: '🎣' },
];

export const PERSONALITY_TAGS: TagOption[] = [
  { id: 'introvert', label: 'Introvert', emoji: '🤫' },
  { id: 'extrovert', label: 'Extrovert', emoji: '🎉' },
  { id: 'ambivert', label: 'Ambivert', emoji: '🌗' },
  { id: 'creative', label: 'Creative', emoji: '💡' },
  { id: 'analytical', label: 'Analytical', emoji: '🔬' },
  { id: 'empathetic', label: 'Empathetic', emoji: '💗' },
  { id: 'quiet', label: 'Quiet / observant', emoji: '👀' },
  { id: 'loud', label: 'Loud / funny', emoji: '😂' },
  { id: 'perfectionist', label: 'Perfectionist', emoji: '✨' },
  { id: 'rebel', label: 'Rebellious', emoji: '🔥' },
  { id: 'planner', label: 'Planner', emoji: '📋' },
  { id: 'spontaneous', label: 'Spontaneous', emoji: '🎲' },
  { id: 'spiritual', label: 'Spiritual', emoji: '🙏' },
  { id: 'logical', label: 'Logical', emoji: '🧠' },
  { id: 'sensitive', label: 'Sensitive', emoji: '🥺' },
  { id: 'tough', label: 'Tough on myself', emoji: '💪' },
  { id: 'curious', label: 'Curious', emoji: '🔭' },
  { id: 'caring', label: 'Always caring for others', emoji: '🤲' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
  { id: 'funny', label: 'Class clown', emoji: '🤡' },
];

// Quick prompts to inspire the journey text
export const JOURNEY_PROMPTS = [
  'Anything you want me to know — your story, your triggers, what you\'re afraid of, what you\'re hoping for?',
  'You can write to me like you\'d write in a journal nobody will read. Whatever feels true.',
  'What does recovery look like for you — like really? Where do you want to be in a year?',
  'Tell me the hard stuff. What almost broke you. What brought you here. What you\'re scared of. I can take it.',
];

// City suggestions for the location step
export const CITY_SUGGESTIONS = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'Austin, TX',
  'Seattle, WA',
  'Denver, CO',
  'Boston, MA',
  'Portland, OR',
  'Atlanta, GA',
  'Miami, FL',
  'Toronto, ON',
  'Vancouver, BC',
  'London, UK',
  'Sydney, AU',
];
