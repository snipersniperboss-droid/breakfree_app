// Floating SOS button — visible on every page so cravings help is one tap away.
// Hidden on immersive flows (check-in, session room, chat room).

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CravingsTool } from './CravingsTool';

export function FloatingSOS() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Hide on immersive screens
  const hide = ['/checkin', '/support/sessions/', '/support/chat/'].some((p) =>
    location.pathname.startsWith(p)
  );
  if (hide) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Cravings SOS"
        className="fixed z-30 right-4 group"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0) + 88px)' }}
      >
        <div className="relative">
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full bg-rose-500/40 animate-ring pointer-events-none" />
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition group-hover:scale-105 group-active:scale-95"
            style={{
              background: 'linear-gradient(180deg, #f87171 0%, #b91c1c 100%)',
              boxShadow: '0 8px 24px -6px rgba(220,38,38,0.6), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <span className="text-white text-lg font-bold tracking-wide">SOS</span>
          </div>
          {/* Tooltip */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 opacity-0 group-hover:opacity-100 transition pointer-events-none">
            <div className="glass-strong rounded-xl px-3 py-1.5 text-xs text-white whitespace-nowrap shadow-soft">
              Struggling? Tap for help.
            </div>
          </div>
        </div>
      </button>
      <CravingsTool open={open} onClose={() => setOpen(false)} />
    </>
  );
}
