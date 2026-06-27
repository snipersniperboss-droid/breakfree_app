// Cravings SOS — full-screen tool you can open any time you need help right now.
// Multiple evidence-based techniques. Tracks use + effectiveness.

import { useEffect, useState } from 'react';

type Tool = 'menu' | 'breath' | 'urge' | 'ground' | 'tape';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CravingsTool({ open, onClose }: Props) {
  const [tool, setTool] = useState<Tool>('menu');
  const [used, setUsed] = useState<string[]>([]); // track which tools were tried

  // Reset to menu when opened
  useEffect(() => {
    if (open) {
      setTool('menu');
      setUsed([]);
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col animate-floatUp"
      style={{
        background: 'radial-gradient(circle at 50% 0%, #102a23 0%, #07080f 70%)',
      }}
    >
      {/* Top bar */}
      <div className="px-5 pt-5 pb-3 safe-top flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-ink-300 hover:text-white text-sm flex items-center gap-1.5"
        >
          ← Close
        </button>
        <div className="text-[10px] text-sage-300 uppercase tracking-[0.25em] font-semibold">
          Cravings SOS
        </div>
        <div className="w-12" />
      </div>

      <div className="flex-1 overflow-y-auto pb-32 px-5">
        {tool === 'menu' && (
          <Menu
            onPick={(t) => {
              setTool(t);
              setUsed((u) => [...u, t]);
            }}
            used={used}
          />
        )}
        {tool === 'breath' && <BreathTool onDone={() => setTool('menu')} />}
        {tool === 'urge' && <UrgeSurfTool onDone={() => setTool('menu')} />}
        {tool === 'ground' && <GroundingTool onDone={() => setTool('menu')} />}
        {tool === 'tape' && <PlayTheTapeTool onDone={() => setTool('menu')} />}
      </div>

      {/* Crisis footer — always visible */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-4 safe-bottom">
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-3 mb-2">
            <div className="text-rose-300 text-[10px] font-semibold mb-1">🚨 In immediate danger?</div>
            <div className="text-ink-200 text-[11px] leading-relaxed">
              Skip the tools. Call <span className="font-bold text-white">988</span> (US) or visit{' '}
              <a className="underline text-rose-200" href="https://findahelpline.com" target="_blank" rel="noreferrer">findahelpline.com</a>.
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost w-full text-sm"
          >
            I'm okay — close SOS
          </button>
        </div>
      </div>
    </div>
  );
}

function Menu({ onPick, used }: { onPick: (t: Tool) => void; used: string[] }) {
  return (
    <div className="max-w-md mx-auto pt-4">
      <div className="text-center mb-6">
        <div className="text-5xl mb-2 animate-breathe">🌊</div>
        <h1 className="font-display text-3xl font-bold text-white">You've got this.</h1>
        <p className="text-ink-300 text-sm mt-2 leading-relaxed max-w-xs mx-auto">
          A craving is a wave. It peaks, and it breaks. Pick something that fits the next 2 minutes.
        </p>
      </div>

      <div className="space-y-3">
        <ToolCard
          icon="🫁"
          title="4-7-8 Breath"
          subtitle="In 4, hold 7, out 8. Five rounds."
          onClick={() => onPick('breath')}
          done={used.includes('breath')}
          primary
        />
        <ToolCard
          icon="🌊"
          title="Urge Surf"
          subtitle="Set a 10-min timer. Watch the wave peak and pass."
          onClick={() => onPick('urge')}
          done={used.includes('urge')}
        />
        <ToolCard
          icon="👁️"
          title="5-4-3-2-1 Grounding"
          subtitle="Engage your five senses. Pull yourself back to the room."
          onClick={() => onPick('ground')}
          done={used.includes('ground')}
        />
        <ToolCard
          icon="🎬"
          title="Play the Tape Forward"
          subtitle="What happens in 1 hour if you use? Be honest."
          onClick={() => onPick('tape')}
          done={used.includes('tape')}
        />
      </div>

      <div className="mt-6 text-center">
        <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-2">
          Or do one of these
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Quick label="🥤 Cold water" />
          <Quick label="🚶 5-min walk" />
          <Quick label="📞 Call someone" />
          <Quick label="❄️ Hold ice" />
        </div>
      </div>

      <div className="mt-6 text-center text-[11px] text-ink-300 italic leading-relaxed max-w-xs mx-auto">
        "This feeling has a half-life. It will not stay this sharp. Promise me 15 minutes."
      </div>
    </div>
  );
}

function ToolCard({ icon, title, subtitle, onClick, done, primary }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-3xl p-5 transition relative overflow-hidden group ${
        primary
          ? 'bg-gradient-to-br from-sage-500/30 to-sage-700/20 border-2 border-sage-500/50 shadow-glow'
          : 'glass-strong hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
          primary ? 'bg-sage-500/30' : 'bg-white/8'
        }`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-white font-display font-bold text-lg">{title}</div>
            {done && <span className="chip !py-0 !px-2 text-[9px]">✓ used</span>}
          </div>
          <div className="text-ink-300 text-xs mt-0.5 leading-relaxed">{subtitle}</div>
        </div>
        <div className="text-sage-300 text-2xl">→</div>
      </div>
    </button>
  );
}

function Quick({ label }: { label: string }) {
  return (
    <span className="text-xs glass rounded-full px-3.5 py-1.5 text-ink-200">{label}</span>
  );
}

// ============ 4-7-8 Breath ============

function BreathTool({ onDone: _onDone }: { onDone: () => void }) {
  void _onDone; // reserved for future post-session callback
  type Phase = 'idle' | 'in' | 'hold' | 'out';
  const [phase, setPhase] = useState<Phase>('idle');
  const [round, setRound] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (phase === 'idle') return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === 'idle') return;
    let nextPhase: Phase = phase;
    let nextRound = round;
    if (phase === 'in' && seconds >= 4) { nextPhase = 'hold'; setSeconds(0); }
    else if (phase === 'hold' && seconds >= 7) { nextPhase = 'out'; setSeconds(0); }
    else if (phase === 'out' && seconds >= 8) {
      nextRound = round + 1;
      if (round >= 4) { // 5 rounds done
        setPhase('idle'); setRound(0); setSeconds(0); return;
      }
      nextPhase = 'in'; setSeconds(0);
    }
    if (nextPhase !== phase) {
      setPhase(nextPhase);
      setRound(nextRound);
    }
  }, [seconds, phase, round]);

  const start = () => { setPhase('in'); setSeconds(0); setRound(0); };

  const scale =
    phase === 'in' ? 1 + (seconds / 4) * 0.5 :
    phase === 'hold' ? 1.5 :
    phase === 'out' ? 1.5 - (seconds / 8) * 0.5 :
    1;

  const instruction =
    phase === 'in' ? `Breathe in… ${4 - seconds}` :
    phase === 'hold' ? `Hold… ${7 - seconds}` :
    phase === 'out' ? `Breathe out… ${8 - seconds}` :
    'Press start. Inhale through your nose.';

  return (
    <div className="max-w-md mx-auto pt-8 text-center">
      <h2 className="font-display text-3xl font-bold text-white mb-2">4-7-8 Breath</h2>
      <p className="text-ink-300 text-sm mb-8">Five rounds. Total ~2 minutes.</p>

      {/* Breathing circle */}
      <div className="relative mx-auto my-10" style={{ width: 220, height: 220 }}>
        <div
          className="absolute inset-0 rounded-full transition-transform"
          style={{
            transform: `scale(${scale})`,
            background: 'radial-gradient(circle, rgba(67,196,134,0.5) 0%, rgba(38,133,95,0.2) 60%, transparent 100%)',
            boxShadow: phase !== 'idle' ? '0 0 80px rgba(67,196,134,0.4)' : 'none',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white font-display text-xl font-semibold">{instruction}</div>
        </div>
      </div>

      {/* Round counter */}
      {phase !== 'idle' && (
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full ${
                i < round ? 'bg-sage-400' :
                i === round ? 'bg-sage-500' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      )}

      {phase === 'idle' && (
        <button onClick={start} className="btn-primary px-10">
          Start
        </button>
      )}
      {phase !== 'idle' && (
        <button
          onClick={() => { setPhase('idle'); setSeconds(0); setRound(0); }}
          className="btn-ghost"
        >
          Stop
        </button>
      )}
    </div>
  );
}

// ============ Urge Surf ============

function UrgeSurfTool({ onDone }: { onDone: () => void }) {
  // onDone is used when the timer completes; surfacing here for clarity
  void onDone;
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const target = 10 * 60;

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (seconds >= target) {
      setRunning(false);
    }
  }, [seconds, target]);

  const pct = Math.min(seconds / target, 1);
  const remaining = Math.max(target - seconds, 0);
  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = (remaining % 60).toString().padStart(2, '0');

  // Wave visualization — sinusoidal
  const waveY = (x: number) => {
    const t = (seconds / 30) % 1;
    return Math.sin((x / 200) * Math.PI * 4 + t * Math.PI * 2) * 12 * (1 - pct * 0.5);
  };

  return (
    <div className="max-w-md mx-auto pt-8 text-center">
      <h2 className="font-display text-3xl font-bold text-white mb-2">Urge Surf</h2>
      <p className="text-ink-300 text-sm mb-2 max-w-xs mx-auto leading-relaxed">
        Set 10 minutes. Watch the urge rise, peak, and fade. Don't act — just observe.
      </p>

      <div className="font-display text-6xl font-bold gradient-text my-8 tabular-nums">
        {mm}:{ss}
      </div>

      {/* Wave visual */}
      <div className="relative mx-auto mb-6" style={{ width: 280, height: 80 }}>
        <svg viewBox="0 0 200 80" width="100%" height="100%">
          <defs>
            <linearGradient id="waveFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#43c486" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#43c486" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M 0 40 ${Array.from({ length: 200 }).map((_, i) => `L ${i} ${40 + waveY(i)}`).join(' ')} L 200 80 L 0 80 Z`}
            fill="url(#waveFill)"
            opacity={running ? 1 : 0.3}
          />
          <path
            d={`M 0 ${40 + waveY(0)} ${Array.from({ length: 200 }).map((_, i) => `L ${i} ${40 + waveY(i)}`).join(' ')}`}
            fill="none"
            stroke="#9be7c5"
            strokeWidth="2"
            opacity={running ? 0.9 : 0.4}
          />
        </svg>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-8 max-w-xs mx-auto">
        <div
          className="h-full bg-gradient-to-r from-sage-400 to-sage-600 rounded-full transition-all"
          style={{ width: `${pct * 100}%` }}
        />
      </div>

      {!running && seconds === 0 && (
        <button onClick={() => setRunning(true)} className="btn-primary px-10">
          Start 10-min timer
        </button>
      )}
      {running && (
        <button onClick={() => { setRunning(false); setSeconds(0); }} className="btn-ghost">
          Reset
        </button>
      )}
      {!running && seconds > 0 && seconds < target && (
        <button onClick={() => setRunning(true)} className="btn-primary">
          Resume
        </button>
      )}
      {!running && seconds >= target && (
        <div className="space-y-3">
          <div className="text-sage-300 font-semibold">10 minutes. You rode it. 🌊</div>
          <button onClick={onDone} className="btn-primary">
            Back
          </button>
        </div>
      )}
    </div>
  );
}

// ============ 5-4-3-2-1 Grounding ============

function GroundingTool({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { count: 5, sense: 'see', label: 'Name 5 things you can see', icon: '👁️' },
    { count: 4, sense: 'touch', label: 'Name 4 things you can touch', icon: '✋' },
    { count: 3, sense: 'hear', label: 'Name 3 things you can hear', icon: '👂' },
    { count: 2, sense: 'smell', label: 'Name 2 things you can smell', icon: '👃' },
    { count: 1, sense: 'taste', label: 'Name 1 thing you can taste', icon: '👅' },
  ];
  const current = steps[step];

  return (
    <div className="max-w-md mx-auto pt-8 text-center">
      <h2 className="font-display text-3xl font-bold text-white mb-2">5-4-3-2-1</h2>
      <p className="text-ink-300 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
        Slow down. Engage your senses. Pull yourself back into the room.
      </p>

      {step < steps.length ? (
        <>
          <div className="text-6xl mb-6">{current.icon}</div>
          <div className="text-[10px] text-sage-300 uppercase tracking-widest mb-2">
            Step {step + 1} of 5
          </div>
          <div className="text-white font-display text-2xl font-bold mb-6">
            {current.count} {current.count === 1 ? 'thing' : 'things'} you can {current.sense}
          </div>

          <textarea
            autoFocus
            rows={4}
            placeholder={current.label + '…'}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-ink-400 focus:outline-none focus:border-sage-500 resize-none text-sm mb-4"
          />

          {/* Step dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full transition ${
                  i < step ? 'bg-sage-400' :
                  i === step ? 'bg-sage-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setStep(step + 1)}
            className="btn-primary px-10"
          >
            {step === steps.length - 1 ? 'Done' : 'Next'}
          </button>
        </>
      ) : (
        <div className="space-y-4 pt-8">
          <div className="text-6xl">🌍</div>
          <div className="text-sage-300 font-semibold text-lg">You're here. You rode it out.</div>
          <button onClick={onDone} className="btn-primary">
            Back
          </button>
        </div>
      )}
    </div>
  );
}

// ============ Play the Tape Forward ============

function PlayTheTapeTool({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const questions = [
    {
      title: 'Right after',
      prompt: 'Imagine using right now. The first 30 seconds — what does it feel like?',
      placeholder: 'The rush. The relief. The lie that it was worth it.',
    },
    {
      title: 'One hour later',
      prompt: 'An hour from now. The thing has worn off. Where are you? What are you feeling?',
      placeholder: "I'm ashamed. I'm hiding it. I'm already planning the next one.",
    },
    {
      title: 'Tomorrow morning',
      prompt: 'Tomorrow. You wake up. How does the mirror look?',
      placeholder: "I'm back to day 1. I'm sick of starting over.",
    },
    {
      title: 'A week from now',
      prompt: 'A week from now, if you used today. What\'s different?',
      placeholder: "I lost momentum. The work I did is harder to restart.",
    },
    {
      title: 'Six months from now',
      prompt: 'Six months from now. If you used today and never recovered, what does life look like?',
      placeholder: "I'm further from the person I want to be.",
    },
  ];
  const current = questions[step];

  return (
    <div className="max-w-md mx-auto pt-6">
      <h2 className="font-display text-3xl font-bold text-white mb-2 text-center">Play the Tape</h2>
      <p className="text-ink-300 text-sm mb-6 text-center max-w-xs mx-auto leading-relaxed">
        The first 30 seconds is the lie. Play it all the way through.
      </p>

      {step < questions.length ? (
        <>
          <div className="text-[10px] text-sage-300 uppercase tracking-widest mb-1 text-center">
            {current.title}
          </div>
          <div className="text-white font-display text-xl font-bold mb-4 text-center leading-snug">
            {current.prompt}
          </div>
          <textarea
            autoFocus
            rows={5}
            placeholder={current.placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-ink-400 focus:outline-none focus:border-sage-500 resize-none text-sm mb-4"
          />
          <div className="flex justify-center gap-2 mb-4">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full ${
                  i < step ? 'bg-sage-400' :
                  i === step ? 'bg-sage-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setStep(step + 1)}
            className="btn-primary w-full"
          >
            {step === questions.length - 1 ? 'See the truth' : 'Next'}
          </button>
        </>
      ) : (
        <div className="space-y-4 pt-4 text-center">
          <div className="text-5xl">🌅</div>
          <p className="text-white text-lg leading-relaxed max-w-xs mx-auto">
            Now you know the whole story. Not just the lie your brain was selling you.
          </p>
          <button onClick={onDone} className="btn-primary">
            Back
          </button>
        </div>
      )}
    </div>
  );
}
