// bookshelf/screens-add.jsx — Add Book: ISBN scan → auto-fetch → details form.
const { useState: useStateA, useEffect: useEffectA } = React;

function AddBookScreen({ nav }) {
  const [stage, setStage] = useStateA('scan'); // scan → found → form → done
  const [cond, setCond] = useStateA('Used');
  const [rating, setRating] = useStateA(0);
  const [review, setReview] = useStateA('');
  const [free, setFree] = useStateA(false);
  const [price, setPrice] = useStateA('6');

  // the book we "scanned"
  const scanned = { isbn: '9780525559474', title: 'The Midnight Library', author: 'Matt Haig' };

  useEffectA(() => {
    // drive the status-bar colour: dark camera stages → white text
    if (nav.setDark) nav.setDark(stage === 'scan' || stage === 'found');
    if (stage === 'scan') {
      const t = setTimeout(() => setStage('found'), 2200);
      return () => clearTimeout(t);
    }
    if (stage === 'found') {
      const t = setTimeout(() => setStage('form'), 1400);
      return () => clearTimeout(t);
    }
  }, [stage]);

  if (stage === 'scan' || stage === 'found') {
    return (
      <div className="bs-screen" style={{ background: '#11160f' }}>
        <TopBar title="Scan ISBN" onBack={nav.back} dark/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          {/* viewfinder */}
          <div style={{ position: 'relative', width: 260, height: 200, borderRadius: 18, overflow: 'hidden',
            background: 'linear-gradient(160deg,#2a3326,#1a1f16)' }}>
            {/* fake barcode */}
            <div style={{ position: 'absolute', inset: '38% 18% auto', display: 'flex', gap: 2, height: 56, alignItems: 'stretch' }}>
              {[3,1,2,1,4,1,2,3,1,1,2,4,1,2,1,3,2,1,1,4,2,1].map((w,i)=>(
                <div key={i} style={{ width: w*2, background: i%2 ? 'transparent' : 'rgba(241,232,214,0.85)' }}/>
              ))}
            </div>
            {/* corner brackets */}
            {[['0','0','auto','auto'],['0','auto','auto','0'],['auto','0','0','auto'],['auto','auto','0','0']].map((c,i)=>(
              <div key={i} style={{ position: 'absolute', top: c[0]==='0'?10:'auto', right: c[1]==='0'?10:'auto',
                bottom: c[2]==='0'?10:'auto', left: c[3]==='0'?10:'auto', width: 26, height: 26,
                borderTop: c[0]==='0'?'3px solid var(--clay)':'none', borderRight: c[1]==='0'?'3px solid var(--clay)':'none',
                borderBottom: c[2]==='0'?'3px solid var(--clay)':'none', borderLeft: c[3]==='0'?'3px solid var(--clay)':'none',
                borderRadius: 4 }}/>
            ))}
            {/* scan line */}
            {stage === 'scan' && <div style={{ position: 'absolute', left: 14, right: 14, height: 2, background: 'var(--terra)',
              boxShadow: '0 0 12px 2px rgba(194,90,58,0.8)', animation: 'bsScan 1.5s ease-in-out infinite' }}/>}
          </div>
          <style>{`@keyframes bsScan{0%{top:18%}50%{top:74%}100%{top:18%}}`}</style>

          {stage === 'scan' ? (
            <div style={{ textAlign: 'center', marginTop: 28, color: 'var(--cream)' }}>
              <div className="bs-serif" style={{ fontSize: 19 }}>Point at the barcode</div>
              <div style={{ fontSize: 13, opacity: .6, marginTop: 6 }}>on the back cover of your book</div>
            </div>
          ) : (
            <div className="bs-fade-in" style={{ textAlign: 'center', marginTop: 28, color: 'var(--cream)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(77,107,80,0.25)',
                padding: '8px 16px', borderRadius: 99, fontSize: 14, fontWeight: 700 }}>
                <span style={{ color: 'var(--clay)' }}>✓</span> Found via Open Library
              </div>
              <div className="bs-serif" style={{ fontSize: 20, marginTop: 14 }}>{scanned.title}</div>
              <div style={{ fontSize: 13, opacity: .6 }}>{scanned.author}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (stage === 'done') {
    return (
      <div className="bs-screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="bs-fade-in" style={{ textAlign: 'center', padding: 30 }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--moss)', display: 'grid', placeItems: 'center', margin: '0 auto' }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-10" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="bs-serif" style={{ fontSize: 24, color: 'var(--ink)', marginTop: 20 }}>Added to your shelf</div>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8, lineHeight: 1.5, maxWidth: 260 }}>
            “{scanned.title}” is now live for neighbours nearby — and its passport has begun.
          </p>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Btn kind="primary" onClick={() => nav.go('library')}>See it in My Library</Btn>
            <Btn kind="ghost" onClick={() => nav.go('home')}>Back to browsing</Btn>
          </div>
        </div>
      </div>
    );
  }

  // form
  return (
    <div className="bs-screen">
      <TopBar title="Add your book" onBack={nav.back}/>
      <div className="bs-scroll" style={{ padding: '4px 18px 130px' }}>
        {/* fetched book card */}
        <div style={{ display: 'flex', gap: 14, background: 'var(--card)', borderRadius: 16, padding: 14, boxShadow: '0 2px 10px rgba(43,42,38,0.06)' }}>
          <div style={{ width: 56 }}><Cover isbn={scanned.isbn} title={scanned.title} author={scanned.author} radius={7}/></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10.5, color: 'var(--moss)', fontWeight: 700, letterSpacing: .4 }}>✓ AUTO-FILLED</div>
            <div className="bs-serif" style={{ fontSize: 18, color: 'var(--ink)', marginTop: 3, lineHeight: 1.12 }}>{scanned.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{scanned.author}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', opacity: .7, marginTop: 4 }}>ISBN {scanned.isbn}</div>
          </div>
        </div>

        {/* condition */}
        <div style={{ marginTop: 22 }}>
          <Eyebrow>Condition</Eyebrow>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {['As New','Used','Quite Old'].map(c => (
              <div key={c} className="bs-press" onClick={() => setCond(c)} style={{ flex: 1, textAlign: 'center',
                padding: '12px 4px', borderRadius: 13, fontSize: 13, fontWeight: 700,
                background: cond===c ? 'var(--forest)' : 'var(--card)', color: cond===c ? 'var(--cream)' : 'var(--muted)',
                border: cond===c ? '1px solid var(--forest)' : '1px solid var(--line)' }}>{c}</div>
            ))}
          </div>
        </div>

        {/* rating */}
        <div style={{ marginTop: 22 }}>
          <Eyebrow>Your rating</Eyebrow>
          <div style={{ marginTop: 10 }}><StarPicker value={rating} onChange={setRating}/></div>
        </div>

        {/* review */}
        <div style={{ marginTop: 22 }}>
          <Eyebrow>Your note for the next reader</Eyebrow>
          <textarea value={review} onChange={e => setReview(e.target.value)} rows={3}
            placeholder="I loved this book, I recommend it because…"
            className="bs" style={{ width: '100%', marginTop: 10, boxSizing: 'border-box', resize: 'none',
              border: '1px solid var(--line)', borderRadius: 13, padding: '12px 14px', fontSize: 14,
              background: 'var(--card)', color: 'var(--ink)', outline: 'none', lineHeight: 1.5 }}/>
        </div>

        {/* price */}
        <div style={{ marginTop: 22 }}>
          <Eyebrow>Price</Eyebrow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: free ? 'var(--cream)' : 'var(--card)',
              borderRadius: 13, padding: '12px 14px', border: '1px solid var(--line)', opacity: free ? .5 : 1 }}>
              <span className="bs-serif" style={{ fontSize: 20, color: 'var(--terra)' }}>€</span>
              <input value={price} disabled={free} onChange={e => setPrice(e.target.value.replace(/\D/g,''))}
                className="bs" style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 18,
                  fontWeight: 700, width: 60, marginLeft: 6, color: 'var(--ink)' }}/>
            </div>
            <div className="bs-press" onClick={() => setFree(!free)} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 46, height: 28, borderRadius: 99, background: free ? 'var(--moss)' : 'var(--line)',
                position: 'relative', transition: 'background .15s' }}>
                <div style={{ position: 'absolute', top: 3, left: free ? 21 : 3, width: 22, height: 22, borderRadius: '50%',
                  background: '#fff', transition: 'left .15s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }}/>
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: free ? 'var(--moss)' : 'var(--muted)' }}>Give free</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 18px 30px',
        background: 'linear-gradient(180deg,rgba(251,246,234,0),var(--paper) 32%)' }}>
        <Btn full kind="primary" onClick={() => setStage('done')}>List it on my shelf</Btn>
      </div>
    </div>
  );
}

Object.assign(window, { AddBookScreen });
