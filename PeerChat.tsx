@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

html, body, #root {
  height: 100%;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  background: radial-gradient(ellipse at top, #0f1220 0%, #07080f 60%);
  color: #eceef2;
  overscroll-behavior: none;
}

* {
  -webkit-tap-highlight-color: transparent;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
::-webkit-scrollbar-track { background: transparent; }

.scrollbar-thin { scrollbar-width: thin; }
.scrollbar-thin::-webkit-scrollbar { width: 4px; height: 4px; }

/* Hide number input arrows */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }

/* Page background ambient */
.app-bg {
  background:
    radial-gradient(900px 500px at 80% -10%, rgba(67,196,134,0.18), transparent 60%),
    radial-gradient(700px 400px at 0% 110%, rgba(38,133,95,0.18), transparent 60%),
    linear-gradient(180deg, #0f1220 0%, #07080f 100%);
}

.glass {
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015));
  border: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(14px);
}

.glass-strong {
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(18px);
}

.gradient-text {
  background: linear-gradient(90deg, #43c486 0%, #9be7c5 50%, #6fd6a3 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.btn-primary {
  background: linear-gradient(180deg, #43c486 0%, #26855f 100%);
  color: #04241a;
  font-weight: 600;
  border-radius: 14px;
  padding: 12px 18px;
  box-shadow: 0 8px 30px -8px rgba(67,196,134,0.5), inset 0 1px 0 rgba(255,255,255,0.25);
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 12px 36px -10px rgba(67,196,134,0.6), inset 0 1px 0 rgba(255,255,255,0.3); }
.btn-primary:active { transform: translateY(0); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-ghost {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: #eceef2;
  border-radius: 14px;
  padding: 12px 18px;
  font-weight: 500;
  transition: background 0.15s ease;
}
.btn-ghost:hover { background: rgba(255,255,255,0.08); }

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(67,196,134,0.1);
  border: 1px solid rgba(67,196,134,0.25);
  color: #9be7c5;
  font-size: 12px;
  font-weight: 500;
}

.safe-bottom {
  padding-bottom: calc(env(safe-area-inset-bottom, 0) + 12px);
}
.safe-top {
  padding-top: calc(env(safe-area-inset-top, 0) + 12px);
}

@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
.pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }

.shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shine 3s linear infinite;
}
