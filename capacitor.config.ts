import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, SUBSTANCE_LABELS, type Substance } from '../state/store';
import { THEMES, type Theme } from '../data/items';
import { AVATAR_PRESETS, DEFAULT_AVATAR, type AvatarId } from '../data/avatars';
import { Avatar } from '../components/AvatarImage';
import {
  HOBBY_TAGS,
  PERSONALITY_TAGS,
  JOURNEY_PROMPTS,
  CITY_SUGGESTIONS,
} from '../data/onboarding';

const STEPS = [
  'welcome',
  'name',
  'hobbies',
  'personality',
  'journey',
  'city',
  'avatar',
  'theme',
  'substance',
  'date',
  'why',
  'reveal',
] as const;
type Step = typeof STEPS[number];

export default function Onboarding() {
  const { setProfile } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [personality, setPersonality] = useState<string[]>([]);
  const [journey, setJourney] = useState('');
  const [city, setCity] = useState('');
  const [avatarId, setAvatarId] = useState<AvatarId>(DEFAULT_AVATAR);
  const [theme, setTheme] = useState<Theme>('sage');
  const [substance, setSubstance] = useState<Substance>('alcohol');
  const [customSubstance, setCustomSubstance] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [why, setWhy] = useState('');

  const next = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };
  const back = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const finish = () => {
    setProfile({
      name: name.trim() || 'Friend',
      substance,
      customSubstance: substance === 'other' ? customSubstance.trim() : undefined,
      startDate,
      why: why.trim(),
      theme,
      avatarId,
      hobbies,
      personality,
      journey: journey.trim(),
      city: city.trim(),
      onboardedAt: new Date().toISOString(),
    });
    navigate('/');
  };

  const toggleIn = (list: string[], id: string) =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  return (
    <div className="min-h-full app-bg safe-top safe-bottom px-6 py-6 flex flex-col">
      {step !== 'welcome' && step !== 'reveal' && (
        <div className="flex justify-center gap-1 mb-4">
          {STEPS.slice(1, -1).map((s) => (
            <div
              key={s}
              className={`h-1 rounded-full transition-all ${
                s === step ? 'w-6 bg-sage-500' : 'w-1.5 bg-white/15'
              }`}
            />
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        {step === 'welcome' && <Welcome onNext={next} />}
        {step === 'name' && (
          <Step title="First — what should I call you?" sub="Just a name. Anything works.">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-lg text-white placeholder:text-ink-400 focus:outline-none focus:border-sage-500 transition"
            />
            <NextBtn onClick={next} disabled={!name.trim()} label="Continue" />
          </Step>
        )}

        {step === 'hobbies' && (
          <Step
            title={`What do you love doing, ${name || 'friend'}?`}
            sub="Pick anything — even small stuff. Sage uses this to suggest things when you need them."
          >
            <div className="flex flex-wrap gap-2 mb-2 max-h-[60vh] overflow-y-auto pb-2">
              {HOBBY_TAGS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setHobbies(toggleIn(hobbies, h.id))}
                  className={`text-sm rounded-full px-3 py-1.5 transition ${
                    hobbies.includes(h.id)
                      ? 'bg-sage-500/30 border border-sage-500/50 text-sage-100'
                      : 'bg-white/5 border border-white/10 text-ink-200 hover:border-white/30'
                  }`}
                >
                  <span className="mr-1">{h.emoji}</span>{h.label}
                </button>
              ))}
            </div>
            <NextBtn onClick={next} label={hobbies.length ? `Continue (${hobbies.length})` : 'Skip for now'} />
            {hobbies.length === 0 && (
              <div className="text-center text-ink-400 text-[10px] mt-2">You can always change this later.</div>
            )}
          </Step>
        )}

        {step === 'personality' && (
          <Step
            title="How would your best friend describe you?"
            sub="Pick what fits. The more honest, the better Sage gets at being useful to you."
          >
            <div className="flex flex-wrap gap-2 mb-2 max-h-[55vh] overflow-y-auto pb-2">
              {PERSONALITY_TAGS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPersonality(toggleIn(personality, p.id))}
                  className={`text-sm rounded-full px-3 py-1.5 transition ${
                    personality.includes(p.id)
                      ? 'bg-sage-500/30 border border-sage-500/50 text-sage-100'
                      : 'bg-white/5 border border-white/10 text-ink-200 hover:border-white/30'
                  }`}
                >
                  <span className="mr-1">{p.emoji}</span>{p.label}
                </button>
              ))}
            </div>
            <NextBtn onClick={next} label={personality.length ? `Continue (${personality.length})` : 'Skip for now'} />
          </Step>
        )}

        {step === 'journey' && (
          <Step
            title="Tell me your story."
            sub="Optional, but the more I know, the better I can show up for you."
          >
            <textarea
              autoFocus
              value={journey}
              onChange={(e) => setJourney(e.target.value)}
              placeholder={JOURNEY_PROMPTS[Math.floor(Math.random() * JOURNEY_PROMPTS.length)]}
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-ink-400 focus:outline-none focus:border-sage-500 resize-none text-sm leading-relaxed"
            />
            <div className="text-[10px] text-ink-400 mt-1">
              Private. Saved on this device. Never shared.
            </div>
            <NextBtn onClick={next} label={journey.trim() ? 'Continue' : 'Skip for now'} />
          </Step>
        )}

        {step === 'city' && (
          <Step
            title="Where are you?"
            sub="For Stay Busy suggestions (events, groups near you). Optional."
          >
            <input
              autoFocus
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City, state"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-lg text-white placeholder:text-ink-400 focus:outline-none focus:border-sage-500 transition mb-3"
            />
            <div className="flex flex-wrap gap-2 mb-3 max-h-32 overflow-y-auto">
              {CITY_SUGGESTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`text-xs rounded-full px-3 py-1.5 transition ${
                    city === c
                      ? 'bg-sage-500/30 border border-sage-500/50 text-sage-100'
                      : 'bg-white/5 border border-white/10 text-ink-300 hover:border-white/30'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <NextBtn onClick={next} label={city.trim() ? 'Continue' : 'Skip for now'} />
          </Step>
        )}

        {step === 'avatar' && (
          <Step title="Choose a face" sub="This is the person walking the path with you. You can change your theme later — your face stays.">
            <div className="grid grid-cols-3 gap-2.5">
              {AVATAR_PRESETS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setAvatarId(a.id);
                    setTheme(a.theme);
                  }}
                  className={`relative rounded-2xl overflow-hidden border-2 transition aspect-[5/6] ${
                    avatarId === a.id
                      ? 'border-sage-300 ring-2 ring-sage-400/40 scale-[0.98]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={a.image}
                    alt={a.label}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: '50% 28%' }}
                    draggable={false}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2 pt-6">
                    <div className="text-white text-xs font-bold leading-tight">{a.label}</div>
                    <div className="text-[10px] text-ink-200 capitalize">{a.tagline}</div>
                  </div>
                  {avatarId === a.id && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-sage-400 flex items-center justify-center text-black text-xs font-bold">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-ink-400 italic mt-1 text-center">
              {AVATAR_PRESETS.find((a) => a.id === avatarId)?.description}
            </div>
            <NextBtn onClick={next} label="Continue" />
          </Step>
        )}

        {step === 'theme' && (
          <Step title="Pick your path" sub="Each path gives your avatar different gear as you progress.">
            <div className="space-y-3">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`w-full rounded-2xl p-4 border transition text-left flex items-center gap-4 ${
                    theme === t.id
                      ? 'bg-white/10 border-white/40'
                      : 'bg-white/3 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex-shrink-0 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${t.swatch[0]} 0%, ${t.swatch[1]} 50%, ${t.swatch[2]} 100%)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                      {t.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-white text-lg">{t.name}</div>
                    <div className="text-xs text-ink-300 mt-0.5">{t.tagline}</div>
                  </div>
                  {theme === t.id && <div className="text-sage-300 text-2xl">✓</div>}
                </button>
              ))}
            </div>
            <NextBtn onClick={next} label="Continue" />
          </Step>
        )}

        {step === 'substance' && (
          <Step
            title="What are you breaking free from?"
            sub="There's no judgment here. Just honesty."
          >
            <div className="grid grid-cols-2 gap-2.5">
              {(Object.keys(SUBSTANCE_LABELS) as Substance[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setSubstance(k)}
                  className={`text-left rounded-2xl p-4 border transition ${
                    substance === k
                      ? 'bg-sage-500/20 border-sage-500/60 text-white'
                      : 'bg-white/5 border-white/10 text-ink-200 hover:border-white/30'
                  }`}
                >
                  <div className="font-medium">{SUBSTANCE_LABELS[k]}</div>
                </button>
              ))}
            </div>
            {substance === 'other' && (
              <input
                autoFocus
                value={customSubstance}
                onChange={(e) => setCustomSubstance(e.target.value)}
                placeholder="What's the habit?"
                className="mt-3 w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder:text-ink-400 focus:outline-none focus:border-sage-500"
              />
            )}
            <NextBtn onClick={next} label="Continue" />
          </Step>
        )}

        {step === 'date' && (
          <Step
            title="When did your journey start?"
            sub="If today, that's perfect. If earlier — even better."
          >
            <input
              type="date"
              value={startDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-lg text-white focus:outline-none focus:border-sage-500"
            />
            <div className="flex gap-2 mt-3 flex-wrap">
              {[
                { label: 'Today', days: 0 },
                { label: 'Yesterday', days: 1 },
                { label: 'A week ago', days: 7 },
                { label: 'A month ago', days: 30 },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() - p.days);
                    setStartDate(d.toISOString().slice(0, 10));
                  }}
                  className="chip hover:bg-sage-500/20 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <NextBtn onClick={next} label="Continue" />
          </Step>
        )}

        {step === 'why' && (
          <Step
            title="Why does this matter?"
            sub="Your reason is the engine. Write it for yourself, not for anyone else."
          >
            <textarea
              autoFocus
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="For my kids. For my health. For the version of me I want to be."
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-ink-400 focus:outline-none focus:border-sage-500 resize-none"
            />
            <NextBtn onClick={next} label="Continue" />
          </Step>
        )}

        {step === 'reveal' && (
          <Reveal name={name} theme={theme} journey={journey} hobbies={hobbies} personality={personality} avatarId={avatarId} onBack={back} onFinish={finish} />
        )}
      </div>
    </div>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-8 w-32 h-32 rounded-full bg-gradient-to-br from-sage-400 to-sage-700 flex items-center justify-center shadow-glow animate-breathe">
        <svg viewBox="0 0 60 60" className="w-16 h-16">
          <path
            d="M30 8 L36 22 L50 22 L39 31 L43 46 L30 37 L17 46 L21 31 L10 22 L24 22 Z"
            fill="#fff"
            opacity="0.95"
          />
        </svg>
      </div>
      <h1 className="font-display text-4xl font-bold gradient-text mb-3">BreakFree</h1>
      <p className="text-ink-200 text-lg mb-2">Your AI sobriety coach</p>
      <p className="text-ink-400 text-sm max-w-xs mx-auto mb-12">
        An avatar that grows with you. A coach that actually knows you. A story you're writing one day at a time.
      </p>
      <button onClick={onNext} className="btn-primary w-full max-w-xs mx-auto">
        Begin
      </button>
      <div className="text-[10px] text-ink-400 mt-6 max-w-xs mx-auto leading-relaxed">
        BreakFree is supportive, not medical. If you're in crisis, call or text 988 (US) or your local emergency line.
      </div>
    </div>
  );
}

function Step({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-floatUp">
      <h2 className="font-display text-2xl font-bold text-white mb-2">{title}</h2>
      {sub && <p className="text-ink-400 text-sm mb-5">{sub}</p>}
      {children}
    </div>
  );
}

function NextBtn({ onClick, disabled, label }: { onClick: () => void; disabled?: boolean; label: string }) {
  return (
    <button onClick={onClick} disabled={disabled} className="btn-primary w-full mt-5">
      {label}
    </button>
  );
}

function Reveal({
  name,
  journey,
  hobbies,
  personality,
  avatarId,
  onBack,
  onFinish,
}: {
  name: string;
  theme: Theme;
  journey: string;
  hobbies: string[];
  personality: string[];
  avatarId: AvatarId;
  onBack: () => void;
  onFinish: () => void;
}) {
  return (
    <div className="text-center animate-floatUp">
      <div className="text-sage-300 text-xs uppercase tracking-[0.25em] mb-3">Meet your avatar</div>
      <h2 className="font-display text-3xl font-bold text-white mb-2">
        This is {name || 'you'}, on day one.
      </h2>
      <p className="text-ink-400 text-sm max-w-xs mx-auto mb-3">
        Every day you stay free, your face stays the same — but a glow builds, and the path you chose shows through.
        By day 365, you'll see yourself differently.
      </p>

      <div className="mb-4">
        <Avatar avatarId={avatarId} stage={0} size={220} showLabel={false} />
      </div>

      {/* Mini-recap of what Sage knows */}
      <div className="glass rounded-2xl p-3 mb-5 text-left">
        <div className="text-[10px] text-sage-300 uppercase tracking-widest mb-1.5 text-center">
          Sage knows you as
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {hobbies.slice(0, 6).map((h) => {
            const t = HOBBY_TAGS.find((x) => x.id === h);
            return t ? (
              <span key={h} className="text-[10px] glass rounded-full px-2.5 py-1 text-ink-200">
                {t.emoji} {t.label}
              </span>
            ) : null;
          })}
          {personality.slice(0, 4).map((p) => {
            const t = PERSONALITY_TAGS.find((x) => x.id === p);
            return t ? (
              <span key={p} className="text-[10px] glass rounded-full px-2.5 py-1 text-ink-200">
                {t.emoji} {t.label}
              </span>
            ) : null;
          })}
          {journey && (
            <span className="text-[10px] glass rounded-full px-2.5 py-1 text-sage-300">
              ✍️ your story
            </span>
          )}
          {hobbies.length === 0 && personality.length === 0 && !journey && (
            <span className="text-[11px] text-ink-400 italic">
              You'll tell me more along the way.
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <button onClick={onFinish} className="btn-primary w-full">
          Start my journey
        </button>
        <button onClick={onBack} className="btn-ghost w-full">
          Back
        </button>
      </div>
    </div>
  );
}
