// bookshelf/screens-home.jsx — Home / Browse grid + Neighbours map.
const { useState: useStateH } = React;

function SearchField({ value, onChange, placeholder = 'Search title, author, genre' }) {
  return (
    <div className="bs" style={{
      display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card)',
      borderRadius: 14, padding: '12px 14px', boxShadow: '0 2px 10px rgba(43,42,38,0.06)',
      border: '1px solid var(--line-soft)',
    }}>
      <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="6.5" stroke="var(--sage)" strokeWidth="2"/>
        <path d="M14 14l4 4" stroke="var(--sage)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="bs" style={{
          border: 'none', outline: 'none', background: 'transparent', flex: 1,
          fontSize: 15, color: 'var(--ink)',
        }}/>
    </div>
  );
}

function FilterChips({ active, onToggle }) {
  const chips = ['Free', 'As New', 'Used', 'Quite Old'];
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }} className="bs-scroll">
      {chips.map(c => {
        const on = active.includes(c);
        return (
          <div key={c} className="bs bs-press" onClick={() => onToggle(c)} style={{
            flex: 'none', padding: '8px 15px', borderRadius: 999, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
            background: on ? 'var(--forest)' : 'var(--card)',
            color: on ? 'var(--cream)' : 'var(--muted)',
            border: on ? '1px solid var(--forest)' : '1px solid var(--line)',
          }}>{c}</div>
        );
      })}
    </div>
  );
}

function BookGridCard({ book, nav }) {
  const seller = userById(book.seller);
  return (
    <div className="bs bs-press" onClick={() => nav.openBook(book.id)} style={{ width: '100%' }}>
      <Cover isbn={book.isbn} title={book.title} author={book.author} radius={10}/>
      <div style={{ marginTop: 9 }}>
        <div className="bs-serif" style={{ fontSize: 15, lineHeight: 1.12, color: 'var(--ink)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {book.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{book.author}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 }}>
          <PriceTag price={book.price} free={book.free}/>
          <span style={{ fontSize: 11, color: 'var(--sage)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="10" height="13" viewBox="0 0 10 13"><path d="M5 0C2.2 0 0 2.2 0 5c0 3.6 5 8 5 8s5-4.4 5-8c0-2.8-2.2-5-5-5z" fill="var(--sage)"/></svg>
            {seller.district}
          </span>
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ nav }) {
  const [q, setQ] = useStateH('');
  const [filters, setFilters] = useStateH([]);
  const toggle = (c) => setFilters(f => f.includes(c) ? f.filter(x => x !== c) : [...f, c]);

  let list = BOOKS.filter(b => {
    const text = (b.title + b.author + b.genre).toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    if (filters.includes('Free') && !b.free) return false;
    const conds = filters.filter(f => f !== 'Free');
    if (conds.length && !conds.includes(b.condition)) return false;
    return true;
  });

  return (
    <div className="bs-screen">
      {/* header */}
      <div style={{ flex: 'none', paddingTop: 54, padding: '54px 18px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShelfMark size={30}/>
          <div>
            <div className="bs-serif" style={{ fontSize: 22, color: 'var(--forest)', lineHeight: 1, whiteSpace: 'nowrap' }}>
              <span style={{ fontStyle: 'italic', color: 'var(--terra)' }}>My</span> Bookshelf
            </div>
          </div>
          <div className="bs-press" onClick={() => nav.push('neighbours')} style={{
            marginLeft: 'auto', width: 40, height: 40, borderRadius: 13, background: 'var(--card)',
            display: 'grid', placeItems: 'center', boxShadow: '0 2px 8px rgba(43,42,38,0.08)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2-6-2z" stroke="var(--forest)" strokeWidth="1.7" strokeLinejoin="round"/>
              <path d="M9 3v16M15 5v16" stroke="var(--forest)" strokeWidth="1.7"/>
            </svg>
          </div>
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 6, marginBottom: 14 }}>
          Books near you in <strong style={{ color: 'var(--moss)' }}>Alfama, Lisbon</strong>
        </div>
        <SearchField value={q} onChange={setQ}/>
        <div style={{ marginTop: 12 }}><FilterChips active={filters} onToggle={toggle}/></div>
      </div>

      {/* grid */}
      <div className="bs-scroll bs-fade-in" style={{ padding: '18px 18px 120px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 16px' }}>
          {list.map(b => <BookGridCard key={b.id} book={b} nav={nav}/>)}
        </div>
        {list.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 60, fontSize: 14 }}>
            No books match. Try fewer filters.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Neighbours map ────────────────────────────────────────────────────
function NeighboursScreen({ nav }) {
  const [sel, setSel] = useStateH(null);
  const selUser = sel ? userById(sel) : null;
  return (
    <div className="bs-screen">
      <TopBar title="Neighbours" onBack={nav.back}/>
      <div className="bs-scroll" style={{ padding: '0 0 40px' }}>
        {/* faux map */}
        <div style={{
          position: 'relative', margin: '4px 18px 0', height: 360, borderRadius: 20, overflow: 'hidden',
          background: 'linear-gradient(135deg,#e8e3cf,#dfe6d2)', border: '1px solid var(--line)',
        }}>
          {/* streets */}
          <svg width="100%" height="100%" viewBox="0 0 300 360" style={{ position: 'absolute', inset: 0 }}>
            <g stroke="rgba(47,74,54,0.10)" strokeWidth="8" fill="none">
              <path d="M-10 90 H320 M-10 200 H320 M-10 290 H320"/>
              <path d="M70 -10 V370 M170 -10 V370 M240 -10 V370"/>
            </g>
            <path d="M-10 250 Q120 200 320 270" stroke="rgba(90,140,180,0.35)" strokeWidth="16" fill="none"/>
            <g fill="rgba(77,107,80,0.18)"><circle cx="120" cy="150" r="22"/><circle cx="210" cy="320" r="26"/></g>
          </svg>
          {NEIGHBOURS.map(n => {
            const u = userById(n.id); const on = sel === n.id;
            return (
              <div key={n.id} className="bs-press" onClick={() => setSel(n.id)} style={{
                position: 'absolute', left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%,-100%)',
                zIndex: on ? 5 : 1,
              }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  filter: on ? 'none' : 'saturate(.9)',
                }}>
                  <div style={{
                    width: on ? 52 : 42, height: on ? 52 : 42, borderRadius: '50%',
                    border: `3px solid ${on ? 'var(--terra)' : '#fff'}`, overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(43,42,38,0.28)', transition: 'all .15s',
                  }}>
                    <img src={u.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  </div>
                  <div style={{
                    width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
                    borderTop: `8px solid ${on ? 'var(--terra)' : '#fff'}`, marginTop: -1,
                  }}/>
                </div>
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 12, bottom: 12, background: 'rgba(251,246,234,0.9)',
            borderRadius: 10, padding: '6px 10px', fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>
            {NEIGHBOURS.length} readers nearby
          </div>
        </div>

        {/* selected neighbour card */}
        <div style={{ padding: '18px 18px 0' }}>
          {selUser ? (
            <div className="bs bs-fade-in" style={{ background: 'var(--card)', borderRadius: 18, padding: 16,
              boxShadow: '0 4px 16px rgba(43,42,38,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={selUser.photo} style={{ width: 52, height: 52, borderRadius: 14, objectFit: 'cover' }}/>
                <div style={{ flex: 1 }}>
                  <div className="bs-serif" style={{ fontSize: 18, color: 'var(--ink)' }}>{selUser.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{selUser.district} · {NEIGHBOURS.find(n=>n.id===sel).count} books to share</div>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--ink)', opacity: .8, margin: '12px 0 14px', lineHeight: 1.45 }}>{selUser.bio}</p>
              <Btn full kind="forest" onClick={() => nav.openProfile(sel)}>Browse {selUser.name.split(' ')[0]}'s shelf</Btn>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13.5, padding: '8px 20px' }}>
              Tap a neighbour to peek at their shelf.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, NeighboursScreen });
