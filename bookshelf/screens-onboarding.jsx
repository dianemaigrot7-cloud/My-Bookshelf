// bookshelf/screens-onboarding.jsx — Signup age-gate, EditProfile, CookieBanner.
const { useState: useStateO, useRef: useRefO } = React;

const MIN_AGE = 16;

function calcAge(dob) {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

// ── Signup with age-gate ──────────────────────────────────────────────
function SignupScreen({ onDone, nav }) {
  const [step, setStep] = useStateO('form'); // 'form' | 'tooYoung'
  const [name, setName] = useStateO('');
  const [email, setEmail] = useStateO('');
  const [district, setDistrict] = useStateO('');
  const [city, setCity] = useStateO('Lisbon');
  const [dob, setDob] = useStateO('');
  const [err, setErr] = useStateO('');

  const submit = () => {
    if (!name.trim() || !email.trim() || !district.trim() || !city.trim() || !dob) {
      setErr('Please fill in all fields.'); return;
    }
    const age = calcAge(dob);
    if (age < MIN_AGE) { setStep('tooYoung'); return; }
    onDone({ name: name.trim(), email: email.trim(), district: district.trim(), city: city.trim(), dob });
  };

  if (step === 'tooYoung') {
    return (
      <div className="bs-screen" style={{ alignItems: 'center', justifyContent: 'center', padding: 30, textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>📚</div>
        <div className="bs-serif" style={{ fontSize: 26, color: 'var(--forest)', marginTop: 16, lineHeight: 1.15 }}>
          Not quite yet
        </div>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 10, lineHeight: 1.55, maxWidth: 280 }}>
          My Bookshelf is designed for readers aged {MIN_AGE} and over. We can't wait to have you on the shelf — come back soon!
        </p>
        <div style={{ marginTop: 24 }}>
          <Btn kind="ghost" onClick={() => setStep('form')}>Go back</Btn>
        </div>
      </div>
    );
  }

  const field = (label, value, onChange, extra = {}) => (
    <div style={{ marginBottom: 16 }}>
      <Eyebrow>{label}</Eyebrow>
      <input value={value} onChange={e => onChange(e.target.value)}
        className="bs" style={{
          display: 'block', width: '100%', marginTop: 8, boxSizing: 'border-box',
          border: '1px solid var(--line)', borderRadius: 13, padding: '13px 14px',
          fontSize: 15, background: 'var(--card)', color: 'var(--ink)', outline: 'none',
        }} {...extra}/>
    </div>
  );

  return (
    <div className="bs-screen">
      <div className="bs-scroll" style={{ padding: '60px 22px 24px' }}>
        <ShelfMark size={38}/>
        <div className="bs-serif" style={{ fontSize: 28, color: 'var(--forest)', marginTop: 16, lineHeight: 1.12 }}>
          Join your local <span style={{ fontStyle: 'italic', color: 'var(--terra)' }}>bookshelf</span>
        </div>
        <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5, marginTop: 8 }}>
          Share books, discover readers nearby, and follow each copy's passport across the world.
        </p>

        <div style={{ marginTop: 22 }}>
          {field('Your name', name, setName, { placeholder: 'Marie Curie' })}
          {field('Email address', email, setEmail, { type: 'email', placeholder: 'you@example.com' })}
          {field('Your neighbourhood / district', district, setDistrict, { placeholder: 'e.g. Alfama, Montmartre, Kreuzberg' })}
          {field('City', city, setCity, { placeholder: 'Lisbon' })}

          <div style={{ marginBottom: 16 }}>
            <Eyebrow>Date of birth</Eyebrow>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4, marginBottom: 6, lineHeight: 1.4 }}>
              We store only your age band — your full date is never shared with other users.
            </div>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)}
              className="bs" style={{
                display: 'block', width: '100%', boxSizing: 'border-box',
                border: '1px solid var(--line)', borderRadius: 13, padding: '13px 14px',
                fontSize: 15, background: 'var(--card)', color: 'var(--ink)', outline: 'none',
              }}/>
          </div>
        </div>

        {err && (
          <div style={{ fontSize: 13, color: 'var(--terra-deep)', fontWeight: 600, marginBottom: 12 }}>{err}</div>
        )}

        <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 16 }}>
          By joining you agree to our{' '}
          <span className="bs-press" style={{ color: 'var(--terra)', fontWeight: 700 }} onClick={() => nav.push('terms')}>
            Terms &amp; Conditions
          </span>{' '}and{' '}
          <span className="bs-press" style={{ color: 'var(--terra)', fontWeight: 700 }} onClick={() => nav.push('privacy')}>
            Privacy Policy
          </span>.
        </div>

        <Btn full kind="primary" onClick={submit}>Create my account</Btn>
      </div>
    </div>
  );
}

// ── Edit Profile (GDPR rectification) ────────────────────────────────
function EditProfileScreen({ nav, profile, onSave }) {
  const [name, setName] = useStateO(profile.name || '');
  const [bio, setBio] = useStateO(profile.bio || '');
  const [district, setDistrict] = useStateO(profile.district || '');
  const [city, setCity] = useStateO(profile.city || '');

  const save = () => {
    onSave({ name: name.trim(), bio: bio.trim(), district: district.trim(), city: city.trim() });
    nav.back();
  };

  const field = (label, value, onChange, multi = false, hint) => (
    <div style={{ marginBottom: 18 }}>
      <Eyebrow>{label}</Eyebrow>
      {hint && <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3, marginBottom: 6 }}>{hint}</div>}
      {multi ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
          className="bs" style={{
            display: 'block', width: '100%', boxSizing: 'border-box', resize: 'none',
            border: '1px solid var(--line)', borderRadius: 13, padding: '13px 14px',
            fontSize: 15, background: 'var(--card)', color: 'var(--ink)', outline: 'none', lineHeight: 1.5,
          }}/>
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)}
          className="bs" style={{
            display: 'block', width: '100%', boxSizing: 'border-box',
            border: '1px solid var(--line)', borderRadius: 13, padding: '13px 14px',
            fontSize: 15, background: 'var(--card)', color: 'var(--ink)', outline: 'none',
          }}/>
      )}
    </div>
  );

  return (
    <div className="bs-screen">
      <TopBar title="Edit profile" onBack={nav.back} right={
        <div className="bs-press" onClick={save} style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--terra)', padding: '6px 4px' }}>
          Save
        </div>
      }/>
      <div className="bs-scroll" style={{ padding: '4px 18px 60px' }}>
        {/* avatar placeholder */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <img src={profile.photo} style={{ width: 84, height: 84, borderRadius: 24, objectFit: 'cover',
            boxShadow: '0 6px 18px rgba(43,42,38,0.18)' }}/>
          <div style={{ fontSize: 12.5, color: 'var(--terra)', fontWeight: 700, marginTop: 10 }}>Change photo</div>
        </div>

        {field('Display name', name, setName)}
        {field('Bio', bio, setBio, true)}
        {field('Neighbourhood / district', district, setDistrict, false,
          'Only your district is shown to other users — never your exact address.')}
        {field('City', city, setCity)}

        <Btn full kind="primary" onClick={save}>Save changes</Btn>
      </div>
    </div>
  );
}

// ── Cookie / SDK banner ───────────────────────────────────────────────
function CookieBanner({ nav, onChoice }) {
  return (
    <div className="bs" style={{
      position: 'absolute', left: 0, right: 0, bottom: 90, zIndex: 50,
      margin: '0 14px',
    }}>
      <div style={{
        background: 'var(--ink)', borderRadius: 18, padding: '16px 18px',
        boxShadow: '0 12px 32px rgba(43,42,38,0.32)',
      }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--cream)', marginBottom: 5 }}>
          Cookies &amp; personalisation
        </div>
        <p style={{ fontSize: 12.5, color: 'rgba(241,232,214,0.72)', lineHeight: 1.45, margin: '0 0 14px' }}>
          We use essential cookies to run the app. With your consent, we'd also like to use optional analytics to improve your experience.
        </p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="bs-press" onClick={() => onChoice({ analytics: true, personalise: true })}
            style={{
              flex: 1, textAlign: 'center', padding: '10px', borderRadius: 11, fontSize: 13.5, fontWeight: 700,
              background: 'var(--terra)', color: '#fff',
            }}>Accept all</div>
          <div className="bs-press" onClick={() => onChoice({ analytics: false, personalise: false })}
            style={{
              flex: 1, textAlign: 'center', padding: '10px', borderRadius: 11, fontSize: 13.5, fontWeight: 700,
              background: 'rgba(255,255,255,0.10)', color: 'var(--cream)',
            }}>Reject optional</div>
          <div className="bs-press" onClick={() => nav.push('privacyData')}
            style={{ fontSize: 12, color: 'rgba(241,232,214,0.55)', fontWeight: 700, padding: '10px 4px', whiteSpace: 'nowrap' }}>
            Manage
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SignupScreen, EditProfileScreen, CookieBanner });
