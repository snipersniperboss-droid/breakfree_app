import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, todayKey } from '../state/store';

export default function CheckIn() {
  const navigate = useNavigate();
  const { state, addCheckIn } = useApp();
  const today = todayKey();
  const existing = state.checkIns.find((c) => c.date === today);

  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(existing?.mood ?? 3);
  const [craving, setCraving] = useState<1 | 2 | 3 | 4 | 5>(existing?.craving ?? 2);
  const [note, setNote] = useState(existing?.note ?? '');
  const [wins, setWins] = useState(existing?.wins ?? '');

  const submit = () => {
    addCheckIn({ date: today, mood, craving, note: note.trim(), wins: wins.trim() });
    navigate('/');
  };

  return (
    <div className="app-bg min-h-full pb-24 px-5 pt-6">
      <h1 className="font-display text-2xl font-bold text-white mb-1">Daily check-in</h1>
      <p className="text-ink-400 text-sm mb-6">
        Honest answers. Just for you.
      </p>

      <div className="space-y-6">
        <div className="glass rounded-3xl p-5">
          <div className="text-sm font-medium text-white mb-3">
            How is your mood right now?
          </div>
          <Scale
            value={mood}
            onChange={setMood}
            labels={['😣 Awful', '😕 Low', '😐 OK', '🙂 Good', '😄 Great']}
            color="from-sage-400 to-sage-600"
          />
        </div>

        <div className="glass rounded-3xl p-5">
          <div className="text-sm font-medium text-white mb-1">
            How strong is the craving?
          </div>
          <div className="text-[11px] text-ink-400 mb-3">
            1 = none, 5 = overwhelming
          </div>
          <Scale
            value={craving}
            onChange={setCraving}
            labels={['None', 'Mild', 'Noticeable', 'Strong', 'Overwhelming']}
            color="from-amber-300 to-rose-500"
          />
        </div>

        <div className="glass rounded-3xl p-5">
          <label className="text-sm font-medium text-white block mb-2">
            Anything you want to remember about today?
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="What happened, what you felt, what got you through..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-ink-400 focus:outline-none focus:border-sage-500 resize-none text-sm"
          />
        </div>

        <div className="glass rounded-3xl p-5">
          <label className="text-sm font-medium text-white block mb-2">
            ✨ Today's win (no win too small)
          </label>
          <input
            value={wins}
            onChange={(e) => setWins(e.target.value)}
            placeholder="Made my bed. Drank water. Said no thanks."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-ink-400 focus:outline-none focus:border-sage-500 text-sm"
          />
        </div>

        <button onClick={submit} className="btn-primary w-full">
          Save check-in
        </button>
      </div>
    </div>
  );
}

function Scale({
  value,
  onChange,
  labels,
  color,
}: {
  value: number;
  onChange: (v: 1 | 2 | 3 | 4 | 5) => void;
  labels: string[];
  color: string;
}) {
  return (
    <div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n as 1 | 2 | 3 | 4 | 5)}
            className={`flex-1 h-12 rounded-xl border transition relative overflow-hidden ${
              value === n
                ? 'border-transparent text-ink-900 font-bold'
                : 'border-white/10 bg-white/5 text-ink-300 hover:border-white/30'
            }`}
          >
            {value === n && (
              <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />
            )}
            <span className="relative">{n}</span>
          </button>
        ))}
      </div>
      <div className="text-center text-xs text-ink-400 mt-2">{labels[value - 1]}</div>
    </div>
  );
}
