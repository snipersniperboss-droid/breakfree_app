// Quick "Log a Win" sheet — positive logging.
import { useState } from 'react';
import { useApp, type WinTag } from '../state/store';

const TAGS: Array<{ id: WinTag; label: string; emoji: string }> = [
  { id: 'showed-up', label: 'Showed up', emoji: '🚶' },
  { id: 'craving-ride', label: 'Rode a craving', emoji: '🌊' },
  { id: 'self-care', label: 'Self-care', emoji: '🛁' },
  { id: 'connection', label: 'Connected', emoji: '💬' },
  { id: 'helped', label: 'Helped someone', emoji: '🤝' },
  { id: 'rest', label: 'Got rest', emoji: '😴' },
  { id: 'movement', label: 'Moved my body', emoji: '🏃' },
  { id: 'create', label: 'Made something', emoji: '🎨' },
  { id: 'other', label: 'Other', emoji: '✨' },
];

const PROMPTS = [
  "One thing that went right today…",
  "What's one win, even a small one?",
  "What did you do today that future-you will thank you for?",
  "Anything you'd forgotten you were capable of?",
];

export function WinSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addWin } = useApp();
  const [text, setText] = useState('');
  const [tags, setTags] = useState<WinTag[]>([]);
  const [prompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  if (!open) return null;

  const toggleTag = (id: WinTag) =>
    setTags((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    addWin({ text: t, tags });
    setText('');
    setTags([]);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-t-3xl sm:rounded-3xl max-w-md w-full p-6 max-h-[85vh] flex flex-col animate-floatUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">✨</div>
          <h2 className="font-display text-2xl font-bold text-white">Log a win</h2>
          <p className="text-ink-300 text-xs mt-1">No win is too small. Future-you on a hard day will read this.</p>
        </div>

        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={prompt}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-ink-400 focus:outline-none focus:border-sage-500 resize-none text-sm mb-4"
        />

        <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-2">Tag it (optional)</div>
        <div className="flex flex-wrap gap-2 mb-5">
          {TAGS.map((t) => (
            <button
              key={t.id}
              onClick={() => toggleTag(t.id)}
              className={`text-xs rounded-full px-3 py-1.5 transition ${
                tags.includes(t.id)
                  ? 'bg-sage-500/30 border border-sage-500/50 text-sage-100'
                  : 'bg-white/5 border border-white/10 text-ink-200 hover:border-white/30'
              }`}
            >
              <span className="mr-1">{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-auto">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button
            onClick={submit}
            disabled={!text.trim()}
            className="btn-primary flex-1 disabled:opacity-40"
          >
            Save win
          </button>
        </div>
      </div>
    </div>
  );
}
