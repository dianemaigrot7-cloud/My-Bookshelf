// bookshelf/app.jsx — navigation shell + bottom tab bar, mounted in the iOS frame.
const { useState: useStateApp, useEffect: useEffectApp } = React;

// Base status-bar darkness per screen (dark screens → white status text).
const DARK_SCREENS = { passport: true, paywall: true };

const TABS = [
  { id: 'home', label: 'Browse', icon: (a) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z" stroke={a} strokeWidth="2" strokeLinejoin="round"/></svg>
  )},
  { id: 'library', label: 'Library', icon: (a) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 4h3v16H5zM10 4h3v16h-3z" stroke={a} strokeWidth="2" strokeLinejoin="round"/><path d="M15.5 5l3 .8L15 20l-2.8-.8" stroke={a} strokeWidth="2" strokeLinejoin="round"/></svg>
  )},
  { id: 'add', label: '', icon: () => null, center: true },
  { id: 'messages', label: 'Messages', icon: (a) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v11H9l-4 4V5z" stroke={a} strokeWidth="2" strokeLinejoin="round"/></svg>
  )},
  { id: 'profile', label: 'Profile', icon: (a) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="3.5" stroke={a} strokeWidth="2"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke={a} strokeWidth="2" strokeLinecap="round"/></svg>
  )},
];

function TabBar({ active, onTab }) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40, paddingBottom: 26,
      background: 'linear-gradient(180deg,rgba(251,246,234,0),var(--paper) 38%)', pointerEvents: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: '0 14px',
        height: 64, background: 'var(--card)', borderRadius: 24, pointerEvents: 'auto',
        boxShadow: '0 8px 26px rgba(43,42,38,0.14), 0 1px 0 rgba(255,255,255,0.6) inset', padding: '0 6px' }}>
        {TABS.map(t => {
          if (t.center) return (
            <div key="add" className="bs-press" onClick={() => onTab('add')} style={{ flex: 'none', marginTop: -28 }}>
              <div style={{ width: 56, height: 56, borderRadius: 19, background: 'var(--terra)',
                display: 'grid', placeItems: 'center', boxShadow: '0 8px 18px rgba(194,90,58,0.42)',
                border: '4px solid var(--paper)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/></svg>
              </div>
            </div>
          );
          const on = active === t.id;
          const color = on ? 'var(--terra)' : 'var(--sage)';
          return (
            <div key={t.id} className="bs-press" onClick={() => onTab(t.id)} style={{ flex: 1, display: 'flex',
              flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 0' }}>
              {t.icon(color)}
              <span className="bs" style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: .2 }}>{t.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookshelfApp() {
  useBsTokens();
  const [tab, setTab] = useStateApp('home');
  const [stack, setStack] = useStateApp([]); // [{screen, params}]
  const [dark, setDark] = useStateApp(false);
  // GDPR consent — persisted so the gate only blocks on first run
  const [consent, setConsentState] = useStateApp(() => {
    try { const v = localStorage.getItem('bs_consent'); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  });
  const setConsent = (updater) => setConsentState(prev => {
    const next = typeof updater === 'function' ? updater(prev || {}) : updater;
    try { localStorage.setItem('bs_consent', JSON.stringify(next)); } catch (e) {}
    return next;
  });
  // Account (age-gated signup) — persisted
  const [account, setAccountState] = useStateApp(() => {
    try { const v = localStorage.getItem('bs_account'); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  });
  const setAccount = (a) => { try { localStorage.setItem('bs_account', JSON.stringify(a)); } catch (e) {} setAccountState(a); };
  // Editable profile (seeded from account + defaults)
  const [profile, setProfileState] = useStateApp(null);
  const me = profile || { ...USERS.me, ...(account ? { name: account.name, district: account.district, city: account.city } : {}) };
  const setProfile = (patch) => setProfileState(p => ({ ...(p || me), ...patch }));
  // Cookie banner (web-style variant) — show once after onboarding
  const [cookieDone, setCookieDone] = useStateApp(() => {
    try { return !!localStorage.getItem('bs_cookie'); } catch (e) { return false; }
  });
  const dismissCookie = (prefs) => {
    try { localStorage.setItem('bs_cookie', '1'); } catch (e) {}
    if (prefs) setConsent(c => ({ ...(c || {}), ...prefs }));
    setCookieDone(true);
  };

  const top = stack[stack.length - 1];
  const baseScreen = top ? top.screen : tab;

  // keep status bar colour in sync; the Add screen manages its own (mixed stages)
  useEffectApp(() => { if (baseScreen !== 'add') setDark(!!DARK_SCREENS[baseScreen]); }, [baseScreen]);

  const nav = {
    go: (t) => { if (t === 'add') { setStack([{ screen: 'add', params: {} }]); } else { setStack([]); setTab(t); } },
    push: (screen, params = {}) => setStack(s => [...s, { screen, params }]),
    back: () => setStack(s => s.slice(0, -1)),
    openBook: (bookId) => setStack(s => [...s, { screen: 'bookDetail', params: { bookId } }]),
    openPassport: (bookId) => setStack(s => [...s, { screen: 'passport', params: { bookId } }]),
    openProfile: (userId) => setStack(s => [...s, { screen: 'profile', params: { userId } }]),
    openThread: (bookId) => {
      const t = THREADS.find(x => x.book === bookId);
      setStack(s => [...s, { screen: 'thread', params: { threadId: t ? t.id : 't1' } }]);
    },
    setDark,
  };

  const params = top ? top.params : {};
  const showTabBar = !top && ['home','library','messages','profile'].includes(tab);

  let screen;
  switch (baseScreen) {
    case 'home':       screen = <HomeScreen nav={nav}/>; break;
    case 'library':    screen = <LibraryScreen nav={nav}/>; break;
    case 'messages':   screen = <MessagesScreen nav={nav}/>; break;
    case 'profile':    screen = <ProfileScreen nav={nav} userId={params.userId} me={me}/>; break;
    case 'neighbours': screen = <NeighboursScreen nav={nav}/>; break;
    case 'bookDetail': screen = <BookDetailScreen nav={nav} bookId={params.bookId}/>; break;
    case 'passport':   screen = <PassportScreen nav={nav} bookId={params.bookId}/>; break;
    case 'add':        screen = <AddBookScreen nav={nav}/>; break;
    case 'thread':     screen = <ThreadScreen nav={nav} threadId={params.threadId}/>; break;
    case 'paywall':    screen = <PaywallScreen nav={nav}/>; break;
    case 'terms':      screen = <LegalDocScreen nav={nav} doc="terms"/>; break;
    case 'privacy':    screen = <LegalDocScreen nav={nav} doc="privacy"/>; break;
    case 'privacyData':screen = <PrivacyDataScreen nav={nav} consent={consent || {}} setConsent={setConsent}/>; break;
    case 'editProfile':screen = <EditProfileScreen nav={nav} profile={me} onSave={setProfile}/>; break;
    default:           screen = <HomeScreen nav={nav}/>;
  }

  // Gate 1 — age-gated signup (also lets Terms/Privacy be viewed)
  if (!account) {
    return (
      <IOSDevice dark={false}>
        <div className="bs" style={{ position: 'absolute', inset: 0 }}>
          {top && (top.screen === 'terms' || top.screen === 'privacy')
            ? <LegalDocScreen nav={nav} doc={top.screen}/>
            : <SignupScreen nav={nav} onDone={(a) => { setAccount(a); setStack([]); }}/>}
        </div>
      </IOSDevice>
    );
  }

  // First-run GDPR consent gate (status bar dark text on light bg)
  if (!consent) {
    return (
      <IOSDevice dark={false}>
        <div className="bs" style={{ position: 'absolute', inset: 0 }}>
          {top && (top.screen === 'terms' || top.screen === 'privacy')
            ? <LegalDocScreen nav={nav} doc={top.screen}/>
            : <ConsentScreen nav={nav} onDone={(prefs) => { setConsent({ ...prefs, ts: Date.now() }); setStack([]); }}/>}
        </div>
      </IOSDevice>
    );
  }

  return (
    <IOSDevice dark={dark}>
      <div className="bs" style={{ position: 'absolute', inset: 0 }}>
        <div key={baseScreen + JSON.stringify(params)} className="bs-fade-in" style={{ position: 'absolute', inset: 0 }}>
          {screen}
        </div>
        {showTabBar && tab === 'home' && !cookieDone && <CookieBanner nav={nav} onChoice={dismissCookie}/>}
        {showTabBar && <TabBar active={tab} onTab={nav.go}/>}
      </div>
    </IOSDevice>
  );
}

function Stage() {
  const [scale, setScale] = useStateApp(1);
  useEffectApp(() => {
    const fit = () => {
      const s = Math.min(1, (window.innerHeight - 40) / 874, (window.innerWidth - 40) / 402);
      setScale(s);
    };
    fit(); window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center',
      background: 'radial-gradient(circle at 50% 30%, #ece4d2, #ddd3bd)', padding: 20 }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
        <BookshelfApp/>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Stage/>);
