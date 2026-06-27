// AI Coach — Sage.
//
// She's not a therapist. She's the friend you text at 2am who actually
// remembers what you told her three days ago and isn't afraid to call you
// on your own BS — but only because she cares.
//
// What she does well:
//   - Talks like a person, not a worksheet
//   - Remembers your name, why you started, your hobbies, your city, your pattern
//   - Speaks the language of your substance, not generic "drinking"
//   - Matches responses to your mood, your stage, your time of day
//   - Knows when to be quiet, when to push, when to celebrate
//   - Has a sense of humor that lands
//   - Refers out for crisis, doesn't pretend she's a hotline

// ============ Types ============

export type Intent =
  | 'greeting'
  | 'craving'
  | 'relapse'
  | 'vent'
  | 'win'
  | 'win-minimizing'
  | 'low'
  | 'lonely'
  | 'anxious'
  | 'sleep'
  | 'anger'
  | 'gratitude'
  | 'how'
  | 'milestone'
  | 'motivation'
  | 'advice'
  | 'thanks'
  | 'smalltalk'
  | 'joke'
  | 'excuse'
  | 'self-sabotage'
  | 'avoidance'
  | 'comparing'
  | 'giving-up'
  | 'bored'
  | 'identity'        // "who am I without this"
  | 'relationship'   // partner, family, friends
  | 'work'           // job/finance stress
  | 'proud'          // user said they're proud
  | 'stuck'          // "I don't know"
  | 'unsubscribe'    // "I want to stop using this app"
  | 'unknown';

export type Tone = 'warm' | 'direct' | 'playful' | 'quiet' | 'hard-truth';
export type Technique =
  | 'presence'
  | 'validate'
  | 'reflect'
  | 'reframe'
  | 'technique'
  | 'question'
  | 'silence'
  | 'challenge'
  | 'celebrate'
  | 'callback';

// Profile hint matches — when set, this response is preferred for users matching.
export type ProfileMatch = {
  hobbies?: string[];
  personality?: string[];
  city?: boolean;
  hasWhy?: boolean;
  hasJourney?: boolean;
  daysEarly?: boolean;     // days < 14
  daysMid?: boolean;       // 14 <= days < 90
  daysLong?: boolean;      // days >= 90
  stageHard?: boolean;     // stage 4 or 5
  stageNew?: boolean;      // stage 0
  morning?: boolean;
  night?: boolean;
};

export interface CoachResponse {
  id: string;
  text: string;
  tone: Tone;
  technique: Technique;
  length: 'short' | 'medium' | 'long';
  match?: ProfileMatch;
  weight?: number;       // higher = more likely to be picked when matched
  avoidIf?: { crisis?: boolean; justUsed?: boolean };
}

// ============ Intent detection ============

const KEYWORDS: Record<Intent, RegExp[]> = {
  greeting: [/\b(hi|hey|hello|yo|sup|good (morning|afternoon|evening|night))\b/i, /\bjust checking in\b/i, /^(hey|hi|yo)[\s.,!]*(sage)?$/i],
  craving: [
    /\b(crav(e|ing|ings)|urge|tempt(ed|ation)|want(ing)? (it|a drink|to use|to smoke|to gamble|to scroll|to watch|to eat))\b/i,
    /\bthinking about (using|drinking|smoking|gambling|scrolling|watching|eating)\b/i,
    /\b(can'?t stop thinking|can'?t get (it|this) out of my head)\b/i,
  ],
  relapse: [
    /\b(relapsed|slipped|used|drank|smoked|broke(n)?|failed|gave in|had (a drink|one|two|some))\b/i,
    /\b(starting over|back to day 1|lost my (streak|count))\b/i,
    /\b(i (used|drank|smoked|binged|watched|bet|scrolled|doom[- ]scrolled|doom[- ]scrolling)|last night i)\b/i,
    /\b(i binged|binge(d)? (on|for)|doom[- ]scrolled|doom[- ]scrolling|spent \d+ hours?)\b/i,
  ],
  vent: [/\b(fuck|fucking|sucks|hate|frustrat|annoy|pissed|fed up|done with|can'?t stand)\b/i, /\b(this (is )?bullshit|shit(bro)?)\b/i],
  win: [/\b(made it|got through|survived|nailed|crushed|won|did it|proud|finally|hit \d+|reached \d+)\b/i, /\b(\d+) (day|week|month|year)s? (clean|sober|free|strong)\b/i, /\bmilestone\b/i],
  'win-minimizing': [
    /\b(it was|nothing|wasn'?t (a )?big deal|anyone could|nothing special|not (that )?impressive)\b/i,
    /\blucky( me)?\b/i,
    /\bjust (a |one )?(day|week|month|small thing)\b/i,
    /\bi shouldn'?t (brag|count|celebrate)\b/i,
    /\bwho cares\b/i,
  ],
  low: [/\b(low|down|sad|empty|numb|blah|meh|rough|hard day|terrible|awful|hopeless|invisible|shaking|can'?t cope)\b/i, /\b(can'?t (do|keep) (this|going|anymore))\b/i, /\bfeel(ing)? (like )?(shit|garbage|empty|nothing|alone)\b/i],
  lonely: [/\b(lonely|alone|no one|nobody|isolated|miss (her|him|them|my))\b/i, /\bdon'?t have anyone\b/i],
  anxious: [/\b(anxious|anxiety|panic|overwhelm(ed)?|stress(ed)?|worried|scared|nervous|racing thoughts|shaking|can'?t (breathe|think|calm))\b/i, /\bin (my )?head (all|too much)\b/i],
  sleep: [/\b(can'?t sleep|insomnia|awake|tired|exhausted|sleep|can'?t (turn off|shut (off|my brain)))\b/i, /\b(lying awake|wide awake|can'?t shut down)\b/i],
  anger: [/\b(angry|mad|furious|pissed|livid|rage)\b/i, /\b(want to (scream|hit|punch))\b/i],
  gratitude: [/\b(grateful|thankful|appreciate|gratitude)\b/i],
  how: [/\bhow (am i|are things|do i|is everything|'?s it going)\b/i],
  milestone: [/^\d+ (day|week|month|year)/i, /\bmilestone\b/i, /\b(reached|hit) (day|week|month) \d+/i],
  motivation: [/\b(no (energy|motivation|desire|willpower)|don'?t want to|want to (quit|stop|give up))\b/i, /\bcan'?t (get (started|motivated)|find the (energy|motivation))\b/i],
  advice: [/\b(what (should|do|can)|how (do|can|should)|tips|help me|suggest|what would you)\b/i],
  thanks: [/\b(thanks|thank you|appreciate it|ty|cheers|love you)\b/i],
  smalltalk: [/\b(weather|sports|game|food|movie|music|coffee|tea|cooking|recipe|book)\b/i],
  joke: [/\b(lol|haha|lmao|😂|funny|joke)\b/i],
  excuse: [
    /\b(i'?ll (do it|start|try) (tomorrow|later|next (week|month)))\b/i,
    /\b(don'?t have (time|energy|money))\b/i,
    /\b(too (busy|tired|stressed))\b/i,
    /\b(it(\'?s| was) (too )?(late|early|hard))\b/i,
    /\b(can'?t afford|don'?t have (a|any) (support|help|resources))\b/i,
    /\bjust (this )?once\b/i,
    /\bone (drink|time|more) (won'?t|doesn'?t|will not)\b/i,
    /\b(mod(eration|erate)|control(l(ed|ing))? it)\b/i,
    /\b(my (life is|problems are) (different|worse))\b/i,
  ],
  'self-sabotage': [
    /\b(might as well|what'?s the point|why (bother|try))\b/i,
    /\b(can'?t (change|be fixed|be helped))\b/i,
    /\b(always (gonna|going to) (be like this|fail|relapse))\b/i,
    /\bnever (works|works for me|gonna happen)\b/i,
    /\bi('?m| am) (a (lost cause|wreck|disaster|disappointment))\b/i,
    /\bdon'?t (deserve|earn) (this|happiness|recovery|help)\b/i,
    /\bwho am i (kidding|fooling)\b/i,
  ],
  avoidance: [
    /\b(whatever|doesn'?t matter|fine|i don'?t know|don'?t wanna (talk|think))\b/i,
    /\bforget it|never mind|let'?s not\b/i,
    /\bwhatever,?\s*(it'?s )?fine\b/i,
    /^(ok|okay|k|sure|yeah|yep|lol|haha|idk)\.?$/i,
  ],
  bored: [
    /\b(bored|boring|nothing to do|nothing'?s on)\b/i,
    /\bkill(ing)? time\b/i,
  ],
  comparing: [
    /\b(others?|they|someone) (have|had) it (worse|easier)\b/i,
    /\bthey (can|could) do it (so )?(why can'?t i)\b/i,
    /\beveryone else\b/i,
    /\b(not as bad|not as (good|far)) as\b/i,
    /\b(other people|them) (recover|got better|quit) (faster|easier)\b/i,
  ],
  'giving-up': [
    /\bgive( up|ning up)\b/i,
    /\b(done|finished) (with (this|recovery|trying))\b/i,
    /\bcan'?t (anymore|do this)\b/i,
    /\bi quit\b/i,
    /\bthat'?s it,? i'?m out\b/i,
  ],
  identity: [
    /\bwho am i (without|now that|anymore)\b/i,
    /\bdon'?t (even )?know who i am\b/i,
    /\bfeel(ing)? like (a )?(stranger|ghost|empty shell|nobody)\b/i,
    /\bwhat am i (supposed to do|now|going to do)\b/i,
    /\b(identity|don'?t (recognize|know) myself)\b/i,
    /\b(who (am i|have i) (become|been))\b/i,
  ],
  relationship: [
    /\b(partner|wife|husband|boyfriend|girlfriend|kid|child|son|daughter|mom|dad|mother|father|friend|family)\b/i,
    /\b(marriage|relationship|dating|breakup|divorce|argument)\b/i,
    /\b(my (partner|wife|husband|kid|mom|dad) (and i|said|did|left))\b/i,
  ],
  work: [
    /\b(work|job|boss|coworker|interview|fired|laid off|promotion|career|salary|money|debt|bills|rent)\b/i,
    /\b(can'?t (focus|concentrate) at work)\b/i,
  ],
  proud: [
    /\b(i('?m| am) (proud|happy|glad) (of (myself|this)|with))\b/i,
    /\b(didn'?t think i could|nailed it|figure(d)? it out)\b/i,
  ],
  stuck: [
    /\b(don'?t know (what|how|why|where)|not sure|confused|lost|no idea)\b/i,
    /\bi('?m| am) stuck\b/i,
  ],
  unsubscribe: [
    /\b(uninstall|delete|stop (using )?this|won'?t use|don'?t need this|giving up on (this )?(app|sage))\b/i,
    /\b(quit(t?ing)? (this )?(app|sage|you|breakfree))\b/i,
    /\b(don'?t (need|want) (this|the) (app|sage))\b/i,
    /\b(close (this|the) (app|sage))\b/i,
  ],
  unknown: [],
};

export function detectIntent(text: string): Intent {
  const t = text.toLowerCase().trim();
  let best: Intent = 'unknown';
  let bestScore = 0;
  for (const intent of Object.keys(KEYWORDS) as Intent[]) {
    let score = 0;
    for (const re of KEYWORDS[intent]) {
      const m = t.match(re);
      if (m) score += m[0].split(/\s+/).length + 1;
    }
    // Boost: if craving/relapse keywords are present, weight them higher
    // so "what do I do when the urge hits" routes to craving, not advice
    if (intent === 'craving' && /\b(crav|urge|want(ing)?|tempt(ation|ed))\b/i.test(t)) score += 4;
    if (intent === 'relapse' && /\b(slip|relaps|used|drank|smoked|broke(n)?|failed)\b/i.test(t)) score += 4;
    if (intent === 'anxious' && /\b(anxious|anxiety|panic|overwhelm|stress)\b/i.test(t)) score += 3;
    if (intent === 'low' && /\b(low|down|sad|empty|numb|hopeless)\b/i.test(t)) score += 3;
    if (intent === 'lonely' && /\b(lonely|alone|nobody|isolated)\b/i.test(t)) score += 3;
    if (intent === 'sleep' && /\b(can'?t sleep|insomnia|awake|exhausted|sleep)\b/i.test(t)) score += 3;
    if (intent === 'sleep' && /\b(sleep)/i.test(t) && t.length < 12) score += 6;
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  return best;
}

// ============ Crisis detection ============

const CRISIS_PATTERNS = [
  /\bkill(ing)? myself\b/i,
  /\bsuicid(e|al)\b/i,
  /\b(end it|want to die|better off (dead|without me))\b/i,
  /\bself[- ]harm(ing)?\b/i,
  /\bdon'?t want to (live|be here|wake up)\b/i,
  /\bhurt(ing)? myself\b/i,
];

export function detectCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some((re) => re.test(text));
}

export function crisisResponse(name?: string): string {
  const who = name ? ` ${name}` : '';
  return `hey${who}. i hear you. and i'm gonna be really honest with you: this is bigger than what i can hold.\n\nright now please reach a person:\n• call or text **988** (US)\n• text HOME to **741741**\n• findahelpline.com for your country\n\ni'm not going anywhere. but you deserve a human tonight. will you reach out to one of those?`;
}

// ============ Substance vocabulary ============
// Different substances, different language. Sage doesn't say "drink" to a sugar addict.

export type SubstanceKey =
  | 'alcohol'
  | 'drugs'
  | 'gambling'
  | 'porn'
  | 'social-media'
  | 'sugar'
  | 'smoking'
  | 'other';

export interface SubstanceVocab {
  label: string;          // "drink", "use", "bet", "look", "scroll", "eat", "smoke", "thing"
  act: string;            // "drinking", "using", "gambling", "watching", "scrolling", "binging", "smoking"
  recoveryNoun: string;   // "sober", "clean", "free", "off it", "free"
  urgeNoun: string;       // "craving", "urge", "itch", "pull"
  relapsePast: string;    // "drank", "used", "gambled", "watched", "scrolled", "binged", "smoked"
}

const SUBSTANCE_VOCAB: Record<SubstanceKey, SubstanceVocab> = {
  'alcohol':      { label: 'drink',    act: 'drinking',  recoveryNoun: 'sober',   urgeNoun: 'craving', relapsePast: 'drank' },
  'drugs':        { label: 'use',      act: 'using',     recoveryNoun: 'clean',   urgeNoun: 'urge',    relapsePast: 'used' },
  'gambling':     { label: 'bet',      act: 'gambling',  recoveryNoun: 'off it',  urgeNoun: 'itch',    relapsePast: 'placed a bet' },
  'porn':         { label: 'look',     act: 'watching',  recoveryNoun: 'free',    urgeNoun: 'pull',    relapsePast: 'watched' },
  'social-media': { label: 'scroll',   act: 'doom-scrolling', recoveryNoun: 'off it', urgeNoun: 'pull', relapsePast: 'doom-scrolled' },
  'sugar':        { label: 'eat',      act: 'binging',   recoveryNoun: 'free',    urgeNoun: 'hunger',  relapsePast: 'binged' },
  'smoking':      { label: 'smoke',    act: 'smoking',   recoveryNoun: 'smoke-free', urgeNoun: 'craving', relapsePast: 'smoked' },
  'other':        { label: 'thing',    act: 'using',     recoveryNoun: 'free',    urgeNoun: 'pull',    relapsePast: 'used' },
};

export function getVocab(substance?: string): SubstanceVocab {
  if (substance && substance in SUBSTANCE_VOCAB) {
    return SUBSTANCE_VOCAB[substance as SubstanceKey];
  }
  return SUBSTANCE_VOCAB.other;
}

// ============ Context builder ============

export interface CoachContext {
  days: number;
  stage: number;
  name?: string;
  why?: string;
  substance?: string;
  recentMood?: number | null;
  recentCravings?: number | null;
  recentWins?: string[];
  hobbies?: string[];
  personality?: string[];
  journey?: string;
  city?: string;
  conversationHistory?: Array<{ role: 'user' | 'coach'; text: string }>;
  lastIntent?: Intent | null;
  usedResponseIds?: Set<string>;
  hourNow?: number;
  winCount?: number;
  checkInStreak?: number;
}

function timeOfDay(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
  if (hour < 5) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  if (hour < 22) return 'evening';
  return 'night';
}

function profileMatches(match: ProfileMatch | undefined, ctx: CoachContext): boolean {
  if (!match) return true;
  const hour = ctx.hourNow ?? new Date().getHours();
  const tod = timeOfDay(hour);
  if (match.hobbies && match.hobbies.some((h) => (ctx.hobbies ?? []).includes(h))) return true;
  if (match.personality && match.personality.some((p) => (ctx.personality ?? []).includes(p))) return true;
  if (match.city && ctx.city && ctx.city.trim().length > 0) return true;
  if (match.hasWhy && ctx.why && ctx.why.trim().length > 0) return true;
  if (match.hasJourney && ctx.journey && ctx.journey.trim().length > 5) return true;
  if (match.daysEarly && ctx.days < 14) return true;
  if (match.daysMid && ctx.days >= 14 && ctx.days < 90) return true;
  if (match.daysLong && ctx.days >= 90) return true;
  if (match.stageHard && ctx.stage >= 4) return true;
  if (match.stageNew && ctx.stage === 0) return true;
  if (match.morning && tod === 'morning') return true;
  if (match.night && (tod === 'night' || tod === 'evening')) return true;
  return false;
}

// ============ Tone picker ============

function pickTone(intent: Intent, ctx: CoachContext): Tone {
  const lowMood = (ctx.recentMood ?? 3) <= 2;
  const recentUserMsgs = (ctx.conversationHistory ?? []).filter((m) => m.role === 'user').slice(-4);
  const stuckCount = recentUserMsgs.filter((m) => detectIntent(m.text) === intent).length;

  // Same complaint 3+ turns → push
  if (stuckCount >= 3) return 'hard-truth';

  // Heavy intents: hard truth or direct
  if (['self-sabotage', 'giving-up', 'win-minimizing', 'unsubscribe'].includes(intent)) {
    return stuckCount >= 2 ? 'hard-truth' : 'direct';
  }
  if (['excuse', 'avoidance', 'comparing'].includes(intent)) {
    return stuckCount >= 2 ? 'hard-truth' : 'direct';
  }
  if (intent === 'craving' || intent === 'relapse') return 'direct';
  if (intent === 'bored' || intent === 'stuck' || intent === 'avoidance') {
    return stuckCount >= 2 ? 'hard-truth' : 'direct';
  }
  if (['win', 'proud', 'milestone', 'gratitude', 'thanks'].includes(intent)) {
    return (ctx.winCount ?? 0) >= 1 ? 'playful' : 'warm';
  }
  if (['low', 'lonely', 'sleep', 'anger', 'vent', 'relationship', 'work'].includes(intent)) {
    if (lowMood) return 'warm';
    if (stuckCount >= 2) return 'direct';
    return 'warm';
  }
  if (intent === 'anxious') return 'quiet';
  if (intent === 'identity') return 'quiet';

  const h = ctx.hourNow ?? new Date().getHours();
  if (h < 7 || h >= 22) return 'quiet';
  if (lowMood) return 'warm';
  if (ctx.stage <= 1) return 'warm';
  return 'direct';
}

// ============ Response bank ============

type Bank = Partial<Record<Intent, CoachResponse[]>>;

const BANK: Bank = {
  greeting: [
    { id: 'g1', text: "hey. good to see you.", tone: 'warm', technique: 'presence', length: 'short' },
    { id: 'g2', text: "hey. how's your body right now? chest tight? jaw? gut? that's the truest answer.", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'g3', text: "hi. glad you came in.", tone: 'warm', technique: 'presence', length: 'short' },
    { id: 'g4', text: "hey. what's on your mind — even if it's nothing specific yet.", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'g5', text: "you're here. that's the part that matters today.", tone: 'quiet', technique: 'validate', length: 'short' },
    { id: 'g6', text: "morning. before we get into anything — water? food? outside?", tone: 'direct', technique: 'technique', length: 'short', match: { morning: true } },
    { id: 'g7', text: "hey. one breath. then we'll see what's next.", tone: 'quiet', technique: 'technique', length: 'short' },
    { id: 'g8', text: "hi. no agenda here. just me and whatever you want to bring.", tone: 'warm', technique: 'presence', length: 'short' },
    { id: 'g9', text: "hey. tell me one real thing from today.", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'g10', text: "you're here. i noticed. what brought you in?", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'g11', text: "hey. late night check-in? i'm up.", tone: 'quiet', technique: 'presence', length: 'short', match: { night: true } },
    { id: 'g12', text: "good morning. how'd you sleep? not the polite answer — the real one.", tone: 'direct', technique: 'question', length: 'short', match: { morning: true } },
    { id: 'g13', text: "hey {name}. what's today asking of you?", tone: 'warm', technique: 'question', length: 'short' },
  ],

  craving: [
    // default
    { id: 'c1', text: "okay. the {label} is loud right now. that doesn't mean you have to be.", tone: 'quiet', technique: 'validate', length: 'short' },
    { id: 'c2', text: "ride it. ten minutes. set a timer. it won't feel like this in ten minutes.", tone: 'direct', technique: 'technique', length: 'short' },
    { id: 'c3', text: "cold water on your face. literally. right now. then come back.", tone: 'direct', technique: 'technique', length: 'short' },
    { id: 'c4', text: "where are you right now — physically? name three things you can see.", tone: 'direct', technique: 'technique', length: 'short' },
    { id: 'c5', text: "the urge is doing what it does. you don't have to do what it does.", tone: 'quiet', technique: 'reframe', length: 'short' },
    { id: 'c6', text: "{name}, you've ridden waves like this before. you know they break. stay on the board.", tone: 'warm', technique: 'reframe', length: 'short' },
    { id: 'c7', text: "phone down. hands busy. body moving. pick one.", tone: 'direct', technique: 'technique', length: 'short' },
    { id: 'c8', text: "breathe with me. in for 4. out for 8. four rounds. i can wait.", tone: 'quiet', technique: 'technique', length: 'short' },
    { id: 'c9', text: "what's the actual feeling underneath the {urgeNoun}? tired? lonely? bored? the urge usually has a job.", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'c10', text: "the {label} won't fix the thing it's promising to fix. you already know that. but knowing it doesn't make the want go away. so what will you do in the next fifteen minutes?", tone: 'direct', technique: 'challenge', length: 'medium' },
    // hobby: reading
    { id: 'c11', text: "you said you're a reader. pick up whatever's closest. read one page. then another. let someone else's world swallow yours for a bit.", tone: 'warm', technique: 'technique', length: 'medium', match: { hobbies: ['reading'] } },
    // hobby: music
    { id: 'c12', text: "you love music. one song. the one that always hits right. headphones on, eyes closed, let it wash through you.", tone: 'warm', technique: 'technique', length: 'medium', match: { hobbies: ['music'] } },
    // hobby: running / fitness
    { id: 'c13', text: "you run. lace up. door. don't think, just go. move until the want can't keep up.", tone: 'direct', technique: 'technique', length: 'short', match: { hobbies: ['running', 'fitness', 'gym'] } },
    // hobby: cooking
    { id: 'c14', text: "you're a cook. go make something. anything. even toast with cinnamon sugar. your hands need a job and your kitchen needs you.", tone: 'warm', technique: 'technique', length: 'medium', match: { hobbies: ['cooking', 'baking'] } },
    // hobby: yoga / meditation
    { id: 'c15', text: "sit on the floor. ten minutes. close your eyes. one breath in for 4, out for 8. don't try to be good at it.", tone: 'quiet', technique: 'technique', length: 'short', match: { hobbies: ['yoga', 'meditation'] } },
    // hobby: art
    { id: 'c16', text: "you make things. draw the first thing your eye lands on. ugly is fine. small is fine. just make a mark.", tone: 'warm', technique: 'technique', length: 'short', match: { hobbies: ['art', 'crafts', 'photography'] } },
    // hobby: gaming
    { id: 'c17', text: "load up something familiar. twenty minutes of a world you know. let it carry you.", tone: 'direct', technique: 'technique', length: 'short', match: { hobbies: ['gaming', 'gaming-tabletop'] } },
    // city
    { id: 'c18', text: "you're in {city}. step outside your door and walk one block. just one. sometimes leaving the room is enough.", tone: 'direct', technique: 'technique', length: 'short', match: { city: true } },
    // early days
    { id: 'c19', text: "these early days are the hardest mountain. every {urgeNoun} you ride makes the next one weaker. stay on the path.", tone: 'warm', technique: 'validate', length: 'short', match: { daysEarly: true } },
    // long streak
    { id: 'c20', text: "{days} days. and the {label} still shows up sometimes. that's not failure. that's what {days} days looks like from the inside. don't let it lie to you about how far you've come.", tone: 'warm', technique: 'reframe', length: 'medium', match: { daysLong: true } },
    // late night
    { id: 'c21', text: "the want is loudest when it's dark and quiet. that's a real thing. don't trust the 1am version of the {label}. wait until morning.", tone: 'quiet', technique: 'reframe', length: 'medium', match: { night: true } },
    // personality: creative
    { id: 'c22', text: "you're a creative. channel this — write the want down, ugly, all of it. then rip the page up. see who wins.", tone: 'playful', technique: 'technique', length: 'short', match: { personality: ['creative'] } },
    // personality: curious
    { id: 'c23', text: "you're curious. get curious about the craving itself. what does it actually want? sit with it like a question, not a verdict.", tone: 'direct', technique: 'question', length: 'short', match: { personality: ['curious'] } },
  ],

  relapse: [
    { id: 'r1', text: "okay. you {relapsePast}. it's done. it's not the end of anything. one thing right now: drink a big glass of water.", tone: 'direct', technique: 'technique', length: 'short' },
    { id: 'r2', text: "look. i know what your head is doing right now. the all-or-nothing voice is loud. hear me: one {label} is not the same as the old pattern. you can stop here. you can stop right here.", tone: 'hard-truth', technique: 'challenge', length: 'medium' },
    { id: 'r3', text: "don't reset the counter to zero. that's a lie. you didn't lose {days} days. you {relapsePast} once. there's a difference, even if you can't feel it yet.", tone: 'direct', technique: 'reframe', length: 'medium' },
    { id: 'r4', text: "what happened? not the {label} — what was underneath it. talk to me.", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'r5', text: "i'm not going anywhere. you can be honest with me. what did you do, and when, and how are you feeling right now?", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'r6', text: "okay. that's the {label}. now — are you safe? do you need to call someone? i can wait here while you text a friend.", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'r7', text: "the next hour matters more than the last one. make it boring. water, blanket, no big decisions. that's the move.", tone: 'direct', technique: 'technique', length: 'short' },
    { id: 'r8', text: "be gentle with yourself today. and gentle doesn't mean permissive. it means: this is one data point. you get to write the next line.", tone: 'warm', technique: 'reframe', length: 'medium' },
    { id: 'r9', text: "you told me on day one: {why_phrase}. that person didn't disappear because of one slip. they just need you to pick the thread back up.", tone: 'warm', technique: 'callback', length: 'medium', match: { hasWhy: true } },
    { id: 'r10', text: "the urge to spiral is itself a craving. you can ride it the same way.", tone: 'quiet', technique: 'reframe', length: 'short' },
    { id: 'r11', text: "we're not doing shame today. we're not doing 'i knew it.' we're doing: okay, what now. one foot in front of the other.", tone: 'hard-truth', technique: 'challenge', length: 'short' },
    { id: 'r12', text: "you {relapsePast} — now the work is keeping the next one from happening. just the next one. that's all you owe yourself today.", tone: 'direct', technique: 'technique', length: 'short' },
  ],

  vent: [
    { id: 'v1', text: "yeah. that sounds like a lot. keep going if you want.", tone: 'warm', technique: 'presence', length: 'short' },
    { id: 'v2', text: "i hear you. that does suck.", tone: 'warm', technique: 'validate', length: 'short' },
    { id: 'v3', text: "okay i'm mad on your behalf. what happened?", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'v4', text: "breathe. you're safe here. what's the worst part?", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'v5', text: "you don't need to be okay about it. sometimes things just suck.", tone: 'quiet', technique: 'validate', length: 'short' },
    { id: 'v6', text: "tell me the part that made you the angriest. just that part.", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'v7', text: "i'm here. and i can take it. vent.", tone: 'warm', technique: 'presence', length: 'short' },
    { id: 'v8', text: "okay so that's the situation. what do you wish someone would say to you right now?", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'v9', text: "fair. that is fair to be pissed about.", tone: 'warm', technique: 'validate', length: 'short' },
    { id: 'v10', text: "{name}, you don't have to perform being fine here. not with me.", tone: 'warm', technique: 'validate', length: 'short' },
    { id: 'v11', text: "do you want me to listen, or do you want me to help you figure out what to do? i'll do whichever.", tone: 'direct', technique: 'question', length: 'short' },
  ],

  win: [
    { id: 'w1', text: "LET'S GO. that's the kind of thing i want to hear all day.", tone: 'playful', technique: 'celebrate', length: 'short' },
    { id: 'w2', text: "{name}. i'm so proud of you. i know that sounds small. it isn't.", tone: 'warm', technique: 'celebrate', length: 'short' },
    { id: 'w3', text: "look at you. the version of you that did this is the one you keep building. say it out loud: i did that.", tone: 'playful', technique: 'celebrate', length: 'short' },
    { id: 'w4', text: "okay i'm a little emotional. that's a real win. don't you dare brush it off.", tone: 'warm', technique: 'celebrate', length: 'short' },
    { id: 'w5', text: "{days} days. you earned every single one. don't let anyone — including you — tell you otherwise.", tone: 'warm', technique: 'celebrate', length: 'short', match: { daysLong: true } },
    { id: 'w6', text: "huge. hug. if i could, i would. you know that right?", tone: 'playful', technique: 'celebrate', length: 'short' },
    { id: 'w7', text: "this is the day you'll remember later when it gets hard. write down what it felt like right now, even a sentence. you'll want it.", tone: 'warm', technique: 'technique', length: 'medium' },
    { id: 'w8', text: "i want you to do something embarrassing: smile at yourself in a mirror. right now. you earned that face.", tone: 'playful', technique: 'technique', length: 'short' },
    { id: 'w9', text: "you remember who you said you wanted to be on day one? closer today. by an actual day. let that land.", tone: 'warm', technique: 'callback', length: 'medium', match: { hasWhy: true } },
    { id: 'w10', text: "okay now text someone you love and tell them. real wins don't count if you keep them quiet.", tone: 'playful', technique: 'technique', length: 'short' },
    { id: 'w11', text: "do you realize what you just did? not the thing — the choice before the thing. you chose different. that's the actual win.", tone: 'warm', technique: 'reframe', length: 'medium' },
  ],

  'win-minimizing': [
    { id: 'wm1', text: "stop. just — no. you don't get to shrink this. you did a hard thing. sit with that for one second before you tell me it's nothing.", tone: 'hard-truth', technique: 'challenge', length: 'short' },
    { id: 'wm2', text: "if a friend told you what you just told me, would you let them off the hook that easy? then don't do it to yourself.", tone: 'direct', technique: 'reframe', length: 'medium' },
    { id: 'wm3', text: "{name}, this is the part of recovery nobody warns you about: accepting the win. you're allowed to. practice.", tone: 'warm', technique: 'challenge', length: 'short' },
    { id: 'wm4', text: "i hear you minimizing. i'm not buying it. what's the actual fear underneath — that if you claim it, you'll have to keep it?", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'wm5', text: "your old voice — the one that says it's not a big deal — is the same one that said one more wouldn't hurt. you don't have to listen to it anymore.", tone: 'hard-truth', technique: 'challenge', length: 'medium' },
    { id: 'wm6', text: "you don't have to be impressive. you just have to be honest with yourself. so be honest: that was a win. say it.", tone: 'warm', technique: 'challenge', length: 'short' },
  ],

  low: [
    { id: 'l1', text: "yeah. those days happen. you don't have to fix them. just get to the other side of it.", tone: 'quiet', technique: 'validate', length: 'short' },
    { id: 'l2', text: "what do you need right now — a person, a distraction, or someone to just sit with you for a minute?", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'l3', text: "i'm here. you don't have to perform being okay.", tone: 'quiet', technique: 'presence', length: 'short' },
    { id: 'l4', text: "is this a 'tired' low or a 'soul' low? the second one is the kind we slow down for.", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'l5', text: "you've been running low for a while. we don't have to fix it today. just one breath. then the next one.", tone: 'quiet', technique: 'validate', length: 'medium' },
    { id: 'l6', text: "{name}, low days don't get a vote on who you are. they get a seat at the table and then they leave.", tone: 'warm', technique: 'reframe', length: 'short' },
    { id: 'l7', text: "is there one small thing you could do that would be kind to yourself in the next ten minutes? just one.", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'l8', text: "okay so today's a low day. what does tomorrow look like if you just let today be a low day?", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'l9', text: "you said on day one: {why_phrase}. you don't have to feel like that right now. you just have to not {act} tonight.", tone: 'quiet', technique: 'callback', length: 'medium', match: { hasWhy: true } },
    // hobby: music
    { id: 'l10', text: "you're a music person. put on the song that always holds you. just that one. let it do its job.", tone: 'warm', technique: 'technique', length: 'short', match: { hobbies: ['music'] } },
    // hobby: reading
    { id: 'l11', text: "you read to get out of your head. pick the lightest book on your shelf. no big ideas tonight. just a story.", tone: 'warm', technique: 'technique', length: 'short', match: { hobbies: ['reading'] } },
    // night
    { id: 'l12', text: "nights are the worst. the world gets quiet and your head gets loud. you don't have to solve it at midnight. you can sleep on it.", tone: 'quiet', technique: 'reframe', length: 'medium', match: { night: true } },
  ],

  lonely: [
    { id: 'lo1', text: "that's a hard one. loneliness has a way of whispering that nobody would notice. that's a lie, by the way.", tone: 'warm', technique: 'validate', length: 'short' },
    { id: 'lo2', text: "do you want to talk to me about it, or do you want company while you sit in it?", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'lo3', text: "text someone. anyone. not a big message — 'thinking of you' is enough. you don't have to be vulnerable. just open a door.", tone: 'direct', technique: 'technique', length: 'short' },
    { id: 'lo4', text: "i know it feels like everyone has people and you don't. i promise there are people who would pick up if you called.", tone: 'warm', technique: 'reframe', length: 'medium' },
    { id: 'lo5', text: "this is the one craving the {label} is really, really good at pretending to fix. it won't.", tone: 'direct', technique: 'reframe', length: 'short' },
    { id: 'lo6', text: "you're not alone. i'm here. and somewhere right now there's a person who would want to know you were thinking of them.", tone: 'warm', technique: 'validate', length: 'short' },
  ],

  anxious: [
    { id: 'an1', text: "okay. name five things you can see right now. out loud if you can.", tone: 'direct', technique: 'technique', length: 'short' },
    { id: 'an2', text: "where is it in your body right now — the anxiety? chest? stomach? hands?", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'an3', text: "one breath in for 4. out for 8. longer out than in. four rounds. i can wait.", tone: 'quiet', technique: 'technique', length: 'short' },
    { id: 'an4', text: "is the worry about something real that's happening, or about something your head made up at 2am? both count. but they need different medicine.", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'an5', text: "you're not in danger right now. the body doesn't know that yet. help it. feet on the floor. cold water on your wrists. one breath.", tone: 'quiet', technique: 'technique', length: 'medium' },
    { id: 'an6', text: "i'm not going to tell you not to worry. but i am going to ask: what's the smallest next thing? not the big scary thing — the very next step.", tone: 'warm', technique: 'question', length: 'medium' },
  ],

  sleep: [
    { id: 'sl1', text: "what time is it where you are? 3am thinking is the worst thinking. nothing good happens in the brain at 3am.", tone: 'direct', technique: 'question', length: 'short', match: { night: true } },
    { id: 'sl2', text: "phone face down. screen away. eyes closed. count backwards from 300 by 3s. boring is the point.", tone: 'direct', technique: 'technique', length: 'short' },
    { id: 'sl3', text: "is your brain doing the thing where it replays every conversation from 2014? yeah. that's a real thing. name one of them, out loud, then let it go.", tone: 'warm', technique: 'technique', length: 'medium' },
    { id: 'sl4', text: "do you want me to just be here while you try to sleep? i can keep you company.", tone: 'warm', technique: 'presence', length: 'short' },
    { id: 'sl5', text: "okay. warm shower. then bed. nothing else tonight. tomorrow is tomorrow.", tone: 'direct', technique: 'technique', length: 'short' },
  ],

  anger: [
    { id: 'ag1', text: "okay. that's valid. what do you want to punch right now — actually or metaphorically?", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'ag2', text: "anger is the body's alarm. it means something got crossed. we don't have to act on it — but we should listen.", tone: 'warm', technique: 'reframe', length: 'short' },
    { id: 'ag3', text: "go outside. walk fast. let the anger move through your legs, not your hands. ten minutes. then come back.", tone: 'direct', technique: 'technique', length: 'short' },
    { id: 'ag4', text: "yell into a pillow. i'm serious. just let it out. nobody's watching.", tone: 'playful', technique: 'technique', length: 'short' },
  ],

  gratitude: [
    { id: 'gr1', text: "look at you. let it land. you don't have to perform being grateful — just notice it.", tone: 'warm', technique: 'validate', length: 'short' },
    { id: 'gr2', text: "good. that matters. write it down somewhere — your phone notes, the back of a receipt, anywhere. you'll want to find it later.", tone: 'warm', technique: 'technique', length: 'short' },
    { id: 'gr3', text: "you know what's wild? gratitude and the {label} can't both drive the car at the same time. this is you taking the wheel.", tone: 'warm', technique: 'reframe', length: 'short' },
  ],

  how: [
    { id: 'h1', text: "honestly? i don't know — only you do. but if your body is calm and your head is clear, that's a good day. how's the body?", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'h2', text: "today specifically, or the arc generally? both fair questions.", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'h3', text: "you've been at this {days} days. that's not nothing. how are you — really, not the answer you'd give your mom.", tone: 'direct', technique: 'question', length: 'short' },
  ],

  milestone: [
    { id: 'ml1', text: "{days} days. look at you. you did that. nobody else. just you, one day at a time, {days} times.", tone: 'warm', technique: 'celebrate', length: 'short' },
    { id: 'ml2', text: "milestone. for real. i'm not going to be chill about this. that's a thing you should be proud of for the rest of your life.", tone: 'playful', technique: 'celebrate', length: 'short' },
    { id: 'ml3', text: "okay. pause everything. take a breath. you earned a moment of just — feeling it. don't skip past this.", tone: 'warm', technique: 'celebrate', length: 'short' },
  ],

  motivation: [
    { id: 'mo1', text: "you don't need motivation. motivation is a liar. you need a 5-minute version of the next thing. what's the smallest possible start?", tone: 'hard-truth', technique: 'reframe', length: 'short' },
    { id: 'mo2', text: "what's the version of you that just does the thing without feeling ready? what would she do in the next 60 seconds?", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'mo3', text: "motivation comes after movement, not before. do one tiny thing — make the bed, drink water, put on shoes. then check in with me.", tone: 'direct', technique: 'technique', length: 'short' },
  ],

  advice: [
    { id: 'ad1', text: "tell me more. what's the situation? i'll think with you.", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'ad2', text: "what does your gut say? you probably already know the answer — you just want someone to say it back to you.", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'ad3', text: "okay here's my honest take. but you live in your life, not me. take what fits, leave the rest.", tone: 'direct', technique: 'reframe', length: 'short' },
  ],

  thanks: [
    { id: 'th1', text: "anytime. i mean that. come back whenever you need to.", tone: 'warm', technique: 'presence', length: 'short' },
    { id: 'th2', text: "you did the work, not me. but i'll take the thanks. 😊", tone: 'playful', technique: 'presence', length: 'short' },
    { id: 'th3', text: "love you too, {name}. proud of you. don't be a stranger.", tone: 'warm', technique: 'presence', length: 'short' },
  ],

  smalltalk: [
    { id: 'st1', text: "ha. i love that. tell me more.", tone: 'playful', technique: 'question', length: 'short' },
    { id: 'st2', text: "okay you're a {hobbyHint} person — that tracks. what's the last one you tried?", tone: 'playful', technique: 'question', length: 'short' },
    { id: 'st3', text: "you know what, that sounds like the kind of thing {name} would love. what made you think of it?", tone: 'warm', technique: 'question', length: 'short' },
  ],

  joke: [
    { id: 'jk1', text: "lol. you're silly. i like that about you.", tone: 'playful', technique: 'presence', length: 'short' },
    { id: 'jk2', text: "ha! you sound like you're doing okay today. good.", tone: 'playful', technique: 'celebrate', length: 'short' },
  ],

  excuse: [
    { id: 'ex1', text: "i hear the excuse. i'm not buying it. you have time for the thing that matters to you — and you decided this matters. so what now?", tone: 'hard-truth', technique: 'challenge', length: 'short' },
    { id: 'ex2', text: "tomorrow-you is going to be even more tired than today-you. that's how this works. what can you do in the next 5 minutes that's harder than tomorrow?", tone: 'direct', technique: 'challenge', length: 'short' },
    { id: 'ex3', text: "the voice that says 'just this once' is the same one you'll hear tomorrow saying 'just this once' again. you know that. so — what's the real reason?", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'ex4', text: "your life isn't different. your brain is looking for a loophole. it has been doing this for years. you don't have to outsmart it — you just have to not move.", tone: 'hard-truth', technique: 'challenge', length: 'medium' },
  ],

  'self-sabotage': [
    { id: 'ss1', text: "stop. i need you to hear me: that voice is the {label} talking. it is not you. you don't have to obey it.", tone: 'hard-truth', technique: 'challenge', length: 'short' },
    { id: 'ss2', text: "you said on day one you wanted {why_phrase}. that person is still in there. don't let this 30-second thought erase them.", tone: 'warm', technique: 'callback', length: 'medium', match: { hasWhy: true } },
    { id: 'ss3', text: "'might as well' is the most expensive lie the {label} ever sold. it's a trap, and you know it's a trap, and you're standing in it anyway. so step out. one foot.", tone: 'hard-truth', technique: 'challenge', length: 'medium' },
    { id: 'ss4', text: "you can think the sabotaging thought and not do the sabotaging thing. they're not the same. you've done it before. do it now.", tone: 'direct', technique: 'reframe', length: 'short' },
    { id: 'ss5', text: "what would the version of you on day 365 say to the version of you right now? i'll bet i know. listen to her.", tone: 'warm', technique: 'question', length: 'short' },
  ],

  avoidance: [
    { id: 'av1', text: "okay. you don't want to talk about it. that tells me it's important. but you don't have to — do you want to do something else with me for a few minutes?", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'av2', text: "'fine' isn't an answer, friend. you know that. but i'll meet you where you are. what's the smallest thing you're willing to say out loud?", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'av3', text: "i'm going to sit here with you. you don't have to talk. but if you want to, i'm listening.", tone: 'quiet', technique: 'presence', length: 'short' },
    { id: 'av4', text: "i notice you keep saying you're fine. and i notice you keep coming back here. those two things might be the same thing.", tone: 'direct', technique: 'reframe', length: 'short' },
  ],

  bored: [
    { id: 'br1', text: "bored is the {label} whispering. what would feel alive right now — even a little bit? doesn't have to be productive.", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'br2', text: "go do something with your hands. cook. draw. clean a drawer. the body needs a job.", tone: 'direct', technique: 'technique', length: 'short' },
    { id: 'br3', text: "you're in {city} — go somewhere you haven't been in your own city yet. even a different coffee shop counts.", tone: 'direct', technique: 'technique', length: 'short', match: { city: true } },
    { id: 'br4', text: "text a friend. not a deep conversation — just a 'what are you up to' message. low stakes, real connection.", tone: 'warm', technique: 'technique', length: 'short' },
  ],

  comparing: [
    { id: 'cp1', text: "stop watching their highlight reel. you're comparing your middle to their end. of course it doesn't look fair.", tone: 'direct', technique: 'reframe', length: 'short' },
    { id: 'cp2', text: "their easy isn't your easy. and your hard isn't theirs. different mountains, different gear. stop grading on someone else's rubric.", tone: 'direct', technique: 'reframe', length: 'medium' },
    { id: 'cp3', text: "i know that voice. it says 'they did it faster, so you're behind.' that voice is a liar. you are not behind. you are here.", tone: 'warm', technique: 'reframe', length: 'short' },
  ],

  'giving-up': [
    { id: 'gu1', text: "stop. we don't quit. we pause. there's a difference. you can pause right here and i'll be here when you come back.", tone: 'hard-truth', technique: 'challenge', length: 'short' },
    { id: 'gu2', text: "you told me on day one: {why_phrase}. is that still true? if yes, you don't get to give up. if no, tell me what's changed and we'll work with the new version.", tone: 'direct', technique: 'callback', length: 'medium', match: { hasWhy: true } },
    { id: 'gu3', text: "i'm not going to let you quit on a tuesday. you can feel like quitting. you just don't get to do it right now. call me tomorrow if you still feel this way.", tone: 'hard-truth', technique: 'challenge', length: 'short' },
    { id: 'gu4', text: "what does 'giving up' actually look like to you? if we wrote it down, what would it be? sometimes naming the worst thing shrinks it.", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'gu5', text: "you've been at this {days} days. {days} days of choosing different. you don't have to feel brave to be brave. just keep your feet where they are.", tone: 'warm', technique: 'reframe', length: 'medium' },
  ],

  identity: [
    { id: 'id1', text: "yeah. that part is real. when you take the {label} out, there's a hole where the habit used to be. that's not a crisis. that's a construction site.", tone: 'warm', technique: 'reframe', length: 'medium' },
    { id: 'id2', text: "who are you without it? you don't have to answer that today. but you're allowed to be curious instead of scared about the question.", tone: 'quiet', technique: 'reframe', length: 'short' },
    { id: 'id3', text: "you were a person before the {label}. you're a person during. you'll be a person after. this isn't a reinvention — it's a remembering.", tone: 'warm', technique: 'reframe', length: 'medium' },
    { id: 'id4', text: "the you that's figuring this out is the same you who decided to start. you're not lost. you're just between who you were and who you're becoming.", tone: 'quiet', technique: 'reframe', length: 'medium' },
  ],

  relationship: [
    { id: 'rl1', text: "relationships and recovery are the same muscle: showing up honestly even when it's hard. what's the situation?", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'rl2', text: "have you told them what you're going through? you don't have to. but the people who love you can surprise you.", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'rl3', text: "what do they need from you right now that you don't know how to give? and what do you need from them?", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'rl4', text: "you can be {recoveryNoun} and still be a loving person. those aren't in conflict. the {label} is what was in conflict.", tone: 'warm', technique: 'reframe', length: 'short' },
  ],

  work: [
    { id: 'wk1', text: "work stress and recovery stress are the same stress in different clothes. what does tomorrow actually need from you?", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'wk2', text: "you can't {act} your way through a job. but you can {act} your way through tonight. keep it small and survivable.", tone: 'direct', technique: 'reframe', length: 'short' },
    { id: 'wk3', text: "is the job the problem, or is it what's in the job? sometimes the same work feels different when you've had water, food, and a real lunch.", tone: 'direct', technique: 'question', length: 'short' },
  ],

  proud: [
    { id: 'pr1', text: "good. you should be. say it again — out loud, to me, in your real voice.", tone: 'warm', technique: 'celebrate', length: 'short' },
    { id: 'pr2', text: "do you know how rare that is? most people don't even notice. you did. sit with that for a second.", tone: 'warm', technique: 'celebrate', length: 'short' },
    { id: 'pr3', text: "okay i'm going to be that friend who yells: I TOLD YOU YOU COULD. now what else is possible?", tone: 'playful', technique: 'celebrate', length: 'short' },
  ],

  stuck: [
    { id: 'stk1', text: "okay. we don't have to figure it out. we just have to look at it. what's the smallest piece of the stuck?", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'stk2', text: "stuck isn't the same as done. sometimes the stuck is just the part where the answer hasn't caught up to you yet. what do you know that you don't want to admit?", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'stk3', text: "okay so we're stuck. that's data, not a verdict. what would 'un-stuck' look like if it was embarrassingly simple?", tone: 'direct', technique: 'question', length: 'short' },
  ],

  unsubscribe: [
    { id: 'un1', text: "okay. i hear you. before you do that — is this a 'today was bad' or a 'this isn't helping' thing? they're different problems.", tone: 'direct', technique: 'question', length: 'short' },
    { id: 'un2', text: "you're allowed to leave. but i want to ask one thing: what would have to be true for this to be worth keeping? just curious.", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'un3', text: "no begging from me. but if there's one thing i said that landed — hold onto that. you can find me again whenever you need to. door's open.", tone: 'warm', technique: 'validate', length: 'medium' },
  ],

  unknown: [
    { id: 'u1', text: "i'm not sure what you mean. can you say it a different way?", tone: 'warm', technique: 'question', length: 'short' },
    { id: 'u2', text: "tell me more. i'm listening.", tone: 'warm', technique: 'presence', length: 'short' },
    { id: 'u3', text: "okay so what does that feel like in your body right now?", tone: 'direct', technique: 'question', length: 'short' },
  ],
};

// ============ Personal touch addendum (after main response) ============

// Injects a profile-aware follow-up. Optional — only fires for intents where it makes sense.
function buildPersonalTouch(intent: Intent, ctx: CoachContext): string | null {
  const hobbies = ctx.hobbies ?? [];
  const personality = ctx.personality ?? [];
  const journey = ctx.journey ?? '';
  const city = ctx.city ?? '';

  if (hobbies.length === 0 && personality.length === 0 && !journey && !city) return null;

  const hour = ctx.hourNow ?? new Date().getHours();
  const tod = timeOfDay(hour);

  // Journey callback for heavy moments (only one of journey/why fires)
  if (['self-sabotage', 'giving-up', 'relapse', 'low'].includes(intent) && journey && journey.trim().length > 5) {
    const snippet = journey.trim().slice(0, 70);
    return `you told me on day one: "${snippet}${journey.trim().length > 70 ? '…' : ''}" — that person is still in there. don't let this moment erase them.`;
  }

  // Why callback — only fires if NO journey, and only for the heaviest moments
  if (['self-sabotage', 'giving-up'].includes(intent) && ctx.why && ctx.why.trim().length > 0) {
    return `you said you started this for: "${ctx.why.trim()}" — is that still the reason? if yes, that reason deserves you right now.`;
  }

  // City grounding
  if (['craving', 'low', 'anxious', 'bored'].includes(intent) && city) {
    const cityLines: Partial<Record<Intent, string>> = {
      craving: `you're in ${city}. step outside your door and walk one block. just one. sometimes leaving the room is enough.`,
      low: `${city} is full of small things you haven't noticed. go look at one — a window, a tree, a stranger's dog. let it be your only job for ten minutes.`,
      anxious: `${city} is right there. open a window, or step on the stoop for sixty seconds. your nervous system needs fresh input.`,
      bored: `you're in ${city}. go somewhere you haven't been in your own city yet. even a different coffee shop counts.`,
    };
    return cityLines[intent] ?? null;
  }

  // Late-night grounding
  if (tod === 'night' && intent === 'low') {
    return "the 2am version of your brain is not a reliable narrator. if you can, sleep on it. the morning version of you usually has better ideas.";
  }

  return null;
}

// ============ Main coach entry point ============

export interface CoachResult {
  text: string;
  intent: Intent;
  responseId: string;
  crisis: boolean;
}

export function coachRespond(
  userText: string,
  ctxIn: {
    days: number;
    stage: number;
    name?: string;
    why?: string;
    substance?: string;
    recentMood?: number | null;
    recentCravings?: number | null;
    recentWins?: string[];
    hobbies?: string[];
    personality?: string[];
    journey?: string;
    city?: string;
    conversationHistory?: Array<{ role: 'user' | 'coach'; text: string }>;
    lastIntent?: Intent | null;
    usedResponseIds?: Set<string>;
    hourNow?: number;
    winCount?: number;
    checkInStreak?: number;
  }
): CoachResult {
  // Crisis first — always
  if (detectCrisis(userText)) {
    return {
      text: crisisResponse(ctxIn.name),
      intent: 'unknown',
      responseId: 'crisis',
      crisis: true,
    };
  }

  const intent = detectIntent(userText);
  const hour = ctxIn.hourNow ?? new Date().getHours();
  const ctx: CoachContext = {
    days: ctxIn.days,
    stage: ctxIn.stage,
    name: ctxIn.name,
    why: ctxIn.why,
    substance: ctxIn.substance,
    recentMood: ctxIn.recentMood ?? null,
    recentCravings: ctxIn.recentCravings ?? null,
    recentWins: ctxIn.recentWins ?? [],
    hobbies: ctxIn.hobbies ?? [],
    personality: ctxIn.personality ?? [],
    journey: ctxIn.journey ?? '',
    city: ctxIn.city ?? '',
    conversationHistory: ctxIn.conversationHistory ?? [],
    lastIntent: ctxIn.lastIntent ?? null,
    usedResponseIds: ctxIn.usedResponseIds ?? new Set(),
    hourNow: hour,
    winCount: ctxIn.winCount ?? 0,
    checkInStreak: ctxIn.checkInStreak ?? 0,
  };

  const tone = pickTone(intent, ctx);
  const vocab = getVocab(ctxIn.substance);
  const pool = BANK[intent] || BANK.unknown || [];
  const usedIds = ctx.usedResponseIds ?? new Set<string>();
  const hist = ctx.conversationHistory ?? [];

  // Score each candidate
  const candidates = pool
    .filter((r) => !usedIds.has(r.id))
    .map((r) => {
      let score = 0;
      // Tone match is big
      if (r.tone === tone) score += 5;
      // Profile match is biggest
      if (r.match && profileMatches(r.match, ctx)) score += 10;
      // Weight
      score += r.weight ?? 0;
      return { r, score };
    });

  const finalPool = candidates.length > 0 ? candidates : pool.map((r) => ({ r, score: 0 }));

  // Sort by score (high to low) with deterministic tie-break
  finalPool.sort((a, b) => b.score - a.score || (a.r.id.localeCompare(b.r.id)));

  // Pick from top tier — randomize slightly within top scores for variety
  const topScore = finalPool[0]?.score ?? 0;
  const topTier = finalPool.filter((c) => c.score >= topScore - 2);
  const seed = userText.length + hist.length + (ctx.days % 7);
  const chosen = topTier[seed % topTier.length]?.r ?? finalPool[0]?.r ?? pool[0];

  let text = chosen.text;

  // Variable substitution
  text = text.replace(/\{days\}/g, String(ctx.days));
  text = text.replace(/\{name\}/g, ctx.name ?? '');
  text = text.replace(/\{label\}/g, vocab.label);
  text = text.replace(/\{act\}/g, vocab.act);
  text = text.replace(/\{urgeNoun\}/g, vocab.urgeNoun);
  text = text.replace(/\{relapsePast\}/g, vocab.relapsePast);
  text = text.replace(/\{recoveryNoun\}/g, vocab.recoveryNoun);
  text = text.replace(/\{city\}/g, ctx.city || 'your city');
  const whyPhrase = ctx.why && ctx.why.trim().length > 0
    ? `"${ctx.why.trim()}"`
    : 'the reason you gave me on day one';
  text = text.replace(/\{why_phrase\}/g, whyPhrase);
  const hobbyHint = (ctx.hobbies && ctx.hobbies[0]) || '';
  text = text.replace(/\{hobbyHint\}/g, hobbyHint);

  // Personal touch addendum
  const personalTouch = buildPersonalTouch(intent, ctx);
  if (personalTouch && Math.random() < 0.5) {
    text += `\n\n${personalTouch}`;
  }

  return {
    text,
    intent,
    responseId: chosen.id,
    crisis: false,
  };
}

// ============ Quick replies by intent ============

export function quickReplies(intent: Intent): string[] {
  const map: Partial<Record<Intent, string[]>> = {
    greeting: ["I'm good", "Rough day", "Need to talk", "Just saying hi"],
    craving: ["Tell me a technique", "I'm riding it", "It's passing", "I slipped"],
    relapse: ["I need to reset", "I'm beating myself up", "What now?", "I want to talk"],
    vent: ["Yeah", "It's worse than I said", "I don't know what to do", "Just listen"],
    win: ["It felt huge", "Thanks", "What's next?", "I'm scared to mess up"],
    'win-minimizing': ["It's really not a big deal", "Anyone could do it", "Okay maybe it is"],
    low: ["Tell me what to do", "I just want company", "Why am I like this", "I'm so tired"],
    lonely: ["I don't have anyone", "Text someone?", "I miss the old me", "It's the people thing"],
    anxious: ["It's in my chest", "Can't shut my brain off", "Tell me a technique", "I'm spiraling"],
    sleep: ["It's 3am", "Brain won't stop", "What's the move", "Stay with me"],
    anger: ["I'm so mad", "Walk it off?", "I want to scream", "Why am I like this"],
    gratitude: ["It surprised me", "I'm scared to jinx it", "Tell me how to keep it", "Just thanks"],
    how: ["Honestly", "Today", "The arc", "I'm not sure"],
    milestone: ["I did it", "How do I keep it", "I'm proud", "What's next?"],
    motivation: ["I can't start", "Help me move", "What's the smallest thing", "I don't feel like it"],
    advice: ["What would you do?", "Help me think", "I'm stuck", "Just listen"],
    thanks: ["You're the best", "Back at you", "Okay, going to try", "See you tomorrow"],
    smalltalk: ["It's been a thing", "Tell me yours", "lol", "Hmm"],
    joke: ["Ha", "You're silly", "Okay back to real", "lol"],
    excuse: ["It's really true this time", "Tomorrow for real", "Okay call me out", "Fine, what now"],
    'self-sabotage': ["You're right", "I hear you", "I don't know why", "What if I can't?"],
    avoidance: ["I don't want to talk", "I'm fine really", "Okay. I'll try", "Maybe later"],
    comparing: ["They're so far ahead", "Why is it easy for them", "I know it's dumb", "Okay. My race."],
    'giving-up': ["I want to quit", "Not just today", "I'm done", "What would I even be giving up"],
    bored: ["Nothing sounds good", "Distract me", "Help me want something", "Bored and want to use"],
    identity: ["I don't know who I am", "Without the thing", "I miss who I was", "Who am I now"],
    relationship: ["My partner", "My family", "A friend", "It's complicated"],
    work: ["Job stuff", "Can't focus", "I'm so behind", "Money stuff"],
    proud: ["Yeah, I am", "It surprised me", "Okay, say it back", "I'm scared to own it"],
    stuck: ["I don't know", "Tell me what to try", "I'm just frozen", "Walk me through it"],
    unsubscribe: ["Not really, just venting", "Yeah, I think I am", "Maybe later", "I need a break"],
    unknown: ["Let me try again", "It's hard to say", "I'm okay", "Not sure"],
  };
  return map[intent] ?? map.unknown ?? ["Tell me more", "I'm listening", "What do you suggest", "Okay"];
}

export const SIGNATURE = {
  real_talk: ["real talk:", "okay. real talk:", "honest answer:", "okay i'm gonna say something —"],
  pushing: ["i'm gonna push you here.", "don't hate me for saying this.", "you can be mad at me for this."],
  affection: ["i love you.", "i'm proud of you.", "i'm here.", "i'm not going anywhere."],
  we_voice: ["we're gonna figure this out.", "we got this.", "this is us now."],
};
