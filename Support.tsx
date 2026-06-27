import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../state/store';
import { coachRespond, quickReplies, detectIntent, detectCrisis, type Intent } from '../data/coach';
import { AvatarFace } from '../components/AvatarImage';

export default function Coach() {
  const { state, days, stage, profile, addChat } = useApp();
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);
  const usedResponseIds = useRef<Set<string>>(new Set());

  // Seed welcome message once
  useEffect(() => {
    if (state.chat.length > 0 || seededRef.current) return;
    seededRef.current = true;
    setTyping(true);
    setTimeout(() => {
      addChat({
        id: crypto.randomUUID(),
        role: 'coach',
        text: welcomeMessage(profile?.name),
        at: new Date().toISOString(),
      });
      setTyping(false);
    }, 700);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [state.chat, typing]);

  const send = (textArg?: string) => {
    const text = (textArg ?? input).trim();
    if (!text || typing) return;
    setInput('');
    addChat({
      id: crypto.randomUUID(),
      role: 'user',
      text,
      at: new Date().toISOString(),
    });
    setTyping(true);

    // Build context for response
    const recentCheckIn = state.checkIns[state.checkIns.length - 1];
    const recentWins = state.journal
      .slice(-3)
      .map((j) => j.text)
      .filter(Boolean) as string[];
    const lastCoachMsg = [...state.chat].reverse().find((m) => m.role === 'coach');
    const lastIntent = lastCoachMsg ? detectIntent(lastCoachMsg.text) : null;

    const ctx = {
      days,
      stage,
      name: profile?.name,
      why: profile?.why,
      substance: profile?.substance,
      hobbies: profile?.hobbies,
      personality: profile?.personality,
      journey: profile?.journey,
      city: profile?.city,
      recentMood: recentCheckIn?.mood ?? null,
      recentCravings: recentCheckIn?.craving ?? null,
      recentWins,
      conversationHistory: state.chat.slice(-6),
      lastIntent,
      usedResponseIds: usedResponseIds.current,
      hourNow: new Date().getHours(),
      winCount: state.wins.length,
      checkInStreak: state.checkIns.length,
    };

    const typingDelay = detectCrisis(text) ? 300 : 800 + Math.random() * 900;
    setTimeout(() => {
      const result = coachRespond(text, ctx);
      usedResponseIds.current.add(result.responseId);
      addChat({
        id: crypto.randomUUID(),
        role: 'coach',
        text: result.text,
        at: new Date().toISOString(),
      });
      setTyping(false);
    }, typingDelay);
  };

  const lastUserMsg = [...state.chat].reverse().find((m) => m.role === 'user');
  const intent: Intent = lastUserMsg ? detectIntent(lastUserMsg.text) : 'greeting';
  const replies = useMemo(() => quickReplies(intent), [intent]);

  return (
    <div className="app-bg min-h-full flex flex-col">
      {/* Hero header */}
      <div className="px-5 pt-5 pb-3 safe-top flex items-center gap-4">
        <div className="flex-shrink-0">
          <AvatarFace avatarId={profile?.avatarId} stage={stage} mood={state.checkIns[state.checkIns.length - 1]?.mood} size={104} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display text-xl font-bold text-white leading-tight">Sage</div>
          <div className="text-[10px] text-sage-300 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sage-400 pulse-soft" />
            {typing ? 'thinking…' : 'here with you'}
          </div>
          <div className="text-[11px] text-ink-300 mt-1.5">Day {days} · Stage {stage + 1}</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 pb-44">
        {state.chat.length === 0 && !typing && (
          <div className="text-center text-ink-400 text-sm py-12">Start a conversation 👇</div>
        )}
        {state.chat.map((m) => (
          <Message key={m.id} role={m.role} text={m.text} />
        ))}
        {typing && (
          <div className="flex items-end gap-2 animate-floatUp">
            <Bubble>
              <div className="flex items-center gap-1 px-2 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-sage-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-sage-300 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </Bubble>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="fixed bottom-16 left-0 right-0 px-3 pb-3 safe-bottom z-10">
        <div className="max-w-md mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
            {replies.map((r) => (
              <button
                key={r}
                onClick={() => send(r)}
                className="whitespace-nowrap text-xs glass rounded-full px-3.5 py-1.5 text-sage-200 hover:bg-white/10 transition flex-shrink-0"
              >
                {r}
              </button>
            ))}
          </div>

          <div className="glass-strong rounded-2xl p-1.5 flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Tell Sage what's going on..."
              rows={1}
              className="flex-1 bg-transparent text-white placeholder:text-ink-400 px-3 py-2.5 text-sm resize-none focus:outline-none max-h-32"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || typing}
              className="btn-primary !rounded-xl !px-3 !py-2 disabled:opacity-30"
              aria-label="Send"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12 L19 12 M13 6 L19 12 L13 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="text-[10px] text-ink-400 text-center mt-1.5 leading-relaxed">
            Sage is supportive, not a substitute for professional help.
            {' '}<Link to="/help" className="underline">Crisis resources</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}

function welcomeMessage(name?: string): string {
  const who = name ? ` ${name}` : '';
  const messages = [
    `hey${who}. i'm here. whatever's going on — urge, low day, something you can't name yet — you can say it out loud here.`,
    `hi${who}. how's your body right now? that's usually the truest answer.`,
    `hey${who}. glad you came in. take your time.`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function Bubble({ children }: { children: React.ReactNode }) {
  return <div className="glass rounded-2xl rounded-bl-sm text-sm text-ink-100">{children}</div>;
}

function Message({ role, text }: { role: 'user' | 'coach'; text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <div className={`flex items-end gap-2 animate-floatUp ${role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[14px] whitespace-pre-wrap leading-relaxed ${
          role === 'user'
            ? 'bg-sage-600/40 text-white rounded-br-sm border border-sage-500/30'
            : 'glass text-ink-100 rounded-bl-sm'
        }`}
      >
        {parts.map((p, i) =>
          p.startsWith('**') && p.endsWith('**') ? (
            <strong key={i} className="text-white font-semibold">
              {p.slice(2, -2)}
            </strong>
          ) : (
            <span key={i}>{p}</span>
          )
        )}
      </div>
    </div>
  );
}
