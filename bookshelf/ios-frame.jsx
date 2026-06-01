// bookshelf/ios-frame.jsx — iPhone-style device frame (prototype chrome only).

function IOSDevice({ children, dark }) {
  const fg = dark ? '#fff' : '#1a1a1a';
  return (
    <div style={{
      width: 390, height: 844,
      background: 'var(--paper, #fbf6ea)',
      borderRadius: 54,
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 40px 80px rgba(0,0,0,0.38), 0 0 0 1.5px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.25)',
    }}>
      {/* Status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 50,
        zIndex: 100, pointerEvents: 'none',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        padding: '15px 28px 0',
        fontFamily: 'Hanken Grotesk, sans-serif',
        fontSize: 15, fontWeight: 700,
        color: fg,
      }}>
        <span>9:41</span>
        {/* Dynamic island / notch */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 126, height: 37, background: '#000',
          borderRadius: '0 0 22px 22px',
        }}/>
        {/* Status icons */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', paddingTop: 1 }}>
          {/* Cellular */}
          <svg width="17" height="12" viewBox="0 0 17 12" fill={fg}>
            <rect x="0" y="8" width="3" height="4" rx=".8" opacity=".4"/>
            <rect x="4.5" y="5.5" width="3" height="6.5" rx=".8" opacity=".6"/>
            <rect x="9" y="2.5" width="3" height="9.5" rx=".8" opacity=".8"/>
            <rect x="13.5" y="0" width="3.5" height="12" rx=".8"/>
          </svg>
          {/* WiFi */}
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <circle cx="8" cy="11" r="1.3" fill={fg}/>
            <path d="M4.6 7.8a4.8 4.8 0 016.8 0" stroke={fg} strokeWidth="1.5" strokeLinecap="round" opacity=".7"/>
            <path d="M1.8 5a8.2 8.2 0 0112.4 0" stroke={fg} strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
          </svg>
          {/* Battery */}
          <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
            <rect x=".5" y=".5" width="22" height="12" rx="3.5" stroke={fg} strokeOpacity=".35"/>
            <rect x="2" y="2" width="17" height="9" rx="2" fill={fg}/>
            <path d="M24 4.5v4a2 2 0 000-4z" fill={fg} opacity=".4"/>
          </svg>
        </div>
      </div>
      {/* App content */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { IOSDevice });
