import { HashRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useApp } from './state/store';
import Home from './pages/Home';
import Coach from './pages/Coach';
import Progress from './pages/Progress';
import AvatarDetail from './pages/AvatarDetail';
import CheckIn from './pages/CheckIn';
import Onboarding from './pages/Onboarding';
import Support from './pages/Support';
import LiveSessions from './pages/LiveSessions';
import SessionRoom from './pages/SessionRoom';
import PeerChat, { ChatRoom } from './pages/PeerChat';
import StayBusy from './pages/StayBusy';
import Pricing from './pages/Pricing';
import Landing from './pages/Landing';
import { ItemUnlockModal } from './components/ItemUnlockModal';
import { newestItem } from './data/items';
import { ConductModal } from './components/ConductModal';
import { FloatingSOS } from './components/FloatingSOS';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </HashRouter>
  );
}

function AppShell() {
  return (
    <StateGate>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coach" element={<Coach />} />
        <Route path="/busy" element={<StayBusy />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/avatar" element={<AvatarDetail />} />
        <Route path="/checkin" element={<CheckIn />} />
        <Route path="/support" element={<Support />} />
        <Route path="/support/sessions" element={<LiveSessions />} />
        <Route path="/support/sessions/:id" element={<SessionRoom />} />
        <Route path="/support/chat" element={<PeerChat />} />
        <Route path="/support/chat/:id" element={<ChatRoom />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
      <FloatingSOS />
    </StateGate>
  );
}

function StateGate({ children }: { children: React.ReactNode }) {
  const { state, stage, markSeenUnlock, seenConduct, setSeenConduct } = useApp();
  const [showConduct, setShowConduct] = useState(false);

  // Show conduct modal the first time user enters a /support/* route
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash.startsWith('#/support') && !seenConduct) {
        setShowConduct(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [seenConduct]);

  if (!state.profile) {
    return <Onboarding />;
  }

  const newestUnlockable = newestItem(state.profile.theme, stage);
  const showUnlock = newestUnlockable && stage >= 1 && state.seenUnlocks < stage;

  return (
    <>
      {children}
      {showUnlock && newestUnlockable && (
        <ItemUnlockModal
          key={`${newestUnlockable.id}-${stage}`}
          item={newestUnlockable}
          theme={state.profile.theme}
          onClose={() => markSeenUnlock(stage)}
        />
      )}
      {showConduct && (
        <ConductModal
          onAccept={() => {
            setSeenConduct();
            setShowConduct(false);
          }}
        />
      )}
    </>
  );
}

function BottomNav() {
  const { state } = useApp();
  const location = useLocation();
  if (!state.profile) return null;
  const hideNavPaths = ['/checkin', '/support/sessions/', '/support/chat/'];
  if (hideNavPaths.some((p) => location.pathname.startsWith(p))) return null;

  const items = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/coach', label: 'Coach', icon: ChatIcon },
    { to: '/busy', label: 'Busy', icon: BusyIcon },
    { to: '/support', label: 'Support', icon: CommunityIcon },
    { to: '/progress', label: 'Progress', icon: ChartIcon },
    { to: '/avatar', label: 'Avatar', icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 safe-bottom">
      <div className="max-w-md mx-auto px-3 pb-3">
        <div className="glass-strong rounded-2xl flex justify-around p-1.5 shadow-soft">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-2 rounded-xl transition ${
                  isActive ? 'bg-sage-500/25 text-sage-200' : 'text-ink-300 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <it.icon active={isActive} />
                  <span className="text-[10px] mt-1 font-medium">{it.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 11 L12 4 L21 11 V20 a1 1 0 0 1 -1 1 H15 V14 H9 V21 H4 a1 1 0 0 1 -1 -1 Z"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.7}
        strokeLinejoin="round"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity="0.15"
      />
    </svg>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12 a9 9 0 1 1 -3.5 -7.1 L21 4 L20 8 a9 9 0 0 1 1 4 z"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.7}
        strokeLinejoin="round"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity="0.15"
      />
    </svg>
  );
}

function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 20 L4 10 M10 20 L10 4 M16 20 L16 14 M22 20 L22 8"
        stroke="currentColor"
        strokeWidth={active ? 2.4 : 1.9}
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} fill={active ? 'currentColor' : 'none'} fillOpacity="0.15" />
      <path
        d="M4 21 c0 -4.4 3.6 -8 8 -8 s8 3.6 8 8"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.7}
        strokeLinecap="round"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity="0.15"
      />
    </svg>
  );
}

function CommunityIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="9" r="3" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} fill={active ? 'currentColor' : 'none'} fillOpacity="0.2" />
      <circle cx="16" cy="9" r="3" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} fill={active ? 'currentColor' : 'none'} fillOpacity="0.2" />
      <path d="M2 19 c0 -3.3 2.7 -6 6 -6 s6 2.7 6 6" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" fill={active ? 'currentColor' : 'none'} fillOpacity="0.2" />
      <path d="M10 19 c0 -3.3 2.7 -6 6 -6 s6 2.7 6 6" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" fill={active ? 'currentColor' : 'none'} fillOpacity="0.2" />
    </svg>
  );
}

function BusyIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4 L13.5 9 L19 10 L15 13.5 L16 19 L12 16 L8 19 L9 13.5 L5 10 L10.5 9 Z"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.7}
        strokeLinejoin="round"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity="0.2"
      />
    </svg>
  );
}
