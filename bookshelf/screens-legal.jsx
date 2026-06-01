// bookshelf/screens-book.jsx — Book detail + the Book Passport (hero screen).
const { useState: useStateB } = React;

function BookDetailScreen({ bookId, nav }) {
  const book = bookById(bookId);
  const seller = userById(book.seller);
  const [requested, setRequested] = useStateB(false);
  const owners = book.passport.length;
  const countries = new Set(book.passport.map(p => p.country)).size;

  return (
    <div className="bs-screen">
      {/* warm hero band behind cover */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 320,
        background: 'linear-gradient(180deg,var(--cream),var(--paper))' }}/>
      <TopBar onBack={nav.back} right={
        <div className="bs-press" style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--card)',
          display: 'grid', placeItems: 'center', boxShadow: '0 2px 8px rgba(43,42,38,0.08)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z" stroke="var(--terra)" strokeWidth="1.8" strokeLinejoin="round"/></svg>
        </div>
      }/>

      <div className="bs-scroll" style={{ paddingBottom: 130 }}>
        {/* cover + title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 24px 0' }}>
          <div style={{ width: 150 }}><Cover isbn={book.isbn} title={book.title} author={book.author} radius={12}/></div>
          <div className="bs-serif" style={{ fontSize: 26, color: 'var(--ink)', textAlign: 'center', marginTop: 18, lineHeight: 1.12 }}>{book.title}</div>
          <div style={{ fontSize: 14.5, color: 'var(--muted)', marginTop: 4 }}>{book.author}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <ConditionBadge condition={book.condition}/>
            <span style={{ width: 4, height: 4, borderRadius: 99, background: 'var(--line)' }}/>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{book.genre}</span>
          </div>
        </div>

        {/* price + passport teaser row */}
        <div style={{ display: 'flex', gap: 12, padding: '20px 18px 0' }}>
          <div style={{ flex: 1, background: 'var(--card)', borderRadius: 16, padding: '14px 16px', boxShadow: '0 2px 10px rgba(43,42,38,0.06)' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, letterSpacing: .3 }}>PRICE</div>
            <div style={{ marginTop: 4 }}><PriceTag price={book.price} free={book.free} size="lg"/></div>
          </div>
          <div className="bs-press" onClick={() => nav.openPassport(book.id)} style={{ flex: 1, background: 'var(--forest)', borderRadius: 16, padding: '14px 16px', color: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 11, opacity: .7, fontWeight: 600, letterSpacing: .3 }}>PASSPORT</div>
            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{owners} owners · {countries} countries</div>
            <svg width="40" height="40" viewBox="0 0 24 24" style={{ position: 'absolute', right: -6, bottom: -6, opacity: .18 }}><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.5" fill="none"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" stroke="#fff" strokeWidth="1.2" fill="none"/></svg>
          </div>
        </div>

        {/* seller review */}
        <div style={{ padding: '22px 18px 0' }}>
          <Eyebrow>{seller.name.split(' ')[0]}'s note</Eyebrow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
            <img src={seller.photo} style={{ width: 40, height: 40, borderRadius: 12, objectFit: 'cover' }}/>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{seller.name}</div>
              <Stars value={book.rating} size={13}/>
            </div>
          </div>
          <p className="bs-serif" style={{ fontSize: 17, lineHeight: 1.5, color: 'var(--ink)', fontStyle: 'italic', marginTop: 12,
            borderLeft: '3px solid var(--clay)', paddingLeft: 14 }}>“{book.review}”</p>
        </div>
      </div>

      {/* sticky action */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 18px 30px',
        background: 'linear-gradient(180deg,rgba(251,246,234,0),var(--paper) 32%)' }}>
        {!requested ? (
          <Btn full kind="primary" onClick={() => { setRequested(true); }}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v11H8l-4 4V5z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/></svg>}>
            Request this book
          </Btn>
        ) : (
          <div className="bs bs-fade-in" style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, background: 'var(--cream)', borderRadius: 14, padding: '14px', textAlign: 'center', fontWeight: 700, color: 'var(--moss)', fontSize: 14.5 }}>
              ✓ Request sent to {seller.name.split(' ')[0]}
            </div>
            <Btn kind="forest" onClick={() => nav.openThread(book.id)}>Message</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ── THE PASSPORT ──────────────────────────────────────────────────────
function Stamp({ entry, i }) {
  const u = userById(entry.user);
  const rot = [-7, 5, -3, 8, -5][i % 5];
  const tint = ['#a8472b', '#4d6b50', '#3a5870', '#9a6b2f', '#6b3a52'][i % 5];
  return (
    <div style={{ position: 'relative', transform: `rotate(${rot}deg)`, flex: 'none' }}>
      <div style={{
        width: 92, height: 92, borderRadius: '50%', border: `2.5px dashed ${tint}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: tint, textAlign: 'center', opacity: .92,
        boxShadow: 'inset 0 0 0 5px rgba(255,255,255,0.0)',
      }}>
        <div style={{ fontSize: 26, lineHeight: 1 }}>{entry.country}</div>
        <div className="bs" style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .5, marginTop: 3, textTransform: 'uppercase' }}>{entry.city}</div>
        <div className="bs" style={{ fontSize: 8.5, fontWeight: 700, opacity: .8, marginTop: 1 }}>{entry.date}</div>
      </div>
    </div>
  );
}

function PassportScreen({ bookId, nav }) {
  const book = bookById(bookId);
  const journey = book.passport;
  const owners = journey.length;
  const countries = new Set(journey.map(p => p.country)).size;
  const avg = (journey.reduce((s, p) => s + p.rating, 0) / owners).toFixed(1);

  return (
    <div className="bs-screen" style={{ background: 'var(--forest)' }}>
      <TopBar title="Book Passport" onBack={nav.back} dark/>
      <div className="bs-scroll" style={{ padding: '0 0 40px' }}>
        {/* passport "booklet" */}
        <div style={{ margin: '4px 16px 0', borderRadius: 20, overflow: 'hidden',
          background: 'repeating-linear-gradient(135deg,#f6efdd,#f6efdd 22px,#f2ead6 22px,#f2ead6 24px)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.3)' }}>
          {/* cover header */}
          <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 14,
            background: 'linear-gradient(180deg,rgba(168,71,43,0.12),rgba(168,71,43,0))' }}>
            <div style={{ width: 60 }}><Cover isbn={book.isbn} title={book.title} author={book.author} radius={6}/></div>
            <div style={{ flex: 1 }}>
              <div className="bs" style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: 'var(--terra-deep)' }}>BOOK PASSPORT</div>
              <div className="bs-serif" style={{ fontSize: 20, color: 'var(--ink)', lineHeight: 1.1, marginTop: 3 }}>{book.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{book.author}</div>
            </div>
          </div>

          {/* summary stats */}
          <div style={{ display: 'flex', borderTop: '1px dashed rgba(47,74,54,0.25)', borderBottom: '1px dashed rgba(47,74,54,0.25)', margin: '0 16px' }}>
            {[['Owners', owners], ['Countries', countries], ['Avg ★', avg]].map(([k, v]) => (
              <div key={k} style={{ flex: 1, textAlign: 'center', padding: '14px 0' }}>
                <div className="bs-serif" style={{ fontSize: 26, color: 'var(--terra-deep)', lineHeight: 1 }}>{v}</div>
                <div className="bs" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: .5, color: 'var(--muted)', textTransform: 'uppercase', marginTop: 4 }}>{k}</div>
              </div>
            ))}
          </div>

          {/* stamps row */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '20px 16px 8px' }} className="bs-scroll">
            {journey.map((e, i) => <Stamp key={i} entry={e} i={i}/>)}
          </div>
          <div className="bs" style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', paddingBottom: 16, fontStyle: 'italic' }}>
            {countries > 1 ? `Travelled across ${countries} countries` : 'Beginning its journey'} · scroll the stamps →
          </div>
        </div>

        {/* timeline */}
        <div style={{ padding: '24px 22px 0' }}>
          <Eyebrow style={{ color: 'var(--cream)', opacity: .7 }}>The journey, in order</Eyebrow>
          <div style={{ marginTop: 16, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 19, top: 6, bottom: 18, width: 2, background: 'rgba(241,232,214,0.25)' }}/>
            {journey.map((e, i) => {
              const u = userById(e.user);
              const last = i === journey.length - 1;
              return (
                <div key={i} className="bs-fade-in" style={{ display: 'flex', gap: 14, marginBottom: 22, position: 'relative' }}>
                  <div style={{ position: 'relative', flex: 'none' }}>
                    <img src={u.photo} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover',
                      border: `2px solid ${last ? 'var(--clay)' : 'rgba(241,232,214,0.4)'}` }}/>
                    {last && <div style={{ position: 'absolute', right: -2, bottom: -2, background: 'var(--clay)', color: '#fff',
                      fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 99 }}>NOW</div>}
                  </div>
                  <div style={{ flex: 1, background: 'rgba(251,246,234,0.97)', borderRadius: 14, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{u.name}</div>
                      <Stars value={e.rating} size={12}/>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{e.country} {e.city}</span><span>·</span><span>{e.date}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--ink)', opacity: .82, margin: '8px 0 0', lineHeight: 1.45, fontStyle: 'italic' }}>“{e.note}”</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BookDetailScreen, PassportScreen });
