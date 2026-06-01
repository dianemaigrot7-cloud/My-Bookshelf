// Open Library API integration
// Docs: https://openlibrary.org/developers/api

const OL_BASE = 'https://openlibrary.org';
const COVERS  = 'https://covers.openlibrary.org/b/isbn';

// Look up a book by ISBN-13 or ISBN-10.
// Returns { isbn, title, author, coverUrl, genres } or null if not found.
export async function lookupISBN(isbn) {
  const clean = isbn.replace(/[^0-9X]/g, '');
  try {
    const url = `${OL_BASE}/api/books?bibkeys=ISBN:${clean}&format=json&jscmd=data`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const book = json[`ISBN:${clean}`];
    if (!book) return null;

    const author   = book.authors?.[0]?.name ?? 'Unknown author';
    const genres   = book.subjects?.slice(0, 3).map(s => s.name) ?? [];
    const coverUrl = `${COVERS}/${clean}-L.jpg`;

    return {
      isbn:  clean,
      title: book.title,
      author,
      coverUrl,
      genres,
      publishYear: book.publish_date,
    };
  } catch (e) {
    console.warn('OpenLibrary lookup failed:', e.message);
    return null;
  }
}

// Search books by title / author query.
// Returns array of { isbn, title, author, coverUrl }.
export async function searchBooks(query, limit = 10) {
  try {
    const q   = encodeURIComponent(query);
    const url = `${OL_BASE}/search.json?q=${q}&limit=${limit}&fields=isbn,title,author_name,cover_i`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    return (json.docs ?? []).map(doc => {
      const isbn = doc.isbn?.[0] ?? null;
      return {
        isbn,
        title:    doc.title,
        author:   doc.author_name?.[0] ?? 'Unknown',
        coverUrl: isbn ? `${COVERS}/${isbn}-M.jpg` : null,
      };
    });
  } catch (e) {
    console.warn('OpenLibrary search failed:', e.message);
    return [];
  }
}

// Build a cover URL from ISBN (usable directly in <Image source={{ uri }}>).
export function coverUrl(isbn, size = 'L') {
  return isbn ? `${COVERS}/${isbn}-${size}.jpg` : null;
}
