// Public-facing landing page.
// Reachable at /landing. No onboarding required.
// Designed for sharing on social, Reddit, Product Hunt, etc.

import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Landing() {
  return (
    <div className="min-h-full app-bg text-white overflow-x-hidden">
      <NavBar />
      <Hero />
      <SocialProofBar />
      <WhatItIs />
      <HowItWorks />
      <MeetYourAvatar />
      <MeetSage />
      <PrivacySection />
      <PricingSection />
      <CrisisBar />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function NavBar() {
  return (
    <div className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage-400 to-emerald-600 flex items-center justify-center text-white font-bold">
          ★
        </div>
        <span className="font-display text-lg font-bold">BreakFree</span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm text-ink-300">
        <a href="#how" className="hover:text-white transition">How it works</a>
        <a href="#avatar" className="hover:text-white transition">Your avatar</a>
        <a href="#sage" className="hover:text-white transition">Coach Sage</a>
        <a href="#pricing" className="hover:text-white transition">Pricing</a>
        <a href="#faq" className="hover:text-white transition">FAQ</a>
      </div>
      <Link to="/" className="btn-primary !py-2 !px-4 text-sm">Open the app →</Link>
    </div>
  );
}

function Hero() {
  return (
    <div className="px-6 pt-12 pb-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <div>
        <div className="inline-block glass rounded-full px-3 py-1 text-xs text-sage-300 mb-5">
          AI sobriety coach · works offline-feeling · no ads · no data sold
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold leading-[1.05] mb-5">
          A coach who actually <span className="gradient-text">remembers you.</span>
        </h1>
        <p className="text-lg text-ink-200 mb-7 max-w-lg leading-relaxed">
          BreakFree is a private AI sobriety companion. Pick a face. Check in with how you're feeling.
          Get an honest, warm response from a coach who knows your name, your "why," your hobbies — and
          doesn't flinch when it's hard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Link to="/" className="btn-primary !py-3 !px-6 text-base text-center">
            Try it free — no signup
          </Link>
          <a href="#how" className="btn-ghost !py-3 !px-6 text-base text-center">
            See how it works
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-400">
          <span>✓ No credit card to start</span>
          <span>✓ Works on your phone</span>
          <span>✓ 988 hotline always one tap away</span>
        </div>
      </div>

      <div className="relative">
        <div className="glass-strong rounded-3xl p-3 mx-auto max-w-sm">
          <div className="rounded-2xl overflow-hidden relative aspect-[5/6] bg-gradient-to-br from-emerald-900/30 to-black">
            <img
              src="/avatars/m_sage.png"
              alt="Kofi, one of seven BreakFree avatars"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: '50% 28%' }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4">
              <div className="text-[10px] text-sage-300 uppercase tracking-widest">Day 47 · Kofi</div>
              <div className="font-display font-bold text-white text-lg">Rooted</div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 max-w-[200px] hidden md:block">
          <div className="text-[10px] text-sage-300 uppercase tracking-widest mb-1">Sage</div>
          <div className="text-sm leading-relaxed text-ink-100">
            you ran today. that's the win. not a metaphor — the actual win. let me see the streak.
          </div>
        </div>
        <div className="absolute -top-4 -right-4 glass rounded-2xl p-3 hidden md:block">
          <div className="text-[10px] text-sage-300 uppercase tracking-widest">today</div>
          <div className="font-display text-2xl font-bold gradient-text">day 47</div>
        </div>
      </div>
    </div>
  );
}

function SocialProofBar() {
  return (
    <div className="border-y border-white/10 py-5">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-ink-300">
        <span>★ for people in their first 90 days</span>
        <span className="opacity-30">·</span>
        <span>★ also for people at year five</span>
        <span className="opacity-30">·</span>
        <span>★ for the friend who keeps almost quitting</span>
        <span className="opacity-30">·</span>
        <span>★ for anyone tired of being a number</span>
      </div>
    </div>
  );
}

function WhatItIs() {
  return (
    <div className="px-6 py-24 max-w-5xl mx-auto text-center">
      <div className="text-xs text-sage-300 uppercase tracking-[0.25em] mb-3">What it is</div>
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
        Not a counter. Not a streak app. Not a forum.
      </h2>
      <p className="text-lg text-ink-200 leading-relaxed max-w-2xl mx-auto mb-12">
        It's a private space with an AI coach who talks like a real friend — one who remembers
        what you told her three days ago, calls you on your own excuses, and never lets a win
        pass without noticing.
      </p>

      <div className="grid md:grid-cols-3 gap-4 text-left">
        <Pillar
          emoji="🧠"
          title="Honest, not preachy"
          body="Sage references your actual life — your kids, your job, the things you said you wanted — instead of repeating generic affirmations."
        />
        <Pillar
          emoji="🪞"
          title="A face that grows with you"
          body="Pick from 7 realistic avatars. The same person on day one and day 365. What changes is the glow, the gear, the path."
        />
        <Pillar
          emoji="🔒"
          title="Private by default"
          body="No login. No data sold. No public feed. Your check-ins live on your phone. The crisis hotline is one tap away, always."
        />
      </div>
    </div>
  );
}

function Pillar({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-3xl mb-3">{emoji}</div>
      <div className="font-display text-lg font-bold mb-2">{title}</div>
      <div className="text-sm text-ink-300 leading-relaxed">{body}</div>
    </div>
  );
}

function HowItWorks() {
  return (
    <div id="how" className="px-6 py-24 max-w-5xl mx-auto">
      <div className="text-xs text-sage-300 uppercase tracking-[0.25em] mb-3 text-center">How it works</div>
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">Three minutes to set up. Forever to come back to.</h2>

      <div className="space-y-6">
        <Step n={1} title="Pick a face" body="Choose from 7 photorealistic avatars — different ages, backgrounds, energies. Whichever one feels like you, that's yours." />
        <Step n={2} title="Tell Sage what you're working on" body="A few quick questions: your name, why you want to be free, what you love doing. Sage uses this to actually talk to you like a person." />
        <Step n={3} title="Check in when you need to" body="Once a day, or ten times. Tell her what's going on — a craving, a small win, a low night. She'll respond like a friend who actually knows you." />
      </div>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex gap-5 items-start">
      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-sage-400 to-emerald-600 flex items-center justify-center font-display text-xl font-bold">
        {n}
      </div>
      <div>
        <div className="font-display text-xl font-bold mb-2">{title}</div>
        <div className="text-ink-300 leading-relaxed">{body}</div>
      </div>
    </div>
  );
}

function MeetYourAvatar() {
  return (
    <div id="avatar" className="px-6 py-24 max-w-6xl mx-auto">
      <div className="text-xs text-sage-300 uppercase tracking-[0.25em] mb-3 text-center">Meet your face</div>
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-center">
        The same person through the whole journey.
      </h2>
      <p className="text-ink-300 text-center max-w-2xl mx-auto mb-12">
        Seven realistic characters. Pick the one that feels like you, or like who you're becoming.
        What changes isn't the face — it's the glow around it.
      </p>

      <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
        {[
          { id: 'm_sage', name: 'Kofi', label: 'Sage' },
          { id: 'm_celestial', name: 'Min-jun', label: 'Celestial' },
          { id: 'm_warrior', name: 'Marcus', label: 'Warrior' },
          { id: 'f_sage', name: 'Anjali', label: 'Sage' },
          { id: 'f_celestial', name: 'Lena', label: 'Celestial' },
          { id: 'f_phoenix', name: 'Amara', label: 'Phoenix' },
          { id: 'f_warrior', name: 'Nia', label: 'Warrior' },
        ].map((a) => (
          <div key={a.id} className="text-center">
            <div className="rounded-2xl overflow-hidden aspect-[5/6] bg-white/5">
              <img src={`/avatars/${a.id}.png`} alt={a.name} className="w-full h-full object-cover" style={{ objectPosition: '50% 28%' }} />
            </div>
            <div className="font-bold text-sm mt-2">{a.name}</div>
            <div className="text-[10px] text-ink-400 uppercase tracking-wider">{a.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MeetSage() {
  return (
    <div id="sage" className="px-6 py-24 max-w-6xl mx-auto">
      <div className="text-xs text-sage-300 uppercase tracking-[0.25em] mb-3 text-center">Meet Sage</div>
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-center">
        The coach who actually talks back.
      </h2>
      <p className="text-ink-300 text-center max-w-2xl mx-auto mb-12">
        Not a script. Not a worksheet. Sage recognizes 32 different states — craving, low, anxious,
        proud, avoiding, lonely, identity-questioning — and responds to each one like a friend
        who's paying attention.
      </p>

      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <ChatBubble
          who="You"
          side="user"
          text="i really want a drink right now"
        />
        <ChatBubble
          who="Sage"
          side="coach"
          text="you run. lace up. door. don't think, just go. move until the want can't keep up."
        />
        <ChatBubble
          who="You"
          side="user"
          text="i slipped last night"
        />
        <ChatBubble
          who="Sage"
          side="coach"
          text="okay. that's the drink. now — the next hour matters more than the last one. water, blanket, no big decisions. that's the move."
        />
      </div>

      <div className="text-center mt-10">
        <p className="text-sm text-ink-400 italic">
          ↑ real responses. no scripted "I hear you" filler.
        </p>
      </div>
    </div>
  );
}

function ChatBubble({ who, side, text }: { who: string; side: 'user' | 'coach'; text: string }) {
  return (
    <div className={`flex ${side === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${side === 'user' ? 'bg-sage-600/40 text-white rounded-br-sm' : 'glass text-ink-100 rounded-bl-sm'}`}>
        <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{who}</div>
        {text}
      </div>
    </div>
  );
}

function PrivacySection() {
  return (
    <div className="px-6 py-24 max-w-4xl mx-auto">
      <div className="glass-strong rounded-3xl p-8 md:p-12">
        <div className="text-xs text-sage-300 uppercase tracking-[0.25em] mb-3">Built for trust</div>
        <h2 className="font-display text-3xl font-bold mb-6">Your data is yours.</h2>
        <ul className="space-y-3 text-ink-200">
          {[
            'No account required. No email. No phone number.',
            'Check-ins, journal, and chats live only on your device.',
            'No ads. No "boost" prompts. No streak-punishing dark patterns.',
            'The 988 Suicide & Crisis Lifeline is one tap away, always.',
            'If you uninstall, your data goes with you. Nothing on a server.',
          ].map((line, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="text-sage-400 mt-0.5">✓</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PricingSection() {
  return (
    <div id="pricing" className="px-6 py-24 max-w-5xl mx-auto">
      <div className="text-xs text-sage-300 uppercase tracking-[0.25em] mb-3 text-center">Pricing</div>
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 text-center">Free to start. Pay only if it helps.</h2>
      <p className="text-ink-300 text-center mb-12">No subscription bait. Cancel anytime in one tap.</p>

      <div className="grid md:grid-cols-3 gap-4">
        <PriceCard
          tier="Free"
          price="$0"
          period="forever"
          bullets={['Unlimited check-ins', 'All 7 avatars', 'Mood + urge logging', 'Daily wins']}
          cta="Start free"
          highlight={false}
        />
        <PriceCard
          tier="Monthly"
          price="$5"
          period="/mo"
          bullets={['Everything in Free', 'Sage coach (32 intents)', 'Cravings toolkit', '30-day check-in history']}
          cta="Try a month"
          highlight={true}
          badge="Most flexible"
        />
        <PriceCard
          tier="Yearly"
          price="$45"
          period="/yr"
          bullets={['Everything in Monthly', 'Save 25%', 'Priority new features', 'Personal milestone cards']}
          cta="Commit a year"
          highlight={false}
          badge="Best value"
        />
      </div>
    </div>
  );
}

function PriceCard({ tier, price, period, bullets, cta, highlight, badge }: {
  tier: string; price: string; period: string; bullets: string[]; cta: string; highlight: boolean; badge?: string;
}) {
  return (
    <div className={`rounded-2xl p-6 ${highlight ? 'glass-strong border-2 border-sage-400/50 relative' : 'glass'}`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sage-400 to-emerald-500 text-black text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full">
          {badge}
        </div>
      )}
      <div className="text-sm text-ink-300 mb-2">{tier}</div>
      <div className="flex items-baseline gap-1 mb-5">
        <span className="font-display text-4xl font-bold">{price}</span>
        <span className="text-ink-400 text-sm">{period}</span>
      </div>
      <ul className="space-y-2 mb-6">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-sm text-ink-200">
            <span className="text-sage-400">✓</span>{b}
          </li>
        ))}
      </ul>
      <Link to="/" className={`block text-center w-full py-2.5 rounded-xl font-bold text-sm transition ${highlight ? 'bg-gradient-to-r from-sage-400 to-emerald-500 text-black' : 'bg-white/10 hover:bg-white/15 text-white'}`}>
        {cta}
      </Link>
    </div>
  );
}

function CrisisBar() {
  return (
    <div className="px-6 py-6 max-w-4xl mx-auto">
      <div className="rounded-2xl bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-500/30 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-white mb-1">In crisis right now?</div>
          <div className="text-sm text-ink-200">Call or text 988. You don't have to handle it alone.</div>
        </div>
        <a href="tel:988" className="bg-red-500 hover:bg-red-400 text-white font-bold px-5 py-2.5 rounded-xl whitespace-nowrap">
          Call 988
        </a>
      </div>
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      q: 'Is Sage a therapist?',
      a: 'No. Sage is a supportive companion who holds space, offers practical techniques, and remembers what you tell her. She is not a substitute for professional help, and she will tell you that — and refer you to one — when it matters.',
    },
    {
      q: 'Does BreakFree share my data?',
      a: 'No. There is no account, no server-side profile, no analytics SDK tracking you. Your check-ins live on your phone. If you uninstall, your data is gone.',
    },
    {
      q: 'What if I slip up?',
      a: 'Sage doesn\'t punish you or zero out a counter. A slip is one data point, not a verdict. She\'ll help you write the next line.',
    },
    {
      q: 'Is this for any substance?',
      a: 'Yes — alcohol, drugs, gambling, porn, social media, sugar, smoking, or anything else you\'re trying to be free from. The language adapts to what you picked at sign-up.',
    },
    {
      q: 'Why does Sage know my hobbies?',
      a: 'Because real friends reference the things you love. If you said you\'re a runner, she\'ll tell you to lace up when a craving hits — not because it\'s a script, but because that\'s what a person who knew you would say.',
    },
    {
      q: 'Can I try it before paying?',
      a: 'Yes. The free tier is fully functional for check-ins, mood logging, wins, and your avatar. Sage\'s full coaching unlocks at $5/month or $45/year.',
    },
  ];

  const [open, setOpen] = useState<number | null>(0);
  return (
    <div id="faq" className="px-6 py-24 max-w-3xl mx-auto">
      <div className="text-xs text-sage-300 uppercase tracking-[0.25em] mb-3 text-center">FAQ</div>
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">Common questions</h2>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <button
            key={i}
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left glass rounded-2xl p-5 hover:bg-white/5 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="font-bold">{f.q}</div>
              <div className="text-sage-400 text-2xl leading-none">{open === i ? '−' : '+'}</div>
            </div>
            {open === i && <div className="text-ink-300 leading-relaxed mt-3">{f.a}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

function FinalCTA() {
  return (
    <div className="px-6 py-24 max-w-3xl mx-auto text-center">
      <h2 className="font-display text-4xl md:text-5xl font-bold mb-5">
        One breath. Then the next one.
      </h2>
      <p className="text-ink-300 mb-8 max-w-xl mx-auto">
        You don't need a perfect day to start. You don't need a streak. You just need to show up
        and say one real thing out loud. Sage will be there.
      </p>
      <Link to="/" className="btn-primary !py-4 !px-8 text-lg inline-block">
        Open BreakFree →
      </Link>
      <div className="text-xs text-ink-400 mt-6">
        No signup · No credit card · Your data stays on your phone
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 text-sm text-ink-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© BreakFree · a private AI sobriety companion</div>
        <div className="flex items-center gap-4">
          <span className="text-xs">
            Not medical advice. <a href="tel:988" className="underline">Crisis: 988</a>
          </span>
        </div>
      </div>
    </footer>
  );
}