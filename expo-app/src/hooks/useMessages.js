import { useState, useEffect } from 'react';
import { IS_CONFIGURED, getThreads, sendMessage, supabase } from '../lib/supabase';
import { MOCK_THREADS } from '../data/mock';

export function useThreads(userId) {
  const [threads, setThreads]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!IS_CONFIGURED) {
      setThreads(MOCK_THREADS);
      setLoading(false);
      return;
    }
    getThreads(userId).then(data => {
      // Group raw messages into thread objects keyed by the other participant
      const map = {};
      (data || []).forEach(msg => {
        const otherId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        const key = [otherId, msg.book_id].join('|');
        if (!map[key]) {
          map[key] = {
            id: key,
            with_user: msg.sender_id === userId ? msg.receiver : msg.sender,
            book: msg.book,
            messages: [],
            unread: 0,
          };
        }
        map[key].messages.push(msg);
        if (!msg.read_at && msg.sender_id !== userId) map[key].unread++;
      });
      setThreads(Object.values(map));
      setLoading(false);
    });
  }, [userId]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!IS_CONFIGURED || !userId) return;
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${userId}`,
      }, (payload) => {
        const msg = payload.new;
        setThreads(prev => prev.map(t => {
          const key = [msg.sender_id, msg.book_id].join('|');
          if (t.id !== key) return t;
          return { ...t, messages: [...t.messages, msg], unread: t.unread + 1 };
        }));
      })
      .subscribe();
    return () => channel.unsubscribe();
  }, [userId]);

  return { threads, loading };
}

export function useThread(threadId) {
  const thread = MOCK_THREADS.find(t => t.id === threadId) || null;
  const [messages, setMessages] = useState(thread?.messages || []);

  async function send(senderId, receiverId, bookId, content) {
    const msg = { id: Date.now().toString(), sender_id: senderId, content, created_at: 'now' };
    setMessages(m => [...m, msg]);
    if (IS_CONFIGURED) {
      await sendMessage({ senderId, receiverId, bookId, content });
    }
  }

  return { thread, messages, send };
}
