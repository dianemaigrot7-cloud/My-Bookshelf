// Mock data — used when Supabase is not configured.
// Structure mirrors what Supabase queries return.

export const MOCK_USERS = {
  me: { id: 'me', name: 'Sophie Martin', photo_url: 'https://i.pravatar.cc/150?img=47',
    bio: 'Bibliophile, coffee addict, proud Alfama resident. Always happy to swap a good story!',
    district: 'Alfama', city: 'Lisbon', country: '🇵🇹', is_subscribed: false,
    trial_start_date: new Date().toISOString() },
  u1: { id: 'u1', name: 'Carlos Mendes', photo_url: 'https://i.pravatar.cc/150?img=12',
    bio: 'History lover and weekend cyclist. My shelf is full of biographies.',
    district: 'Mouraria', city: 'Lisbon', country: '🇵🇹' },
  u2: { id: 'u2', name: 'Ana Ferreira', photo_url: 'https://i.pravatar.cc/150?img=45',
    bio: 'Literature teacher. Books belong in as many hands as possible.',
    district: 'Bairro Alto', city: 'Lisbon', country: '🇵🇹' },
  u3: { id: 'u3', name: 'Lucas Weber', photo_url: 'https://i.pravatar.cc/150?img=15',
    bio: 'Expat from Berlin, collecting stories from around the world.',
    district: 'Príncipe Real', city: 'Lisbon', country: '🇩🇪' },
  u4: { id: 'u4', name: 'Maria Santos', photo_url: 'https://i.pravatar.cc/150?img=38',
    bio: 'Interior designer with a passion for literary fiction.',
    district: 'Alfama', city: 'Lisbon', country: '🇵🇹' },
  u5: { id: 'u5', name: 'Tomás Oliveira', photo_url: 'https://i.pravatar.cc/150?img=8',
    bio: 'Retired teacher, voracious reader. Come pick up a book, stay for coffee.',
    district: 'Graça', city: 'Lisbon', country: '🇵🇹' },
};

const mkOwnership = (entries) => entries.map((e, i) => ({
  id: `ow-${i}`, owner_id: e.user, city: e.city, country: e.country,
  date_received: e.date, rating: e.rating, review_text: e.note,
  owner: MOCK_USERS[e.user],
}));

export const MOCK_BOOKS = [
  { id: 'b1', isbn: '9780525559474', title: 'The Midnight Library', author: 'Matt Haig',
    current_owner: 'u1', price: 5, is_free: false, condition: 'As New', genre: 'Fiction',
    rating: 5, review: 'A life-changing read. Nora\'s journey made me rethink everything.',
    ownership: mkOwnership([
      { user:'u3', country:'🇩🇪', city:'Berlin',  date:'Mar 2023', rating:5, note:'Devoured it on the train to Hamburg.' },
      { user:'u2', country:'🇵🇹', city:'Porto',   date:'Jul 2023', rating:4, note:'A beautiful concept. I wept at the end.' },
      { user:'u1', country:'🇵🇹', city:'Lisbon',  date:'Jan 2024', rating:5, note:'A life-changing read.' },
    ]) },
  { id: 'b2', isbn: '9780375704024', title: 'Norwegian Wood', author: 'Haruki Murakami',
    current_owner: 'u2', price: 0, is_free: true, condition: 'Used', genre: 'Literary Fiction',
    rating: 5, review: 'Murakami at his most tender. I\'ve read this three times.',
    ownership: mkOwnership([
      { user:'u5', country:'🇵🇹', city:'Lisbon',  date:'Apr 2022', rating:5, note:'My daughter gave me this. I cried twice.' },
      { user:'u2', country:'🇵🇹', city:'Lisbon',  date:'Nov 2023', rating:5, note:'Murakami at his most tender.' },
    ]) },
  { id: 'b3', isbn: '9780061122415', title: 'The Alchemist', author: 'Paulo Coelho',
    current_owner: 'u3', price: 4, is_free: false, condition: 'Quite Old', genre: 'Adventure',
    rating: 4, review: 'A legend for good reason. Read it slowly.',
    ownership: mkOwnership([
      { user:'u4', country:'🇵🇹', city:'Faro',    date:'Jun 2021', rating:4, note:'My travel companion through the Algarve.' },
      { user:'u1', country:'🇵🇹', city:'Lisbon',  date:'Sep 2022', rating:5, note:'Still magical.' },
      { user:'u3', country:'🇩🇪', city:'Munich',  date:'Feb 2023', rating:4, note:'A legend for good reason.' },
    ]) },
  { id: 'b4', isbn: '9780735211292', title: 'Atomic Habits', author: 'James Clear',
    current_owner: 'u4', price: 8, is_free: false, condition: 'As New', genre: 'Self-Help',
    rating: 4, review: 'Genuinely changed how I approach my daily routines.',
    ownership: mkOwnership([
      { user:'u4', country:'🇵🇹', city:'Lisbon',  date:'Mar 2024', rating:4, note:'Genuinely changed my routines.' },
    ]) },
  { id: 'b5', isbn: '9780156012195', title: 'The Little Prince', author: 'Antoine de Saint-Exupéry',
    current_owner: 'u5', price: 0, is_free: true, condition: 'Used', genre: 'Classic',
    rating: 5, review: 'For adults who remember being children.',
    ownership: mkOwnership([
      { user:'u2', country:'🇫🇷', city:'Paris',   date:'Jan 2019', rating:5, note:'Found in a Seine-side bouquiniste.' },
      { user:'u3', country:'🇧🇪', city:'Brussels',date:'May 2020', rating:5, note:'Shared during lockdown.' },
      { user:'u1', country:'🇵🇹', city:'Lisbon',  date:'Aug 2022', rating:5, note:'Makes the world softer.' },
      { user:'u5', country:'🇵🇹', city:'Sintra',  date:'Dec 2023', rating:5, note:'A gift to the world.' },
    ]) },
  { id: 'b6', isbn: '9780062316097', title: 'Sapiens', author: 'Yuval Noah Harari',
    current_owner: 'u1', price: 7, is_free: false, condition: 'Used', genre: 'History',
    rating: 4, review: 'Puts everything in perspective.',
    ownership: mkOwnership([
      { user:'u3', country:'🇬🇧', city:'London',  date:'Oct 2021', rating:5, note:'Could not put it down.' },
      { user:'u1', country:'🇵🇹', city:'Lisbon',  date:'Apr 2023', rating:4, note:'Humbling and fascinating.' },
    ]) },
  { id: 'b7', isbn: '9780571334650', title: 'Normal People', author: 'Sally Rooney',
    current_owner: 'u2', price: 6, is_free: false, condition: 'As New', genre: 'Literary Fiction',
    rating: 4, review: 'Captures the ache of being young.',
    ownership: mkOwnership([
      { user:'u4', country:'🇮🇪', city:'Dublin',  date:'Jul 2022', rating:4, note:'Read in Dublin.' },
      { user:'u2', country:'🇵🇹', city:'Lisbon',  date:'Jan 2024', rating:4, note:'Uncomfortable precision.' },
    ]) },
  { id: 'b8', isbn: '9780399590504', title: 'Educated', author: 'Tara Westover',
    current_owner: 'u3', price: 0, is_free: true, condition: 'Quite Old', genre: 'Memoir',
    rating: 5, review: 'Absolutely extraordinary.',
    ownership: mkOwnership([
      { user:'u5', country:'🇺🇸', city:'New York', date:'Aug 2020', rating:5, note:'Extraordinary.' },
      { user:'u2', country:'🇵🇹', city:'Porto',   date:'Mar 2022', rating:5, note:'Stayed up all night.' },
      { user:'u3', country:'🇩🇪', city:'Hamburg', date:'Sep 2023', rating:5, note:'Unable to speak after finishing.' },
    ]) },
];

export const MOCK_MY_BOOKS = [
  { id: 'mp1', isbn: '9780756404741', title: 'The Name of the Wind', author: 'Patrick Rothfuss',
    current_owner: 'me', price: 5, is_free: false, condition: 'As New', genre: 'Fantasy',
    rating: 5, review: 'An instant favourite.',
    ownership: mkOwnership([{ user:'me', country:'🇵🇹', city:'Lisbon', date:'Mar 2024', rating:5, note:'An instant favourite.' }]) },
  { id: 'mp2', isbn: '9780441013593', title: 'Dune', author: 'Frank Herbert',
    current_owner: 'me', price: 0, is_free: true, condition: 'Used', genre: 'Sci-Fi',
    rating: 5, review: 'Unparalleled world-building.',
    ownership: mkOwnership([
      { user:'u4', country:'🇸🇦', city:'Riyadh', date:'Jan 2020', rating:5, note:'The desert scenes felt very real.' },
      { user:'me', country:'🇵🇹', city:'Lisbon', date:'Nov 2023', rating:5, note:'A masterpiece.' },
    ]) },
];

export const MOCK_READING = [
  { id: 'mr1', isbn: '9780525620792', title: 'The Dutch House', author: 'Ann Patchett',
    current_owner: 'me', price: 5, is_free: false, condition: 'As New', ownership: [] },
];

export const MOCK_THREADS = [
  { id: 't1', with_user: MOCK_USERS.u1, book: MOCK_BOOKS[0],
    unread: 2, has_pending_request: true,
    messages: [
      { id: 'm1', sender_id: 'u1', content: 'Hi! Is The Midnight Library still available?', created_at: '10:02' },
      { id: 'm2', sender_id: 'me', content: 'Yes! Great condition. Are you in Alfama?', created_at: '10:15' },
      { id: 'm3', sender_id: 'u1', content: 'Not far — Mouraria. Could we meet at the miradouro?', created_at: '10:22' },
      { id: 'm4', sender_id: 'u1', content: 'Saturday morning?', created_at: '10:23' },
    ] },
  { id: 't2', with_user: MOCK_USERS.u2, book: MOCK_BOOKS[1],
    unread: 0, has_pending_request: false,
    messages: [
      { id: 'm5', sender_id: 'u2', content: 'Thanks for Norwegian Wood — everything you said it would be!', created_at: 'Yesterday' },
      { id: 'm6', sender_id: 'me', content: 'So glad! Murakami never disappoints 📚', created_at: 'Yesterday' },
    ] },
];

export const MOCK_NEIGHBOURS = [
  { ...MOCK_USERS.u1, x: 0.42, y: 0.28, book_count: 4 },
  { ...MOCK_USERS.u2, x: 0.24, y: 0.55, book_count: 3 },
  { ...MOCK_USERS.u3, x: 0.65, y: 0.38, book_count: 5 },
  { ...MOCK_USERS.u4, x: 0.52, y: 0.68, book_count: 2 },
  { ...MOCK_USERS.u5, x: 0.76, y: 0.22, book_count: 6 },
];
