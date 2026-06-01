import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, IS_CONFIGURED, getProfile, updateProfile, upsertConsent } from '../lib/supabase';
import { MOCK_USERS } from '../data/mock';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession]   = useState(null);
  const [profile, setProfile]   = useState(null);
  const [consent, setConsent]   = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!IS_CONFIGURED) {
      // Mock mode — simulate a logged-in user
      setProfile(MOCK_USERS.me);
      setConsent({ analytics: false, personalise: false, location: true });
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) loadProfile(s.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) loadProfile(s.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    const p = await getProfile(userId);
    setProfile(p || { id: userId });
    setLoading(false);
  }

  async function signUp(email, password, profileData) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      await updateProfile(data.user.id, profileData);
      await loadProfile(data.user.id);
    }
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    if (IS_CONFIGURED) await supabase.auth.signOut();
    setSession(null); setProfile(null); setConsent(null);
  }

  async function saveProfile(patch) {
    const updated = { ...profile, ...patch };
    setProfile(updated);
    if (IS_CONFIGURED && session) await updateProfile(session.user.id, patch);
  }

  async function saveConsent(prefs) {
    const updated = { ...(consent || {}), ...prefs };
    setConsent(updated);
    if (IS_CONFIGURED && session) await upsertConsent(session.user.id, updated);
  }

  const userId = IS_CONFIGURED ? session?.user?.id : 'me';
  const isAuthenticated = IS_CONFIGURED ? !!session : true;

  return (
    <AuthContext.Provider value={{
      session, profile, consent, loading,
      userId, isAuthenticated,
      signUp, signIn, signOut,
      saveProfile, saveConsent,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
