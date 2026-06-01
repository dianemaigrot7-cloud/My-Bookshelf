import { useState, useEffect } from 'react';
import { IS_CONFIGURED, getNearbyBooks, getBook, addBook } from '../lib/supabase';
import { MOCK_BOOKS, MOCK_MY_BOOKS, MOCK_READING } from '../data/mock';

// Nearby books list (Home screen)
export function useNearbyBooks(district, city) {
  const [books, setBooks]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!IS_CONFIGURED) {
        setBooks(MOCK_BOOKS);
        setLoading(false);
        return;
      }
      const data = await getNearbyBooks(district, city);
      setBooks(data || []);
      setLoading(false);
    }
    load();
  }, [district, city]);

  return { books, loading };
}

// Single book + passport
export function useBook(bookId) {
  const [book, setBook]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;
    async function load() {
      if (!IS_CONFIGURED) {
        const all = [...MOCK_BOOKS, ...MOCK_MY_BOOKS, ...MOCK_READING];
        setBook(all.find(b => b.id === bookId) || null);
        setLoading(false);
        return;
      }
      const data = await getBook(bookId);
      setBook(data);
      setLoading(false);
    }
    load();
  }, [bookId]);

  return { book, loading };
}

// My shelf (library screen)
export function useMyBooks() {
  const [published, setPublished] = useState(MOCK_MY_BOOKS);
  const [reading,   setReading]   = useState(MOCK_READING);

  function publish(bookId) {
    const book = reading.find(b => b.id === bookId);
    if (book) {
      setReading(r => r.filter(b => b.id !== bookId));
      setPublished(p => [...p, book]);
    }
  }

  return { published, reading, publish };
}

// Add book flow
export function useAddBook() {
  const [saving, setSaving] = useState(false);

  async function save(bookData, userId) {
    setSaving(true);
    try {
      if (!IS_CONFIGURED) {
        await new Promise(r => setTimeout(r, 800)); // simulate save
        return { id: `new-${Date.now()}`, ...bookData };
      }
      return await addBook({ ...bookData, userId });
    } finally {
      setSaving(false);
    }
  }

  return { save, saving };
}
