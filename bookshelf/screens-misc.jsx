// bookshelf/screens-misc.jsx — Library, Messages + thread, Profile.
const { useState: useStateM } = React;

// ── My Library: private "reading" shelf → publish to public shelf ─────
function LibraryScreen({ nav }) {
  const [tab, setTab] = useStateM('reading');
  const [published, setPublished] = useStateM(MY_PUBLISHED.map(b => b.id));
  const reading = MY_READING;

  const publish = (id) => setPublished(p => [...p, id]);

  return (
    <div className="bs-screen">
      <div style={{ flex: 'none', padding: '54px 18px 0' }}>
        <div className="bs-serif" style={{ fontSize: 27, color: 'var(--forest)' }}>My Library</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, background: 'var(--cream)', padding: 4, borderRadius: 13 }}>
          {[['reading','Reading now'],['public','My shelf']].map(([k,label]) => (
            <div key={k} className="bs-press" onClick={() => setTab(k)} style={{ flex: 1, textAlign: 'center',
              padding: '9px', borderRadius: 10, fontSize: 13.5, fontWeight: 700,
              background: tab===k ? 'var(--card)' : 'transparent', color: tab===k ? 'var(--forest)' : 'var(--muted)',
              boxShadow: tab===k ? '0 2px 6px rgba(43,42,38,0.08)' : 'none' }}>{label}</div>
          ))}
        </div>
      </div>

      <div className="bs-scroll bs-fade-in" style={{ padding: '18px 18px 120px' }}>
        {tab === 'reading' ? (
          reading.length ? reading.map(b => (
            <div key={b.id} style={{ display: 'flex', gap: 14, background: 'var(--card)', borderRadius: 16, padding: 14,
              marginBottom: 14, boxShadow: '0 2px 10px rgba(43,42,38,0.06)' }}>
              <div className="bs-press" onClick={() => nav.openBook(b.id)} style={{ width: 64 }}>
                <Cover isbn={b.isbn} title={b.title} author={b.author} radius={8}/>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 11, color: 'var(--clay)', fontWeight: 700, letterSpacing: .3 }}>PRIVATELY READING</div>
                <div className="bs-serif" style={{ fontSize: 17, color: 'var(--ink)', lineHeight: 1.14, marginTop: 2 }}>{b.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{b.author}</div>
                <div style={{ marginTop: 'auto', paddingTop: 10 }}>
                  {published.includes(b.id) ? (
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--moss)' }}>✓ Published to your shelf</span>
                  ) : (
                    <Btn kind="primary" style={{ padding: '10px 16px', fontSize: 14, borderRadius: 11 }}
                      onClick={() => publish(b.id)}>Finished — publish it</Btn>
                  )}
                </div>
              </div>
            </div>
          )) : <EmptyNote text="Nothing on your reading shelf yet."/>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 16px' }}>
            {[...MY_PUBLISHED, ...reading.filter(b => published.includes(b.id))].map(b => (
              <div key={b.id} className="bs-press" onClick={() => nav.openBook(b.id)}>
                <Cover isbn={b.isbn} title={b.title} author={b.author} radius={10}/>
                <div className="bs-serif" style={{ fontSize: 14, marginTop: 8, lineHeight: 1.12 }}>{b.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 }}>
                  <PriceTag price={b.price} free={b.free}/>
                  <span style={{ fontSize: 11, color: 'var(--sage)' }}>{b.passport.length} owners</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyNote({ text }) {
  return <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14, marginTop: 60 }}>{text}</div>;
}

// ── Messages list ─────────────────────────────────────────────────────
function MessagesScreen({ nav }) {
  return (
    <div className="bs-screen">
      <div style={{ flex: 'none', padding: '54px 18px 12px' }}>
        <div className="bs-serif" style={{ fontSize: 27, color: 'var(--forest)' }}>Messages</div>
      </div>
      <div className="bs-scroll" style={{ padding: '4px 12px 120px' }}>
        {THREADS.map(t => {
          const u = userById(t.with); const book = bookById(t.book);
          const last = t.messages[t.messages.length - 1];
          return (
            <div key={t.id} className="bs-press" onClick={() => nav.push('thread', { threadId: t.id })} style={{
              display: 'flex', gap: 12, alignItems: 'center', padding: '12px 12px', borderRadius: 16,
            }}>
              <div style={{ position: 'relative', flex: 'none' }}>
                <img src={u.photo} style={{ width: 50, height: 50, borderRadius: 15, objectFit: 'cover' }}/>
                {t.unread > 0 && <div style={{ position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: 99,
                  background: 'var(--terra)', color: '#fff', fontSize: 10.5, fontWeight: 800, display: 'grid', placeItems: 'center', border: '2px solid var(--paper)' }}>{t.unread}</div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{u.name}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>{last.time}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--moss)', fontWeight: 600, margin: '1px 0 2px' }}>{book.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {last.from === 'me' ? 'You: ' : ''}{last.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Single thread (with request accept/decline) ──────────────────────
function ThreadScreen({ threadId, nav }) {
  const thread = THREADS.find(t => t.id === threadId);
  const u = userById(thread.with); const book = bookById(thread.book);
  const [msgs, setMsgs] = useStateM(thread.messages);
  const [draft, setDraft] = useStateM('');
  const [reqState, setReqState] = useStateM(thread.request || null);

  const send = () => {
    if (!draft.trim()) return;
    setMsgs(m => [...m, { from: 'me', text: draft, time: 'now' }]);
    setDraft('');
  };

  return (
    <div className="bs-screen">
      <TopBar onBack={nav.back} title={u.name} right={
        <img src={u.photo} style={{ width: 36, height: 36, borderRadius: 11, objectFit: 'cover' }}/>
      }/>
      {/* book context banner */}
      <div className="bs-press" onClick={() => nav.openBook(book.id)} style={{ flex: 'none', display: 'flex', gap: 12, alignItems: 'center',
        margin: '0 16px', padding: 10, background: 'var(--cream)', borderRadius: 14 }}>
        <div style={{ width: 34 }}><Cover isbn={book.isbn} title={book.title} author={book.author} radius={5}/></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink)' }}>{book.title}</div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{book.free ? 'Free' : '€'+book.price} · {book.condition}</div>
        </div>
        <PriceTag price={book.price} free={book.free}/>
      </div>

      <div className="bs-scroll" style={{ padding: '16px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reqState === 'pending' && (
          <div style={{ background: 'var(--card)', borderRadius: 16, padding: 16, textAlign: 'center', boxShadow: '0 2px 10px rgba(43,42,38,0.06)' }}>
            <div style={{ fontSize: 13.5, color: 'var(--ink)', marginBottom: 12 }}>
              <strong>{u.name.split(' ')[0]}</strong> requested this book.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn kind="ghost" full style={{ padding: '11px' }} onClick={() => setReqState('declined')}>Decline</Btn>
              <Btn kind="forest" full style={{ padding: '11px' }} onClick={() => setReqState('accepted')}>Accept</Btn>
            </div>
          </div>
        )}
        {reqState === 'accepted' && (
          <div className="bs-fade-in" style={{ background: 'rgba(77,107,80,0.12)', borderRadius: 14, padding: '12px 14px', textAlign: 'center',
            fontSize: 13, fontWeight: 700, color: 'var(--moss)' }}>✓ Accepted — arrange your handover below</div>
        )}
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '76%' }}>
            <div className="bs" style={{ padding: '10px 14px', borderRadius: 16, fontSize: 14, lineHeight: 1.4,
              background: m.from === 'me' ? 'var(--terra)' : 'var(--card)',
              color: m.from === 'me' ? '#fff' : 'var(--ink)',
              borderBottomRightRadius: m.from === 'me' ? 4 : 16, borderBottomLeftRadius: m.from === 'me' ? 16 : 4,
              boxShadow: '0 2px 8px rgba(43,42,38,0.07)' }}>{m.text}</div>
            <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 3, textAlign: m.from === 'me' ? 'right' : 'left' }}>{m.time}</div>
          </div>
        ))}
      </div>

      {/* composer */}
      <div style={{ flex: 'none', padding: '10px 14px 30px', display: 'flex', gap: 10, alignItems: 'center', background: 'var(--paper)' }}>
        <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key==='Enter' && send()}
          placeholder="Message…" className="bs" style={{ flex: 1, border: '1px solid var(--line)', borderRadius: 99,
            padding: '12px 18px', fontSize: 14, outline: 'none', background: 'var(--card)', color: 'var(--ink)' }}/>
        <div className="bs-press" onClick={send} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--terra)',
          display: 'grid', placeItems: 'center', flex: 'none' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12l16-8-6 16-3-7-7-1z" fill="#fff"/></svg>
        </div>
      </div>
    </div>
  );
}

// ── Profile / public library ──────────────────────────────────────────
function ProfileScreen({ userId, nav, me }) {
  const u = userId ? userById(userId) : (me || userById('me'));
  const isMe = !userId || u.id === 'me';
  const shelf = isMe ? MY_PUBLISHED : BOOKS.filter(b => b.seller === u.id);

  return (
    <div className="bs-screen">
      <TopBar onBack={isMe ? null : nav.back} title="" right={isMe ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="bs-press" onClick={() => nav.push('editProfile')} style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--card)',
            display: 'grid', placeItems: 'center', boxShadow: '0 2px 8px rgba(43,42,38,0.08)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 20l4-1 9-9-3-3-9 9-1 4zM14 5l3 3" stroke="var(--forest)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="bs-press" onClick={() => nav.push('privacyData')} style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--card)',
            display: 'grid', placeItems: 'center', boxShadow: '0 2px 8px rgba(43,42,38,0.08)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="var(--forest)" strokeWidth="1.8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="var(--forest)" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </div>
        </div>
      ) : null}/>
      <div className="bs-scroll" style={{ padding: '0 18px 120px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <img src={u.photo} style={{ width: 92, height: 92, borderRadius: 28, objectFit: 'cover', boxShadow: '0 6px 18px rgba(43,42,38,0.18)' }}/>
          <div className="bs-serif" style={{ fontSize: 25, color: 'var(--ink)', marginTop: 14 }}>{u.name}</div>
          <div style={{ fontSize: 13, color: 'var(--moss)', fontWeight: 600, marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="11" height="13" viewBox="0 0 10 13"><path d="M5 0C2.2 0 0 2.2 0 5c0 3.6 5 8 5 8s5-4.4 5-8c0-2.8-2.2-5-5-5z" fill="var(--moss)"/></svg>
            {u.district}, {u.city} {u.country}
          </div>
          <p style={{ fontSize: 14, color: 'var(--ink)', opacity: .8, marginTop: 12, lineHeight: 1.5, maxWidth: 280 }}>{u.bio}</p>
        </div>

        {isMe && (
          <div style={{ background: 'rgba(77,107,80,0.12)', borderRadius: 14, padding: '14px 16px', marginTop: 18 }}>
            <div style={{ fontSize: 11.5, color: 'var(--moss)', fontWeight: 700 }}>YOUR MEMBERSHIP</div>
            <div className="bs-serif" style={{ fontSize: 19, color: 'var(--forest)', marginTop: 4 }}>Free forever 🌱</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, lineHeight: 1.45 }}>
              Unlimited listings, swaps, passports and messages — no subscription, ever.
            </div>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <Eyebrow>{isMe ? 'On my shelf' : `${u.name.split(' ')[0]}'s shelf`} · {shelf.length}</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 12 }}>
            {shelf.map(b => (
              <div key={b.id} className="bs-press" onClick={() => nav.openBook(b.id)}>
                <Cover isbn={b.isbn} title={b.title} author={b.author} radius={8}/>
                <div style={{ marginTop: 6, textAlign: 'center' }}><PriceTag price={b.price} free={b.free}/></div>
              </div>
            ))}
          </div>
        </div>

        {isMe && (
          <div style={{ marginTop: 26 }}>
            <Eyebrow>Privacy &amp; legal</Eyebrow>
            <div style={{ background: 'var(--card)', borderRadius: 16, marginTop: 10, overflow: 'hidden', boxShadow: '0 1px 6px rgba(43,42,38,0.05)' }}>
              {[
                ['Privacy & data', 'Manage consents and your GDPR rights', () => nav.push('privacyData')],
                ['Terms & Conditions', null, () => nav.push('terms')],
                ['Privacy Policy', null, () => nav.push('privacy')],
              ].map(([t, d, fn], i, arr) => (
                <div key={t} className="bs-press" onClick={fn} style={{ display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>{t}</div>
                    {d && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{d}</div>}
                  </div>
                  <svg width="8" height="14" viewBox="0 0 8 14"><path d="M1 1l6 6-6 6" stroke="var(--sage)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { LibraryScreen, MessagesScreen, ThreadScreen, ProfileScreen });
