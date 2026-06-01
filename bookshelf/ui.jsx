// bookshelf/ui.jsx — design tokens + shared components.

const { useState: useStateUI, useEffect: useEffectUI } = React;

function useBsTokens() {
  useEffectUI(() => {
    if (document.getElementById('bs-tokens')) return;
    const el = document.createElement('style');
    el.id = 'bs-tokens';
    el.textContent = `
      :root {
        --forest: #2f4a36;
        --moss: #4d6b50;
        --sage: #86a083;
        --cream: #f1e8d6;
        --paper: #fbf6ea;
        --card: #fffdf7;
        --terra: #c25a3a;
        --terra-deep: #a8472b;
        --clay: #d98e6a;
        --gold: #d8a441;
        --ink: #2b2a26;
        --muted: #7d7763;
        --line: rgba(47,74,54,0.12);
        --line-soft: rgba(47,74,54,0.07);
      }
      .bs { font-family: 'Hanken Grotesk', sans-serif; }
      .bs-serif { font-family: 'DM Serif Display', serif; }
      .bs-eyebrow {
        font-family: 'Space Grotesk', 'Hanken Grotesk', sans-serif;
        font-size: 12px; font-weight: 700; letter-spacing: 1.4px;
        text-transform: uppercase; color: var(--sage);
      }
      .bs-press {
        cursor: pointer; user-select: none;
        -webkit-tap-highlight-color: transparent;
        transition: transform .12s ease, filter .12s ease;
      }
      .bs-press:active { transform: scale(0.97); filter: brightness(0.94); }
      .bs-fade-in { animation: bsFadeUp .32s ease both; }
      @keyframes bsFadeUp { from { transform: translateY(6px); } to { transform: translateY(0); } }
      .bs-screen {
        display: flex; flex-direction: column;
        height: 100%; overflow: hidden;
        background: var(--paper);
        font-family: 'Hanken Grotesk', sans-serif;
      }
      .bs-scroll { overflow-y: auto; flex: 1; -webkit-overflow-scrolling: touch; }
      .bs-scroll::-webkit-scrollbar { display: none; }
      @keyframes bsScan { 0% { top: 18%; } 50% { top: 74%; } 100% { top: 18%; } }
    `;
    document.head.appendChild(el);
  }, []);
}

// ── ShelfMark ─────────────────────────────────────────────────────────
function ShelfMark({ size = 32, ember = true, markOnly = false }) {
  const h = Math.round(size * 0.72);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(size * 0.28), flexShrink: 0 }}>
      {/* Book-spine mark */}
      <svg width={size} height={h} viewBox="0 0 40 29" fill="none" style={{ flexShrink: 0 }}>
        <rect x="1"  y="7"  width="5.5" height="22" rx="1.5" fill="#c25a3a"/>
        <rect x="8"  y="3"  width="6.5" height="26" rx="1.5" fill="#d8a441"/>
        <rect x="16" y="10" width="5"   height="19" rx="1.5" fill="#d98e6a"/>
        <g transform="rotate(-8 31 18) translate(0 0)">
          <rect x="23" y="5"  width="6.5" height="24" rx="1.5" fill="#c25a3a"/>
        </g>
        <rect x="31" y="8"  width="6"   height="21" rx="1.5" fill="#4d6b50"/>
        <rect x="0"  y="28" width="40"  height="1.5" rx=".75" fill="rgba(47,74,54,0.28)"/>
      </svg>
      {!markOnly && (
        <div className="bs-serif" style={{ fontSize: Math.round(size * 0.64), lineHeight: 1, whiteSpace: 'nowrap' }}>
          <span style={{ fontStyle: 'italic', color: 'var(--terra)' }}>My</span>
          {' '}
          <span style={{ color: 'var(--ink)' }}>Bookshelf</span>
        </div>
      )}
    </div>
  );
}

// ── Stars (display-only) ──────────────────────────────────────────────
function Stars({ value, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= value ? 'var(--gold)' : 'none'}
          stroke={i <= value ? 'var(--gold)' : 'rgba(47,74,54,0.2)'}
          strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

// ── StarPicker (interactive) ──────────────────────────────────────────
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useStateUI(0);
  const show = hover || value;
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="bs-press"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}>
          <svg width="34" height="34" viewBox="0 0 24 24"
            fill={i <= show ? 'var(--gold)' : 'none'}
            stroke={i <= show ? 'var(--gold)' : 'var(--line)'}
            strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      ))}
    </div>
  );
}

// ── Cover ─────────────────────────────────────────────────────────────
function Cover({ isbn, title, author, radius = 10 }) {
  const [err, setErr] = useStateUI(false);
  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
  // Stable fallback colour derived from isbn
  const palette = ['#c25a3a', '#4d6b50', '#3a5870', '#9a6b2f', '#6b3a52', '#2f4a36', '#7a4c38'];
  const idx = (isbn || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
  const bg = palette[idx];
  return (
    <div style={{
      position: 'relative', width: '100%', paddingBottom: '150%',
      borderRadius: radius, overflow: 'hidden',
      boxShadow: '-3px 0 8px rgba(43,42,38,0.18), 0 6px 16px rgba(43,42,38,0.22)',
    }}>
      {!err ? (
        <img src={url} alt={title} onError={() => setErr(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
      ) : (
        <div style={{
          position: 'absolute', inset: 0, background: bg,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: 10, textAlign: 'center',
        }}>
          <div className="bs-serif" style={{
            fontSize: 12, color: '#fff', lineHeight: 1.22,
            display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{title}</div>
          <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.72)', marginTop: 5 }}>{author}</div>
        </div>
      )}
    </div>
  );
}

// ── PriceTag ──────────────────────────────────────────────────────────
function PriceTag({ price, free, size }) {
  const lg = size === 'lg';
  if (free) return (
    <span className="bs" style={{ fontSize: lg ? 22 : 13.5, fontWeight: 800, color: 'var(--moss)' }}>Free</span>
  );
  return (
    <span className="bs-serif" style={{ fontSize: lg ? 28 : 15, color: 'var(--terra)', lineHeight: 1 }}>€{price}</span>
  );
}

// ── ConditionBadge ────────────────────────────────────────────────────
function ConditionBadge({ condition }) {
  const styles = {
    'As New':    { bg: 'rgba(77,107,80,0.12)',    color: 'var(--moss)' },
    'Used':      { bg: 'rgba(47,74,54,0.09)',      color: 'var(--forest)' },
    'Quite Old': { bg: 'rgba(168,71,43,0.10)',     color: 'var(--terra-deep)' },
  };
  const s = styles[condition] || styles['Used'];
  return (
    <span className="bs" style={{
      fontSize: 12, fontWeight: 700, padding: '4px 11px',
      borderRadius: 999, background: s.bg, color: s.color,
    }}>{condition}</span>
  );
}

// ── Btn ───────────────────────────────────────────────────────────────
function Btn({ children, kind = 'primary', full, onClick, icon, style: extra, disabled }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '14px 22px', borderRadius: 14, fontSize: 15.5, fontWeight: 700,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: full ? '100%' : undefined,
  };
  const kinds = {
    primary: { background: 'var(--terra)', color: '#fff', boxShadow: '0 8px 18px rgba(194,90,58,0.32)' },
    forest:  { background: 'var(--forest)', color: 'var(--cream)' },
    ghost:   { background: 'transparent', color: 'var(--forest)', border: '1.5px solid var(--line)' },
    soft:    { background: 'var(--cream)', color: 'var(--forest)' },
  };
  return (
    <div className="bs bs-press" onClick={disabled ? undefined : onClick}
      style={{ ...base, ...(kinds[kind] || kinds.primary), ...extra }}>
      {icon}{children}
    </div>
  );
}

// ── Eyebrow ───────────────────────────────────────────────────────────
function Eyebrow({ children, style: extra }) {
  return <div className="bs-eyebrow" style={extra}>{children}</div>;
}

// ── TopBar ────────────────────────────────────────────────────────────
function TopBar({ title, onBack, dark, right }) {
  const fg = dark ? '#fff' : 'var(--ink)';
  return (
    <div className="bs" style={{
      flex: 'none', display: 'flex', alignItems: 'center',
      padding: '54px 18px 10px', gap: 10, zIndex: 10,
    }}>
      {onBack && (
        <div className="bs-press" onClick={onBack} style={{
          width: 38, height: 38, borderRadius: 12, flex: 'none',
          background: dark ? 'rgba(255,255,255,0.12)' : 'var(--card)',
          display: 'grid', placeItems: 'center',
          boxShadow: dark ? 'none' : '0 2px 8px rgba(43,42,38,0.08)',
        }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M8 2L2 9l6 7" stroke={dark ? '#fff' : 'var(--forest)'} strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      <div style={{ flex: 1, fontSize: 17, fontWeight: 700, color: fg }}>{title}</div>
      {right && <div style={{ flex: 'none' }}>{right}</div>}
    </div>
  );
}

Object.assign(window, {
  useBsTokens, ShelfMark, Stars, StarPicker, Cover,
  PriceTag, ConditionBadge, Btn, Eyebrow, TopBar,
});
