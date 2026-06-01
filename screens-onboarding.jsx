// bookshelf/screens-legal.jsx — consent gate, legal docs, Privacy & Data centre.
const { useState: useStateL } = React;

// Small disclaimer ribbon shown on template legal content.
function TemplateNote() {
  return (
    <div className="bs" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(216,164,65,0.16)',
      border: '1px solid rgba(216,164,65,0.5)', borderRadius: 12, padding: '11px 13px', margin: '0 0 18px' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flex: 'none', marginTop: 1 }}>
        <path d="M12 9v4M12 17h.01M10.3 3.9L2.4 17.5A2 2 0 004.1 20.5h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" stroke="#a8472b" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
      <div style={{ fontSize: 12, color: '#7a4a2c', lineHeight: 1.45 }}>
        <strong>Template — not legal advice.</strong> This text must be reviewed and completed by qualified legal counsel for your company and jurisdiction before launch.
      </div>
    </div>
  );
}

// ── Reusable consent toggle row ───────────────────────────────────────
function ConsentRow({ title, desc, on, locked, onToggle }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid var(--line)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>{title}{locked && <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}> · always on</span>}</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3, lineHeight: 1.45 }}>{desc}</div>
      </div>
      <div className={locked ? '' : 'bs-press'} onClick={locked ? undefined : onToggle} style={{ flex: 'none', marginTop: 2,
        width: 46, height: 28, borderRadius: 99, background: on ? 'var(--moss)' : 'var(--line)', opacity: locked ? .55 : 1,
        position: 'relative', transition: 'background .15s', cursor: locked ? 'default' : 'pointer' }}>
        <div style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: '50%',
          background: '#fff', transition: 'left .15s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }}/>
      </div>
    </div>
  );
}

// ── First-run consent gate ────────────────────────────────────────────
function ConsentScreen({ onDone, nav }) {
  const [manage, setManage] = useStateL(false);
  const [analytics, setAnalytics] = useStateL(false);
  const [personalise, setPersonalise] = useStateL(false);
  const [location, setLocation] = useStateL(true);

  const finish = (prefs) => onDone(prefs);

  return (
    <div className="bs-screen">
      <div className="bs-scroll" style={{ padding: '64px 22px 24px' }}>
        <ShelfMark size={40}/>
        <div className="bs-serif" style={{ fontSize: 27, color: 'var(--forest)', marginTop: 16, lineHeight: 1.12 }}>
          Your data, <span style={{ fontStyle: 'italic', color: 'var(--terra)' }}>your choice</span>
        </div>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.55, marginTop: 10 }}>
          We use only what we need to connect you with readers nearby. Choose what else you’re comfortable with — you can change this anytime in Privacy &amp; data.
        </p>

        {!manage ? (
          <div style={{ marginTop: 18 }}>
            <ConsentRow title="Essential" locked on desc="Account, listings, messaging, payments and security. Required to run the app."/>
            <ConsentRow title="Show readers near me" on={location} onToggle={() => setLocation(v=>!v)}
              desc="Use your neighbourhood (district only — never your exact address) to show nearby books and readers."/>
          </div>
        ) : (
          <div style={{ marginTop: 18 }}>
            <ConsentRow title="Essential" locked on desc="Account, listings, messaging, payments and security. Required to run the app."/>
            <ConsentRow title="Show readers near me" on={location} onToggle={() => setLocation(v=>!v)}
              desc="Use your neighbourhood (district only) to show nearby books and readers."/>
            <ConsentRow title="Personalised recommendations" on={personalise} onToggle={() => setPersonalise(v=>!v)}
              desc="Suggest books based on what you read and rate."/>
            <ConsentRow title="Usage analytics" on={analytics} onToggle={() => setAnalytics(v=>!v)}
              desc="Help us improve the app with anonymised usage data."/>
          </div>
        )}

        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 16, lineHeight: 1.5 }}>
          By continuing you agree to our{' '}
          <span className="bs-press" style={{ color: 'var(--terra)', fontWeight: 700 }} onClick={() => nav.push('terms')}>Terms &amp; Conditions</span>{' '}and{' '}
          <span className="bs-press" style={{ color: 'var(--terra)', fontWeight: 700 }} onClick={() => nav.push('privacy')}>Privacy Policy</span>. You confirm you are 16+.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
          <Btn full kind="primary" onClick={() => manage
            ? finish({ analytics, personalise, location, all: false })
            : finish({ analytics: true, personalise: true, location, all: true })}>
            {manage ? 'Save choices & continue' : 'Accept all & continue'}
          </Btn>
          {/* GDPR: rejecting non-essential is as easy as accepting */}
          <Btn full kind="soft" onClick={() => finish({ analytics: false, personalise: false, location, all: false })}>
            Essential only
          </Btn>
          {!manage && (
            <div className="bs-press" onClick={() => setManage(true)} style={{ textAlign: 'center', fontSize: 13.5, fontWeight: 700, color: 'var(--forest)', padding: '6px' }}>
              Manage choices
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Legal document viewer (Terms / Privacy) ──────────────────────────
function LegalDocScreen({ doc, nav }) {
  const isTerms = doc === 'terms';
  const sections = isTerms ? TERMS : PRIVACY;
  return (
    <div className="bs-screen">
      <TopBar title={isTerms ? 'Terms & Conditions' : 'Privacy Policy'} onBack={nav.back}/>
      <div className="bs-scroll" style={{ padding: '4px 20px 40px' }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>Last updated {LAST_UPDATED}</div>
        <TemplateNote/>
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <div className="bs-serif" style={{ fontSize: 17, color: 'var(--forest)', marginBottom: 6, lineHeight: 1.2 }}>{s.h}</div>
            <p style={{ fontSize: 13.5, color: 'var(--ink)', opacity: .85, lineHeight: 1.55, margin: 0 }}>{s.p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Privacy & Data centre (GDPR rights) ──────────────────────────────
function RightRow({ icon, title, desc, action, onClick, danger }) {
  return (
    <div className="bs-press" onClick={onClick} style={{ display: 'flex', gap: 13, alignItems: 'center', padding: '14px 16px',
      background: 'var(--card)', borderRadius: 14, marginBottom: 10, boxShadow: '0 1px 6px rgba(43,42,38,0.05)' }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, flex: 'none', display: 'grid', placeItems: 'center',
        background: danger ? 'rgba(168,71,43,0.1)' : 'var(--cream)' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: danger ? 'var(--terra-deep)' : 'var(--ink)' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>{desc}</div>
      </div>
      <svg width="8" height="14" viewBox="0 0 8 14" style={{ flex: 'none' }}><path d="M1 1l6 6-6 6" stroke="var(--sage)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  );
}

function PrivacyDataScreen({ nav, consent, setConsent }) {
  const [toast, setToast] = useStateL(null);
  const [confirmDelete, setConfirmDelete] = useStateL(false);
  const flash = (m) => { setToast(m); setTimeout(() => setToast(null), 2200); };
  const ic = (path) => <svg width="19" height="19" viewBox="0 0 24 24" fill="none">{path}</svg>;

  return (
    <div className="bs-screen">
      <TopBar title="Privacy & data" onBack={nav.back}/>
      <div className="bs-scroll" style={{ padding: '4px 18px 40px' }}>
        <Eyebrow>Your consents</Eyebrow>
        <div style={{ background: 'var(--card)', borderRadius: 16, padding: '2px 16px', marginTop: 10, marginBottom: 22, boxShadow: '0 1px 6px rgba(43,42,38,0.05)' }}>
          <ConsentRow title="Essential" locked on desc="Required to run the app."/>
          <ConsentRow title="Show readers near me" on={consent.location} onToggle={() => setConsent(c => ({ ...c, location: !c.location }))}
            desc="District only — never your exact address."/>
          <ConsentRow title="Personalised recommendations" on={consent.personalise} onToggle={() => setConsent(c => ({ ...c, personalise: !c.personalise }))}
            desc="Suggestions from what you read and rate."/>
          <ConsentRow title="Usage analytics" on={consent.analytics} onToggle={() => setConsent(c => ({ ...c, analytics: !c.analytics }))}
            desc="Anonymised data to improve the app."/>
        </div>

        <Eyebrow>Your rights under GDPR</Eyebrow>
        <div style={{ marginTop: 10 }}>
          <RightRow onClick={() => flash('We’ll email your data export shortly.')}
            icon={ic(<path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="var(--forest)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>)}
            title="Download my data" desc="Get a portable copy of your account data."/>
          <RightRow onClick={() => nav.push('editProfile')}
            icon={ic(<path d="M4 20l4-1 9-9-3-3-9 9-1 4zM14 5l3 3" stroke="var(--forest)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>)}
            title="Correct my information" desc="Edit your profile and listings."/>
          <RightRow onClick={() => flash('Request received — we’ll be in touch.')}
            icon={ic(<path d="M9 3h6M5 7h14M6 7l1 13h10l1-13" stroke="var(--forest)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>)}
            title="Restrict or object" desc="Limit how we process your data."/>
          <RightRow danger onClick={() => setConfirmDelete(true)}
            icon={ic(<path d="M9 3h6M5 7h14M6 7l1 13h10l1-13M10 11v5M14 11v5" stroke="#a8472b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>)}
            title="Delete my account" desc="Erase your data (‘right to be forgotten’)."/>
        </div>

        <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
          <Btn kind="ghost" full style={{ fontSize: 14, padding: '13px' }} onClick={() => nav.push('terms')}>Terms</Btn>
          <Btn kind="ghost" full style={{ fontSize: 14, padding: '13px' }} onClick={() => nav.push('privacy')}>Privacy Policy</Btn>
        </div>
        <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 16, lineHeight: 1.5, textAlign: 'center' }}>
          You can also lodge a complaint with your local data protection authority.
        </p>
      </div>

      {toast && (
        <div className="bs" style={{ position: 'absolute', left: 18, right: 18, bottom: 30, background: 'var(--forest)', color: 'var(--cream)',
          borderRadius: 14, padding: '14px 16px', fontSize: 13.5, fontWeight: 600, textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>{toast}</div>
      )}

      {confirmDelete && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(43,42,38,0.55)', display: 'flex', alignItems: 'flex-end', zIndex: 60 }}
          onClick={() => setConfirmDelete(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--paper)', borderRadius: '22px 22px 0 0', padding: '24px 22px 34px', width: '100%' }}>
            <div className="bs-serif" style={{ fontSize: 21, color: 'var(--ink)' }}>Delete your account?</div>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5, marginTop: 8 }}>
              This erases your profile, listings and messages. Book passports you contributed to are kept in anonymised form to preserve each book’s history. This can’t be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <Btn kind="ghost" full onClick={() => setConfirmDelete(false)}>Keep my account</Btn>
              <Btn full style={{ background: 'var(--terra-deep)', color: '#fff' }} onClick={() => { setConfirmDelete(false); flash('Account deletion requested.'); }}>Delete</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ConsentScreen, LegalDocScreen, PrivacyDataScreen });
