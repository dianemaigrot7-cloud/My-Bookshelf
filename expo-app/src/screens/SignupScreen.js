import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { ShelfMark, Btn, Eyebrow, LocationButton } from '../components';
import { colors, fonts, radius, spacing } from '../theme';

const MIN_AGE = 16;

function calcAge(dob) {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() ||
     (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
  return age;
}

export default function SignupScreen({ navigation }) {
  const { signUp } = useAuth();
  const [step, setStep]       = useState('form');
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity]       = useState('');
  const [dob, setDob]         = useState('');
  const [err, setErr]         = useState('');
  const [geoNote, setGeoNote] = useState('');
  const [busy, setBusy]       = useState(false);

  async function submit() {
    if (!name || !email || !password || !district || !city || !dob) {
      setErr('Please fill in all fields.'); return;
    }
    const age = calcAge(dob);
    if (age < MIN_AGE) { setStep('tooYoung'); return; }
    setBusy(true);
    try {
      await signUp(email, password, { name, district, city });
    } catch (e) {
      setErr(e.message || 'Could not create account. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function Field({ label, value, onChange, hint, ...props }) {
    return (
      <View style={{ marginBottom: 16 }}>
        <Eyebrow>{label}</Eyebrow>
        {hint && <Text style={s.hint}>{hint}</Text>}
        <TextInput value={value} onChangeText={v => { onChange(v); setErr(''); }}
          placeholderTextColor={colors.sage}
          style={s.input} {...props}/>
      </View>
    );
  }

  if (step === 'tooYoung') {
    return (
      <View style={s.centered}>
        <Text style={{ fontSize: 48 }}>📚</Text>
        <Text style={s.tooYoungTitle}>Not quite yet</Text>
        <Text style={s.tooYoungBody}>
          My Bookshelf is for readers aged {MIN_AGE}+. Come back soon!
        </Text>
        <Btn label="Go back" kind="ghost" onPress={() => setStep('form')}/>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.paper }}
      contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
      <ShelfMark size={38}/>
      <Text style={s.title}>
        Join your local <Text style={{ fontFamily: fonts.serifI, color: colors.terra }}>bookshelf</Text>
      </Text>
      <Text style={s.subtitle}>Share books, discover readers nearby, and follow each copy's passport across the world.</Text>

      <View style={{ marginTop: 22 }}>
        <Field label="Your name" value={name} onChange={setName} placeholder="Marie Curie"/>
        <Field label="Email address" value={email} onChange={setEmail} placeholder="you@example.com"
          keyboardType="email-address" autoCapitalize="none"/>
        <Field label="Password" value={password} onChange={setPass} placeholder="8+ characters"
          secureTextEntry autoCapitalize="none"/>

        <View style={{ marginBottom: 16 }}>
          <Eyebrow>Your neighbourhood</Eyebrow>
          <Text style={s.hint}>Only your district is shown — never your exact address.</Text>
          <LocationButton
            onResult={({ district: d, city: c }) => {
              if (d) setDistrict(d);
              if (c) setCity(c);
              setGeoNote(`Detected: ${d}, ${c}`);
            }}
            onError={msg => setErr(msg)}
          />
          {geoNote ? <Text style={s.geoNote}>{geoNote}</Text> : null}
          <Field label="Neighbourhood / district" value={district} onChange={setDistrict}
            placeholder="Alfama, Montmartre, Kreuzberg…"/>
          <Field label="City" value={city} onChange={setCity} placeholder="Lisbon"/>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Eyebrow>Date of birth</Eyebrow>
          <Text style={s.hint}>We store only your age band — never shared with other users.</Text>
          <TextInput value={dob} onChangeText={v => { setDob(v); setErr(''); }}
            placeholder="YYYY-MM-DD" placeholderTextColor={colors.sage}
            keyboardType="numbers-and-punctuation" style={s.input}/>
        </View>
      </View>

      {err ? <Text style={s.err}>{err}</Text> : null}

      <Text style={s.legal}>
        By joining you agree to our{' '}
        <Text style={s.legalLink} onPress={() => navigation.navigate('Legal', { doc: 'terms' })}>Terms</Text>
        {' '}and{' '}
        <Text style={s.legalLink} onPress={() => navigation.navigate('Legal', { doc: 'privacy' })}>Privacy Policy</Text>.
      </Text>

      <Btn label="Create my account" kind="primary" full loading={busy} onPress={submit}/>

      <TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={{ marginTop: 18, alignItems: 'center' }}>
        <Text style={s.signInLink}>Already have an account? <Text style={{ color: colors.terra }}>Sign in</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll:        { padding: 24, paddingTop: 60, paddingBottom: 40 },
  centered:      { flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center', padding: 30 },
  title:         { fontFamily: fonts.serif, fontSize: 28, color: colors.forest, marginTop: 16, lineHeight: 32 },
  subtitle:      { fontFamily: fonts.sans, fontSize: 13.5, color: colors.muted, lineHeight: 20, marginTop: 8 },
  hint:          { fontFamily: fonts.sans, fontSize: 11.5, color: colors.muted, marginTop: 4, marginBottom: 8, lineHeight: 16 },
  input:         { fontFamily: fonts.sans, fontSize: 15, color: colors.ink, backgroundColor: colors.card, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1, borderColor: colors.line, marginTop: 8 },
  geoNote:       { fontFamily: fonts.sansSb, fontSize: 12, color: colors.moss, marginBottom: 10 },
  err:           { fontFamily: fonts.sansSb, fontSize: 13, color: colors.terraDeep, marginBottom: 12, lineHeight: 18 },
  legal:         { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted, lineHeight: 18, marginBottom: 16 },
  legalLink:     { fontFamily: fonts.sansBd, color: colors.terra },
  signInLink:    { fontFamily: fonts.sans, fontSize: 14, color: colors.muted },
  tooYoungTitle: { fontFamily: fonts.serif, fontSize: 26, color: colors.forest, marginTop: 16 },
  tooYoungBody:  { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 21, marginTop: 10, marginBottom: 24 },
});
