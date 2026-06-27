import { useEffect, useState } from 'react';
import type { ItemDef, Theme } from '../data/items';
import { THEMED_PALETTES } from '../data/avatar-palettes';

export function ItemUnlockModal({
  item,
  theme,
  onClose,
}: {
  item: ItemDef;
  theme: Theme;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);
  const palette = (THEMED_PALETTES[theme] ?? THEMED_PALETTES.sage)[Math.max(item.stage, 2)];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-5 transition-opacity duration-300 ${
        closing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
      style={{
        background:
          'radial-gradient(circle at 50% 40%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.92) 80%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className={`relative max-w-sm w-full text-center transition-transform duration-500 ${
          closing ? 'scale-90' : 'scale-100 animate-floatUp'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Burst rays */}
        <svg
          viewBox="0 0 300 300"
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 pointer-events-none"
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={150}
                y1={150}
                x2={150 + Math.cos(a) * 140}
                y2={150 + Math.sin(a) * 140}
                stroke={palette.accent1}
                strokeWidth="2"
                opacity="0.5"
              >
                <animate
                  attributeName="opacity"
                  values="0.1;0.7;0.1"
                  dur={`${2 + (i % 3)}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.1}s`}
                />
              </line>
            );
          })}
          <circle cx="150" cy="150" r="120" fill={palette.halo} opacity="0.15">
            <animate attributeName="r" values="115;135;115" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.1;0.25;0.1" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Content */}
        <div className="relative glass-strong rounded-3xl p-7 pt-9 mt-12">
          <div className="text-[10px] text-sage-300 uppercase tracking-[0.3em] font-bold mb-2">
            ✨ New item unlocked
          </div>

          <div className="my-5">
            <ItemIcon item={item} palette={palette} />
          </div>

          <h2 className="font-display text-2xl font-bold text-white mb-1.5">{item.name}</h2>
          <p className="text-ink-200 text-sm leading-relaxed mb-5">{item.description}</p>

          <div className="inline-flex items-center gap-2 text-[10px] text-ink-300 uppercase tracking-widest mb-5 px-3 py-1.5 rounded-full bg-white/5">
            <span>Day</span>
            <span className="text-sage-300 font-bold">{STAGE_DAYS[item.stage]}+</span>
            <span>·</span>
            <span className="capitalize">{item.slot}</span>
          </div>

          <button onClick={handleClose} className="btn-primary w-full">
            Equip
          </button>
          <button
            onClick={handleClose}
            className="mt-2 text-xs text-ink-400 hover:text-white"
          >
            See it later
          </button>
        </div>
      </div>
    </div>
  );
}

const STAGE_DAYS: Record<number, number> = { 0: 0, 1: 7, 2: 30, 3: 90, 4: 180, 5: 365 };

function ItemIcon({ item, palette }: { item: ItemDef; palette: any }) {
  const size = 140;
  return (
    <div
      className="mx-auto relative animate-breathe"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, ${palette.halo}55 0%, transparent 65%)` }}
      />
      <svg viewBox="0 0 140 140" className="relative w-full h-full">
        {/* Theme-specific icon */}
        {item.theme === 'sage' && item.slot === 'crown' && (
          <g>
            <path d="M 30 75 Q 40 50 70 50 Q 100 50 110 75" fill="none" stroke={palette.accent1} strokeWidth="3" />
            {[45, 60, 80, 95].map((x, i) => (
              <ellipse key={i} cx={x} cy={50 - (i % 2) * 4} rx="6" ry="4" fill={palette.accent1} />
            ))}
          </g>
        )}
        {item.theme === 'sage' && item.slot === 'armor' && (
          <g>
            <path d="M 30 50 L 70 40 L 110 50 L 110 110 L 70 120 L 30 110 Z" fill={palette.accent2} opacity="0.8" />
            <path d="M 55 65 Q 70 60 85 65" stroke={palette.accent1} strokeWidth="3" fill="none" />
            <path d="M 60 95 Q 70 90 80 95" stroke={palette.accent1} strokeWidth="3" fill="none" />
          </g>
        )}
        {item.theme === 'sage' && item.slot === 'wings' && (
          <g>
            <path d="M 30 70 Q 10 50 20 90 Q 30 100 60 90 Z" fill={palette.accent2} />
            <path d="M 110 70 Q 130 50 120 90 Q 110 100 80 90 Z" fill={palette.accent2} />
            <circle cx="30" cy="80" r="6" fill={palette.accent1} />
            <circle cx="110" cy="80" r="6" fill={palette.accent1} />
          </g>
        )}
        {(item.theme === 'sage' && item.slot === 'aura') && (
          <g>
            <circle cx="70" cy="70" r="50" fill={palette.halo} opacity="0.3" />
            <circle cx="70" cy="70" r="35" fill={palette.accent1} opacity="0.5" />
            <circle cx="70" cy="70" r="20" fill={palette.accent2} opacity="0.6" />
          </g>
        )}

        {item.theme === 'celestial' && item.slot === 'crown' && (
          <g>
            <circle cx="70" cy="70" r="40" fill="none" stroke={palette.accent1} strokeWidth="3" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={70 + Math.cos(a) * 44}
                  y1={70 + Math.sin(a) * 44}
                  x2={70 + Math.cos(a) * 56}
                  y2={70 + Math.sin(a) * 56}
                  stroke={palette.accent1}
                  strokeWidth="2"
                />
              );
            })}
            <animateTransform attributeName="transform" type="rotate" from="0 70 70" to="360 70 70" dur="20s" repeatCount="indefinite" />
          </g>
        )}
        {item.theme === 'celestial' && item.slot === 'armor' && (
          <g>
            <path d="M 35 55 L 70 45 L 105 55 L 105 105 L 70 115 L 35 105 Z" fill={palette.accent2} opacity="0.85" />
            {[55, 70, 85].map((x, i) => (
              <path key={i} d={`M ${x} 70 L ${x + 2} 75 L ${x + 7} 76 L ${x + 3} 80 L ${x + 4} 86 L ${x} 83 L ${x - 4} 86 L ${x - 3} 80 L ${x - 7} 76 L ${x - 2} 75 Z`} fill={palette.accent1} />
            ))}
          </g>
        )}
        {item.theme === 'celestial' && item.slot === 'wings' && (
          <g>
            <path d="M 30 75 Q 5 50 10 95 Q 30 110 60 95 Z" fill={palette.accent1} opacity="0.7" />
            <path d="M 110 75 Q 135 50 130 95 Q 110 110 80 95 Z" fill={palette.accent1} opacity="0.7" />
            <path d="M 25 70 Q 15 80 20 95" stroke={palette.accent2} strokeWidth="2" fill="none" />
            <path d="M 115 70 Q 125 80 120 95" stroke={palette.accent2} strokeWidth="2" fill="none" />
          </g>
        )}
        {(item.theme === 'celestial' && item.slot === 'aura') && (
          <g>
            <circle cx="70" cy="70" r="55" fill={palette.halo} opacity="0.4" />
            <circle cx="70" cy="70" r="40" fill={palette.accent1} opacity="0.5" />
            <circle cx="70" cy="70" r="22" fill="#ffffff" opacity="0.7" />
          </g>
        )}

        {item.theme === 'warrior' && item.slot === 'crown' && (
          <g>
            <path d="M 30 50 Q 30 35 45 30 L 95 30 Q 110 35 110 50 L 110 75 L 95 70 L 80 75 L 70 70 L 60 75 L 45 70 L 30 75 Z" fill={palette.accent2} />
            <rect x="40" y="55" width="60" height="3" fill={palette.accent1} />
          </g>
        )}
        {item.theme === 'warrior' && item.slot === 'armor' && (
          <g>
            <path d="M 30 55 L 70 45 L 110 55 L 110 105 L 85 115 L 55 115 L 30 105 Z" fill={palette.accent2} stroke={palette.accent1} strokeWidth="2" />
            <circle cx="70" cy="80" r="14" fill={palette.accent1} />
            <path d="M 62 80 L 68 86 L 78 74" stroke={palette.bodyDeep} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {item.theme === 'warrior' && item.slot === 'wings' && (
          <g>
            <path d="M 30 50 Q 0 90 15 130 L 50 110 L 60 100 L 50 70 Z" fill={palette.accent2} />
            <path d="M 110 50 Q 140 90 125 130 L 90 110 L 80 100 L 90 70 Z" fill={palette.accent2} />
            <path d="M 40 80 L 35 95" stroke={palette.accent1} strokeWidth="2" />
            <path d="M 100 80 L 105 95" stroke={palette.accent1} strokeWidth="2" />
          </g>
        )}
        {(item.theme === 'warrior' && item.slot === 'aura') && (
          <g>
            <circle cx="70" cy="70" r="55" fill={palette.halo} opacity="0.4" />
            <path d="M 30 100 L 70 30 L 110 100 Z" fill={palette.accent1} opacity="0.5" />
          </g>
        )}

        {item.theme === 'phoenix' && item.slot === 'crown' && (
          <g>
            <path d="M 30 90 Q 35 50 50 30 Q 55 40 60 30 Q 65 40 70 25 Q 75 40 80 30 Q 85 40 90 30 Q 105 50 110 90 Z" fill={palette.accent1} />
            <path d="M 40 88 Q 50 60 60 50 Q 65 60 70 45 Q 75 60 80 50 Q 90 60 100 88 Z" fill={palette.accent2} />
          </g>
        )}
        {item.theme === 'phoenix' && item.slot === 'armor' && (
          <g>
            <path d="M 30 55 L 70 45 L 110 55 L 110 105 L 70 115 L 30 105 Z" fill={palette.accent2} opacity="0.85" />
            <path d="M 70 65 Q 60 80 65 95 Q 70 90 75 95 Q 80 80 70 65 Z" fill={palette.accent1} />
            <path d="M 70 75 Q 65 85 70 95 Q 75 85 70 75 Z" fill={palette.accent2} />
          </g>
        )}
        {item.theme === 'phoenix' && item.slot === 'wings' && (
          <g>
            <path d="M 25 70 Q 0 60 5 100 Q 20 115 60 100 Z" fill={palette.accent2} opacity="0.9" />
            <path d="M 115 70 Q 140 60 135 100 Q 120 115 80 100 Z" fill={palette.accent2} opacity="0.9" />
            {[15, 30, 45].map((x, i) => (
              <path key={`l${i}`} d={`M ${x} 80 Q ${x + 3} 70 ${x} 60 Q ${x - 3} 70 ${x} 80 Z`} fill={palette.accent1} />
            ))}
            {[95, 110, 125].map((x, i) => (
              <path key={`r${i}`} d={`M ${x} 80 Q ${x + 3} 70 ${x} 60 Q ${x - 3} 70 ${x} 80 Z`} fill={palette.accent1} />
            ))}
          </g>
        )}
        {(item.theme === 'phoenix' && item.slot === 'aura') && (
          <g>
            <circle cx="70" cy="70" r="55" fill={palette.halo} opacity="0.5" />
            <path d="M 70 30 L 60 50 L 75 50 Z" fill={palette.accent1} />
            <path d="M 70 110 L 80 90 L 65 90 Z" fill={palette.accent1} />
            <path d="M 30 70 L 50 60 L 50 75 Z" fill={palette.accent1} />
            <path d="M 110 70 L 90 60 L 90 75 Z" fill={palette.accent1} />
            <circle cx="70" cy="70" r="15" fill={palette.accent2} />
          </g>
        )}
      </svg>
    </div>
  );
}
