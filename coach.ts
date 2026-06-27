// Code of conduct shown once before entering the Support section.
import { useState } from 'react';

const RULES = [
  { icon: '💚', title: 'Lead with kindness', body: 'Everyone here is fighting something. Assume good intent. Disagree gently.' },
  { icon: '🤐', title: 'What\'s said here stays here', body: 'Don\'t screenshot, quote, or share anything from Support outside the app.' },
  { icon: '🚫', title: 'No giving medical or legal advice', body: 'You can share what worked for you. Don\'t prescribe, diagnose, or push a specific path.' },
  { icon: '⚠️', title: 'No triggering content', body: 'Don\'t romanticize use, share where to get substances, or post graphic detail.' },
  { icon: '🛡️', title: 'Report, don\'t retaliate', body: 'See something off? Use Report. We\'ll handle it. No naming-and-shaming in chat.' },
  { icon: '🚨', title: 'In crisis? Skip the chat', body: 'If you\'re in immediate danger, call 988 (US) or your local emergency line. Don\'t wait for a reply.' },
];

export function ConductModal({ onAccept }: { onAccept: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
    >
      <div className="glass-strong rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 max-h-[88vh] flex flex-col animate-floatUp">
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">🤝</div>
          <h2 className="font-display text-2xl font-bold text-white">Before you enter Support</h2>
          <p className="text-ink-300 text-sm mt-1">A safe space starts with how we show up.</p>
        </div>

        <div
          className="overflow-y-auto flex-1 space-y-3 pr-1 -mr-1"
          onScroll={(e) => {
            const el = e.currentTarget;
            if (el.scrollHeight - el.scrollTop - el.clientHeight < 40) setScrolled(true);
          }}
        >
          {RULES.map((r) => (
            <div key={r.title} className="glass rounded-2xl p-3.5 flex gap-3">
              <div className="text-2xl flex-shrink-0">{r.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">{r.title}</div>
                <div className="text-ink-300 text-xs mt-1 leading-relaxed">{r.body}</div>
              </div>
            </div>
          ))}
          {!scrolled && (
            <div className="text-center text-ink-400 text-[10px] uppercase tracking-widest pt-1">
              Scroll to read all ↓
            </div>
          )}
        </div>

        <button
          onClick={onAccept}
          disabled={!scrolled}
          className="btn-primary w-full mt-4 disabled:opacity-40"
        >
          I agree — enter Support
        </button>
        <div className="text-[10px] text-ink-400 text-center mt-2 leading-relaxed">
          BreakFree is supportive, not medical. In a crisis, call 988 (US) or your local emergency line.
        </div>
      </div>
    </div>
  );
}
