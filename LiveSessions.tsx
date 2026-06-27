// Curated quotes — short, non-preachy, recovery-friendly.
// Attribution included where known.

export interface Quote {
  text: string;
  author: string;
}

export const QUOTES: Quote[] = [
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
  { text: "Recovery is not for people who need it. It's for people who want it.", author: "Anonymous" },
  { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "You are allowed to be both a masterpiece and a work in progress, simultaneously.", author: "Sophia Bush" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Small steps in the right direction can turn out to be the biggest step of your life.", author: "Anonymous" },
  { text: "You don't have to be perfect to be worthy.", author: "Anonymous" },
  { text: "Healing takes time, and asking for help is a courageous step.", author: "Anonymous" },
  { text: "The wound is the place where the light enters you.", author: "Rumi" },
  { text: "Be gentle with yourself. You are a child of the universe no less than the trees and the stars.", author: "Max Ehrmann" },
  { text: "Strength does not come from winning. Your struggles develop your strengths.", author: "Arnold Schwarzenegger" },
  { text: "When you come to the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { text: "You may have to fight a battle more than once to win it.", author: "Margaret Thatcher" },
  { text: "One day at a time. One hour at a time. One minute at a time. That's how you do it.", author: "Recovery wisdom" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "What we do in life echoes in eternity.", author: "Marcus Aurelius" },
  { text: "You are not your thoughts. You are the observer of your thoughts.", author: "Eckhart Tolle" },
  { text: "The version of you that you're building is worth the discomfort.", author: "Anonymous" },
  { text: "Discomfort is the price of admission to a meaningful life.", author: "Anonymous" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "If you can dream it, you can do it.", author: "Walt Disney" },
  { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
];

export function quoteForDay(days: number): Quote {
  // Stable per-day quote
  return QUOTES[days % QUOTES.length];
}
