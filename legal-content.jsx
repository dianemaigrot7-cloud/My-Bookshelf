// bookshelf/data.jsx — mock data for the My Bookshelf prototype.
// Real ISBNs so Open Library cover art loads: covers.openlibrary.org/b/isbn/{isbn}-L.jpg

const COVER = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

const USERS = {
  me:     { id: 'me',     name: 'You',            photo: 'https://i.pravatar.cc/200?img=47', district: 'Alfama', city: 'Lisbon',     country: '🇵🇹', bio: 'Slow reader, fast lender. Coffee-ring apologist.' },
  sofia:  { id: 'sofia',  name: 'Sofia Marques',  photo: 'https://i.pravatar.cc/200?img=45', district: 'Graça',  city: 'Lisbon',     country: '🇵🇹', bio: 'Translator. I keep books only long enough to fall in love.' },
  tomas:  { id: 'tomas',  name: 'Tomás Reis',     photo: 'https://i.pravatar.cc/200?img=12', district: 'Príncipe Real', city: 'Lisbon', country: '🇵🇹', bio: 'Architecture student. Mostly sci-fi and big ideas.' },
  ines:   { id: 'ines',   name: 'Inês Cardoso',   photo: 'https://i.pravatar.cc/200?img=32', district: 'Alfama', city: 'Lisbon',     country: '🇵🇹', bio: 'Teacher. Always have one to give away.' },
  lukas:  { id: 'lukas',  name: 'Lukas Berg',     photo: 'https://i.pravatar.cc/200?img=15', district: 'Kreuzberg', city: 'Berlin',  country: '🇩🇪', bio: 'Passed through Lisbon, left books behind.' },
  amara:  { id: 'amara',  name: 'Amara Okafor',   photo: 'https://i.pravatar.cc/200?img=20', district: 'Marais', city: 'Paris',      country: '🇫🇷', bio: 'On a year abroad. Reading my way across Europe.' },
  marco:  { id: 'marco',  name: 'Marco Bianchi',  photo: 'https://i.pravatar.cc/200?img=8',  district: 'Trastevere', city: 'Rome',   country: '🇮🇹', bio: 'Bookbinder by trade.' },
  elena:  { id: 'elena',  name: 'Elena Costa',    photo: 'https://i.pravatar.cc/200?img=23', district: 'Gràcia', city: 'Barcelona',  country: '🇪🇸', bio: 'I annotate in pencil. Always erasable.' },
};

// Books available near you (the browse grid). Each has a passport (ownership journey).
const BOOKS = [
  {
    id: 'b1', isbn: '9780143034902', title: 'The Shadow of the Wind', author: 'Carlos Ruiz Zafón',
    genre: 'Fiction', seller: 'sofia', condition: 'Used', price: 6, free: false, rating: 5,
    review: 'A love letter to books themselves. The Barcelona it conjures stayed with me for weeks — read it slowly.',
    passport: [
      { user: 'marco', city: 'Rome',     country: '🇮🇹', date: 'Mar 2022', rating: 5, note: 'Bought at a station kiosk, finished before the train reached Florence.' },
      { user: 'amara', city: 'Paris',    country: '🇫🇷', date: 'Nov 2022', rating: 4, note: 'A friend pressed it into my hands. Now I understand why.' },
      { user: 'sofia', city: 'Lisbon',   country: '🇵🇹', date: 'Jun 2023', rating: 5, note: 'A love letter to books themselves. Reading it again before I let it go.' },
    ],
  },
  {
    id: 'b2', isbn: '9780375704024', title: 'Norwegian Wood', author: 'Haruki Murakami',
    genre: 'Fiction', seller: 'tomas', condition: 'As New', price: 0, free: true, rating: 4,
    review: 'Quieter than his other novels. Melancholy in the best way. Mine barely has a crease.',
    passport: [
      { user: 'lukas', city: 'Berlin', country: '🇩🇪', date: 'Sep 2023', rating: 4, note: 'Read it on long S-Bahn rides. Felt like autumn the whole time.' },
      { user: 'tomas', city: 'Lisbon', country: '🇵🇹', date: 'Feb 2024', rating: 4, note: 'Quieter than his other novels. Passing it on while it still feels new.' },
    ],
  },
  {
    id: 'b3', isbn: '9780525559474', title: 'The Midnight Library', author: 'Matt Haig',
    genre: 'Fiction', seller: 'ines', condition: 'Used', price: 5, free: false, rating: 4,
    review: 'A warm hug of a book about the lives we don\'t live. My students loved borrowing it.',
    passport: [
      { user: 'elena', city: 'Barcelona', country: '🇪🇸', date: 'Jan 2023', rating: 5, note: 'Read it during a hard winter. It helped.' },
      { user: 'amara', city: 'Paris',     country: '🇫🇷', date: 'Aug 2023', rating: 3, note: 'Lovely idea, a little neat for me. Onward it goes.' },
      { user: 'ines',  city: 'Lisbon',    country: '🇵🇹', date: 'Mar 2024', rating: 4, note: 'A warm hug of a book. My students kept borrowing it.' },
    ],
  },
  {
    id: 'b4', isbn: '9780571364879', title: 'Klara and the Sun', author: 'Kazuo Ishiguro',
    genre: 'Sci-Fi', seller: 'tomas', condition: 'As New', price: 8, free: false, rating: 5,
    review: 'Tender and strange. I underlined half of it — apologies to the next reader (in pencil).',
    passport: [
      { user: 'tomas', city: 'Lisbon', country: '🇵🇹', date: 'May 2024', rating: 5, note: 'Tender and strange. Underlined half of it in pencil.' },
    ],
  },
  {
    id: 'b5', isbn: '9780316556347', title: 'Circe', author: 'Madeline Miller',
    genre: 'Fantasy', seller: 'sofia', condition: 'Quite Old', price: 0, free: true, rating: 5,
    review: 'Spine\'s a bit tired from re-reads, but the words are perfect. Free to a good home.',
    passport: [
      { user: 'amara', city: 'Paris',  country: '🇫🇷', date: 'Jul 2021', rating: 5, note: 'Devoured on a beach in Brittany. Sand still in the spine.' },
      { user: 'lukas', city: 'Berlin', country: '🇩🇪', date: 'Apr 2022', rating: 4, note: 'Traded it for a coffee and a story. Worth more than both.' },
      { user: 'elena', city: 'Barcelona', country: '🇪🇸', date: 'Dec 2022', rating: 5, note: 'My favourite of the year. Hard to part with.' },
      { user: 'sofia', city: 'Lisbon', country: '🇵🇹', date: 'Oct 2023', rating: 5, note: 'Spine\'s tired from re-reads but the words are perfect.' },
    ],
  },
  {
    id: 'b6', isbn: '9781984822178', title: 'Normal People', author: 'Sally Rooney',
    genre: 'Fiction', seller: 'ines', condition: 'Used', price: 4, free: false, rating: 3,
    review: 'You\'ll finish it in a weekend. Whether you love them is another matter.',
    passport: [
      { user: 'elena', city: 'Barcelona', country: '🇪🇸', date: 'Feb 2023', rating: 3, note: 'Read in two sittings. Still arguing with myself about it.' },
      { user: 'ines',  city: 'Lisbon',    country: '🇵🇹', date: 'Jan 2024', rating: 3, note: 'A weekend read. Passing it along.' },
    ],
  },
  {
    id: 'b7', isbn: '9780756404741', title: 'The Name of the Wind', author: 'Patrick Rothfuss',
    genre: 'Fantasy', seller: 'lukas', condition: 'Used', price: 7, free: false, rating: 5,
    review: 'Doorstopper worth every page. Carry it home if you can lift it.',
    passport: [
      { user: 'marco', city: 'Rome',   country: '🇮🇹', date: 'Jun 2022', rating: 5, note: 'Read it twice before lending. That never happens.' },
      { user: 'lukas', city: 'Lisbon', country: '🇵🇹', date: 'Nov 2023', rating: 5, note: 'Carried it across three countries. Worth the weight.' },
    ],
  },
  {
    id: 'b8', isbn: '9780316055437', title: 'The Goldfinch', author: 'Donna Tartt',
    genre: 'Fiction', seller: 'elena', condition: 'Quite Old', price: 3, free: false, rating: 4,
    review: 'A brick of a book with a small painting at its heart. Mine has travelled.',
    passport: [
      { user: 'amara', city: 'Paris',     country: '🇫🇷', date: 'Mar 2021', rating: 4, note: 'A whole winter lived inside it.' },
      { user: 'marco', city: 'Rome',      country: '🇮🇹', date: 'Sep 2022', rating: 4, note: 'Slow to start, impossible to stop.' },
      { user: 'elena', city: 'Barcelona', country: '🇪🇸', date: 'May 2023', rating: 4, note: 'A brick of a book with a small painting at its heart.' },
    ],
  },
];

// Your own shelf — one book privately reading, one published.
const MY_READING = [
  { ...BOOKS[3], shelfState: 'reading' }, // Klara, requested+accepted, now reading
];
const MY_PUBLISHED = [
  { id: 'm1', isbn: '9780399590504', title: 'Educated', author: 'Tara Westover', genre: 'Memoir',
    seller: 'me', condition: 'Used', price: 5, free: false, rating: 5,
    review: 'Couldn\'t put it down. Lent it to three people already — your turn.',
    passport: [
      { user: 'lukas', city: 'Berlin', country: '🇩🇪', date: 'Aug 2022', rating: 5, note: 'Read it in a single weekend. Couldn\'t stop.' },
      { user: 'me',    city: 'Lisbon', country: '🇵🇹', date: 'Apr 2024', rating: 5, note: 'Couldn\'t put it down. Your turn next.' },
    ],
  },
];

// Conversations
const THREADS = [
  { id: 't1', with: 'sofia', book: 'b1', unread: 1, messages: [
    { from: 'me',    text: 'Hi Sofia! Is The Shadow of the Wind still available?', time: '9:24' },
    { from: 'sofia', text: 'It is! Want to meet near Largo das Portas do Sol?', time: '9:31' },
    { from: 'sofia', text: 'I\'m free tomorrow after 5 ☕️', time: '9:31' },
  ]},
  { id: 't2', with: 'tomas', book: 'b2', unread: 0, messages: [
    { from: 'tomas', text: 'Norwegian Wood is yours if you still want it 🙂', time: 'Yesterday' },
    { from: 'me',    text: 'Amazing, thank you! Príncipe Real garden this weekend?', time: 'Yesterday' },
  ]},
  { id: 't3', with: 'ines', book: 'b3', unread: 0, request: 'pending', messages: [
    { from: 'ines', text: 'You requested The Midnight Library — happy to pass it on!', time: 'Mon' },
  ]},
];

// Neighbours pins (relative % positions on the mock map)
const NEIGHBOURS = [
  { id: 'sofia', x: 38, y: 42, count: 6 },
  { id: 'tomas', x: 62, y: 30, count: 9 },
  { id: 'ines',  x: 50, y: 64, count: 4 },
  { id: 'lukas', x: 24, y: 58, count: 3 },
];

const bookById = (id) => BOOKS.find(b => b.id === id) || MY_PUBLISHED.find(b => b.id === id) || MY_READING.find(b => b.id === id);
const userById = (id) => USERS[id];

Object.assign(window, {
  COVER, USERS, BOOKS, MY_READING, MY_PUBLISHED, THREADS, NEIGHBOURS, bookById, userById,
});
