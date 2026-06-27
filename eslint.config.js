import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { SEED_SESSIONS, SEED_MEMBERS, AMBIENT_MESSAGES } from '../data/community';
import { useApp } from '../state/store';
import { AvatarBubble } from '../components/AvatarBubble';

export default function SessionRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, addPeerMessage, joinSession, leaveSession, profile, days, theme } = useApp();
  const session = SEED_SESSIONS.find((s) => s.id === id);

  const [muted, setMuted] = useState(true);
  const [hand, setHand] = useState(false);
  const [tab, setTab] = useState<'people' | 'chat'>('people');
  const [chatInput, setChatInput] = useState('');
  const [secondsJoined, setSecondsJoined] = useState(0);

  // Mark joined
  useEffect(() => {
    if (id) joinSession(id);
    return () => {
      // Don't auto-leave on unmount (user might navigate around)
    };
  }, [id, joinSession]);

  // Session timer (elapsed since "join")
  useEffect(() => {
    const t = setInterval(() => setSecondsJoined((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Ambient messages drip in
  useEffect(() => {
    if (!session) return;
    const messages = AMBIENT_MESSAGES.r_general ?? [];
    const timer = setTimeout(() => {
      const m = messages[Math.floor(Math.random() * messages.length)];
      if (m) {
        addPeerMessage({
          id: crypto.randomUUID(),
          roomId: `session-${session.id}`,
          memberId: m.memberId,
          text: m.text,
          at: new Date().toISOString(),
        });
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [secondsJoined, session?.id]);

  if (!session) {
    return (
      <div className="app-bg min-h-full flex items-center justify-center p-6 text-center">
        <div>
          <div className="text-2xl mb-2">Session not found</div>
          <Link to="/support/sessions" className="btn-primary inline-block mt-3">Back to sessions</Link>
        </div>
      </div>
    );
  }

  const host = SEED_MEMBERS.find((m) => m.id === session.host);
  const attendees = useMemo(() => {
    // Compose a plausible attendee list — host + N random online members
    const online = SEED_MEMBERS.filter((m) => m.online && m.id !== session.host);
    const shuffled = [...online].sort(() => Math.random() - 0.5);
    const count = Math.min(session.attendees - 1, shuffled.length);
    return [host, ...shuffled.slice(0, count)].filter(Boolean) as typeof SEED_MEMBERS;
  }, [session.id, host]);

  const sessionMessages = (state.peerMessages[`session-${session.id}`] ?? []).filter(
    (m) => !m.system || true
  );

  const sendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    addPeerMessage({
      id: crypto.randomUUID(),
      roomId: `session-${session.id}`,
      memberId: 'me',
      text,
      at: new Date().toISOString(),
    });
    setChatInput('');
  };

  const leave = () => {
    leaveSession(session.id);
    navigate('/support/sessions');
  };

  const mm = Math.floor(secondsJoined / 60).toString().padStart(2, '0');
  const ss = (secondsJoined % 60).toString().padStart(2, '0');

  return (
    <div className="min-h-full flex flex-col" style={{ background: 'linear-gradient(180deg, #0e1a14 0%, #07080f 100%)' }}>
      {/* Top bar */}
      <div className="px-4 pt-5 pb-3 safe-top flex items-center gap-3">
        <button onClick={leave} className="text-ink-300 hover:text-white text-xl">←</button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 pulse-soft" />
            <span className="text-[10px] text-rose-200 uppercase tracking-widest font-bold">Live · {mm}:{ss}</span>
          </div>
          <div className="text-white font-semibold leading-tight truncate">{session.title}</div>
          <div className="text-[10px] text-ink-300">
            {session.attendees} people · {session.format === 'voice' ? 'voice room' : 'text-only'}
          </div>
        </div>
        <button
          onClick={leave}
          className="bg-rose-500/20 border border-rose-500/40 text-rose-200 rounded-xl px-3 py-1.5 text-xs font-semibold hover:bg-rose-500/30"
        >
          Leave
        </button>
      </div>

      {/* Topic */}
      <div className="px-4 mb-3">
        <div className="glass rounded-2xl p-3 text-sm text-ink-200 leading-relaxed">
          <span className="text-[10px] text-sage-300 uppercase tracking-widest block mb-1">Topic</span>
          {session.topic}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-3 flex gap-1 bg-white/5 rounded-2xl p-1">
        <button
          onClick={() => setTab('people')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
            tab === 'people' ? 'bg-sage-500/30 text-white' : 'text-ink-300'
          }`}
        >
          People ({session.attendees})
        </button>
        <button
          onClick={() => setTab('chat')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
            tab === 'chat' ? 'bg-sage-500/30 text-white' : 'text-ink-300'
          }`}
        >
          Chat
        </button>
      </div>

      {/* Body */}
      {tab === 'people' ? (
        <div className="flex-1 px-4 pb-44 overflow-y-auto">
          {/* Host first */}
          {host && (
            <div className="mb-4">
              <div className="text-[10px] text-amber-300 uppercase tracking-widest mb-2 px-1">Host</div>
              <AttendeeTile member={host} isHost={true} speaking={true} muted={muted} you={false} />
            </div>
          )}
          <div>
            <div className="text-[10px] text-ink-400 uppercase tracking-widest mb-2 px-1">Listeners</div>
            <div className="grid grid-cols-2 gap-2.5">
              {attendees.filter((m) => m.id !== host?.id).map((m, i) => (
                <AttendeeTile key={m.id} member={m} speaking={i === 2} muted={true} you={false} />
              ))}
              {/* You tile */}
              <YouTile days={days} theme={theme} muted={muted} hand={hand} name={profile?.name ?? 'You'} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-44 space-y-2">
          {sessionMessages.length === 0 && (
            <div className="text-center text-ink-400 text-xs py-8">
              No messages yet. Say hi 👋
            </div>
          )}
          {sessionMessages.map((m) => {
            const sender = m.memberId === 'me'
              ? null
              : SEED_MEMBERS.find((x) => x.id === m.memberId);
            return (
              <div key={m.id} className="flex items-start gap-2 animate-floatUp">
                {sender && <AvatarBubble days={sender.days} theme={sender.theme} size={28} />}
                {!sender && <AvatarBubble days={days} theme={theme} size={28} ring="#43c486" />}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-ink-300 mb-0.5">
                    {sender ? sender.name : 'You'}
                  </div>
                  <div className={`text-sm leading-relaxed rounded-2xl rounded-tl-sm px-3 py-2 inline-block max-w-full ${
                    !sender ? 'bg-sage-600/30 text-white border border-sage-500/30' : 'glass text-ink-100'
                  }`}>
                    {m.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom controls */}
      <div className="fixed bottom-0 left-0 right-0 px-3 pb-4 safe-bottom z-10">
        <div className="max-w-md mx-auto">
          {tab === 'chat' && (
            <div className="glass-strong rounded-2xl p-1.5 flex items-end gap-2 mb-2">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendChat();
                  }
                }}
                placeholder="Say something supportive…"
                rows={1}
                className="flex-1 bg-transparent text-white placeholder:text-ink-400 px-3 py-2.5 text-sm resize-none focus:outline-none max-h-24"
              />
              <button
                onClick={sendChat}
                disabled={!chatInput.trim()}
                className="btn-primary !rounded-xl !px-3 !py-2 disabled:opacity-30"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12 L19 12 M13 6 L19 12 L13 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex gap-2 justify-center">
            {session.format === 'voice' && (
              <>
                <CircleBtn
                  onClick={() => setMuted((m) => !m)}
                  active={!muted}
                  label={muted ? 'Unmute' : 'Mute'}
                  icon={muted ? '🔇' : '🎙️'}
                />
                <CircleBtn
                  onClick={() => setHand((h) => !h)}
                  active={hand}
                  label="Raise hand"
                  icon="✋"
                />
              </>
            )}
            <CircleBtn
              onClick={() => setTab(tab === 'chat' ? 'people' : 'chat')}
              active={tab === 'chat'}
              label={tab === 'chat' ? 'People' : 'Chat'}
              icon={tab === 'chat' ? '👥' : '💬'}
            />
            <CircleBtn onClick={leave} label="Leave" icon="📞" danger />
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendeeTile({
  member,
  isHost = false,
  speaking = false,
  muted,
}: {
  member: typeof SEED_MEMBERS[number];
  isHost?: boolean;
  speaking?: boolean;
  muted?: boolean;
  you?: boolean;
}) {
  return (
    <div className={`relative glass rounded-2xl p-3 flex flex-col items-center gap-1.5 ${
      speaking ? 'ring-2 ring-sage-400/70 shadow-glow' : ''
    }`}>
      <AvatarBubble days={member.days} theme={member.theme} size={56} online={true} />
      <div className="text-xs text-white font-medium truncate max-w-full">{member.name}</div>
      <div className="text-[10px] text-ink-400">d{member.days}{isHost && ' · Host'}</div>
      {muted && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-[10px]">
          🔇
        </div>
      )}
    </div>
  );
}

function YouTile({ days, theme, muted, hand }: { days: number; theme: any; muted: boolean; hand: boolean; name?: string }) {
  return (
    <div className={`relative glass rounded-2xl p-3 flex flex-col items-center gap-1.5 ring-2 ring-sage-500/40 ${
      !muted ? 'shadow-glow' : ''
    }`}>
      <AvatarBubble days={days} theme={theme} size={56} online={true} ring="#43c486" />
      <div className="text-xs text-white font-medium">You · d{days}</div>
      <div className="text-[10px] text-sage-300">connected</div>
      {muted && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-[10px]">
          🔇
        </div>
      )}
      {hand && (
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-400 text-ink-900 flex items-center justify-center text-base shadow-lg animate-bounce">
          ✋
        </div>
      )}
    </div>
  );
}

function CircleBtn({
  onClick,
  active,
  label,
  icon,
  danger,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  icon: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 ${
        danger ? 'text-rose-300' : active ? 'text-sage-200' : 'text-ink-200'
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition ${
        danger
          ? 'bg-rose-500/20 border border-rose-500/40'
          : active
          ? 'bg-sage-500/30 border border-sage-500/50 shadow-glow'
          : 'bg-white/10 border border-white/10'
      }`}>
        {icon}
      </div>
      <span className="text-[10px]">{label}</span>
    </button>
  );
}
