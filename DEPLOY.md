import { Link } from 'react-router-dom';
import { PayPalButton } from '../components/PayPalButton';
import { useApp } from '../state/store';

// Pricing page — now wired to real PayPal subscriptions.
// Free / Monthly $5 / Yearly $45 (save 25%).
// When VITE_PAYPAL_CLIENT_ID and plan IDs are set, the buttons go live.
// When they're missing, the buttons render an honest "not configured" state.

const FEATURES = [
  'Unlimited AI coach (Sage) conversations',
  'Daily check-ins, journal, wins tracking',
  'Personalized Stay Busy recommendations',
  'Evolving avatar with unlocked gear',
  'Cravings SOS tool (4-7-8 breath, urge surf, grounding)',
  'Local recovery meetings + group finder',
  'Peer chat (when community is enabled)',
];

export default function Pricing() {
  const { state } = useApp();
  const userId = state.profile?.name ? `bf-${state.profile.name.toLowerCase().replace(/\s+/g, '-')}` : undefined;
  const paypalConfigured =
    !!import.meta.env.VITE_PAYPAL_CLIENT_ID &&
    import.meta.env.VITE_PAYPAL_CLIENT_ID !== 'YOUR_LIVE_CLIENT_ID_HERE';

  return (
    <div className="app-bg min-h-full pb-32 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link to="/" className="text-ink-300 hover:text-white text-xl">←</Link>
        <div>
          <div className="text-[10px] text-sage-300 uppercase tracking-[0.25em] font-semibold">
            BreakFree Pro
          </div>
          <h1 className="font-display text-2xl font-bold text-white leading-tight">
            Keep the lights on
          </h1>
        </div>
      </div>
      <p className="text-ink-300 text-sm mb-5 ml-9 max-w-xs leading-relaxed">
        BreakFree is built by people in recovery, for people in recovery.
        If it's helping, consider supporting it.
      </p>

      {/* PayPal status banner */}
      <div className={`rounded-2xl border p-3 mb-5 mx-1 ${paypalConfigured ? 'border-sage-500/30 bg-sage-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
        <div className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${paypalConfigured ? 'text-sage-300' : 'text-amber-300'}`}>
          {paypalConfigured ? '✓ PayPal live' : 'Demo mode'}
        </div>
        <div className="text-ink-200 text-xs leading-relaxed">
          {paypalConfigured
            ? 'Payments are wired up. Subscribing will start a real PayPal subscription you can cancel anytime.'
            : "PayPal isn't connected yet. The buttons below show the design — they won't charge anything until VITE_PAYPAL_CLIENT_ID and plan IDs are set in .env."}
        </div>
      </div>

      {/* Three tiers */}
      <div className="space-y-3">
        {/* YEARLY — highlighted */}
        <PlanCard
          tier="yearly"
          highlight
          priceLabel="$45"
          priceUnit="/year"
          badge="Save 25%"
          badgeSub="$60 if monthly"
          title="Yearly"
          tagline="Best value · covers you for the whole year"
          paypalConfigured={paypalConfigured}
          userId={userId}
        />

        {/* MONTHLY */}
        <PlanCard
          tier="monthly"
          priceLabel="$5"
          priceUnit="/month"
          title="Monthly"
          tagline="Try it out · cancel anytime"
          paypalConfigured={paypalConfigured}
          userId={userId}
        />

        {/* FREE */}
        <div className="rounded-3xl p-5 glass">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-white font-display text-lg font-bold">Free</div>
              <div className="text-ink-400 text-xs mt-0.5">Everything is free while in beta</div>
            </div>
            <div className="text-right">
              <div className="font-display text-3xl font-bold text-white">$0</div>
              <div className="text-[10px] text-ink-400 uppercase tracking-widest">forever</div>
            </div>
          </div>
          <button
            disabled
            className="w-full rounded-xl py-2.5 text-sm font-semibold bg-white/5 text-ink-400 cursor-not-allowed"
          >
            ✓ Current plan
          </button>
        </div>
      </div>

      {/* What's included */}
      <div className="glass rounded-3xl p-5 mt-6">
        <div className="text-[10px] text-sage-300 uppercase tracking-widest mb-3">
          Every plan includes
        </div>
        <div className="space-y-2.5">
          {FEATURES.map((f) => (
            <div key={f} className="flex items-start gap-2.5">
              <div className="text-sage-300 text-sm flex-shrink-0 mt-0.5">✓</div>
              <div className="text-ink-100 text-sm leading-relaxed">{f}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Small print */}
      <div className="mt-6 space-y-3 text-[11px] text-ink-300 leading-relaxed">
        <div className="flex items-start gap-2">
          <span>🔒</span>
          <span>Billed securely through PayPal. Your financial info never touches our servers.</span>
        </div>
        <div className="flex items-start gap-2">
          <span>↩️</span>
          <span>Cancel anytime from your PayPal account. No questions, no dark patterns.</span>
        </div>
        <div className="flex items-start gap-2">
          <span>💚</span>
          <span>First month is <strong className="text-white">free</strong> on the yearly plan — try everything, then decide.</span>
        </div>
        <div className="flex items-start gap-2">
          <span>🆘</span>
          <span>If cost is a barrier, email us. We have sponsored spots for people in early recovery. No one gets turned away.</span>
        </div>
      </div>

      {/* FAQ-style */}
      <div className="mt-8">
        <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-3 px-1">Questions</div>
        <div className="space-y-2.5">
          <Faq q="Why does it cost money?">
            Servers, design, the coach model, real humans keeping the lights on. We're not VC-funded.
            If BreakFree is helping you stay sober, $5 a month keeps it alive.
          </Faq>
          <Faq q="Can I cancel anytime?">
            Yes. Through your PayPal account, one tap. No retention emails, no 'are you sure?' popups.
          </Faq>
          <Faq q="What happens to my data if I cancel?">
            Nothing. Your data stays. You keep your avatar, your wins, your journal. You'd just be back on Free.
          </Faq>
          <Faq q="Is the free tier enough?">
            Honestly, yes. The paid tier is for people who want to support the app and unlock a few extras coming soon. No features are paywalled today.
          </Faq>
        </div>
      </div>

      {/* Footer credit */}
      <div className="text-center mt-8 text-[10px] text-ink-400">
        Built by people in recovery · v0.4 beta
      </div>
    </div>
  );
}

function PlanCard({
  tier,
  highlight,
  priceLabel,
  priceUnit,
  badge,
  badgeSub,
  title,
  tagline,
  paypalConfigured,
  userId,
}: {
  tier: 'monthly' | 'yearly';
  highlight?: boolean;
  priceLabel: string;
  priceUnit: string;
  badge?: string;
  badgeSub?: string;
  title: string;
  tagline: string;
  paypalConfigured: boolean;
  userId?: string;
}) {
  const planId = tier === 'monthly'
    ? import.meta.env.VITE_PAYPAL_PLAN_MONTHLY
    : import.meta.env.VITE_PAYPAL_PLAN_YEARLY;
  // tier is reserved for future PayPal plan-id wiring
  return (
    <div
      className={`relative rounded-3xl p-5 overflow-hidden transition ${
        highlight
          ? 'bg-gradient-to-br from-sage-500/25 to-sage-700/10 border-2 border-sage-500/50 shadow-glow'
          : 'glass-strong'
      }`}
    >
      {badge && (
        <div className="absolute top-3 right-3 chip !py-0.5 !px-2.5 text-[10px] !bg-amber-400/20 !border-amber-400/40 !text-amber-200 font-bold">
          ★ {badge}
        </div>
      )}

      <div className="flex items-baseline gap-1.5 mb-1">
        <div className="font-display text-4xl font-bold text-white tabular-nums">{priceLabel}</div>
        <div className="text-ink-300 text-sm">{priceUnit}</div>
      </div>
      <div className="text-white font-display text-lg font-bold mt-1">{title}</div>
      <div className="text-ink-300 text-xs mt-0.5 leading-relaxed">{tagline}</div>
      {badgeSub && (
        <div className="text-[10px] text-ink-400 mt-1">
          {badgeSub}
        </div>
      )}

      {paypalConfigured && planId && planId !== `P-PLAN_ID_${tier === 'monthly' ? 'MONTHLY' : 'YEARLY'}` ? (
        <div className="mt-4">
          <PayPalButton
            planId={planId}
            tier={tier}
            userId={userId}
            onSuccess={(subId) => console.log('Subscription created:', subId)}
            onError={(err) => console.error('PayPal error:', err)}
          />
        </div>
      ) : (
        <button
          disabled
          title="Demo — PayPal not connected"
          className={`w-full mt-4 rounded-xl py-2.5 text-sm font-semibold transition ${
            highlight
              ? 'bg-sage-600/40 text-white border border-sage-500/50 hover:bg-sage-600/50 disabled:opacity-60'
              : 'bg-white/10 text-white border border-white/15 hover:bg-white/15 disabled:opacity-60'
          }`}
        >
          Subscribe — {priceLabel}{priceUnit}
        </button>
      )}
      <div className="text-[9px] text-ink-400 text-center mt-1.5">
        First month free · cancel anytime
      </div>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="glass rounded-2xl p-3 group">
      <summary className="cursor-pointer text-sm font-medium text-white flex items-center justify-between">
        {q}
        <span className="text-ink-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
      </summary>
      <p className="text-ink-300 text-xs leading-relaxed mt-2 pr-2">{children}</p>
    </details>
  );
}
