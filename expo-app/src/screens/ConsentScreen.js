import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { ShelfMark, Btn } from '../components';
import { colors, fonts, spacing } from '../theme';

function ConsentRow({ title, desc, value, onChange, locked }) {
  return (
    <View style={s.row}>
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{title}{locked && <Text style={s.lockedNote}> · always on</Text>}</Text>
        <Text style={s.rowDesc}>{desc}</Text>
      </View>
      <Switch value={value} onValueChange={locked ? undefined : onChange}
        disabled={locked}
        trackColor={{ false: colors.line, true: colors.moss }}
        thumbColor="#fff"
        style={{ opacity: locked ? 0.5 : 1 }}/>
    </View>
  );
}

export default function ConsentScreen({ navigation }) {
  const { saveConsent } = useAuth();
  const [manage, setManage]       = useState(false);
  const [location, setLocation]   = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [personalise, setPersonalise] = useState(false);

  async function finish(all) {
    await saveConsent({
      location,
      analytics: all ? true  : analytics,
      personalise: all ? true : personalise,
    });
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.paper }}
      contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <ShelfMark size={40}/>
      <Text style={s.title}>
        Your data, <Text style={{ fontFamily: fonts.serifI, color: colors.terra }}>your choice</Text>
      </Text>
      <Text style={s.body}>
        We use only what we need to connect you with readers nearby. Choose what you're comfortable with — changeable anytime in Privacy &amp; data.
      </Text>

      <View style={s.toggles}>
        <ConsentRow locked value title="Essential"
          desc="Account, listings, messaging, payments and security. Required to run the app."/>
        <ConsentRow title="Show readers near me" value={location} onChange={setLocation}
          desc="Use your neighbourhood (district only — never exact address) to show nearby books."/>
        {manage && (
          <>
            <ConsentRow title="Personalised recommendations" value={personalise} onChange={setPersonalise}
              desc="Suggest books based on what you read and rate."/>
            <ConsentRow title="Usage analytics" value={analytics} onChange={setAnalytics}
              desc="Help us improve the app with anonymised usage data."/>
          </>
        )}
      </View>

      <Text style={s.legal}>
        By continuing you agree to our{' '}
        <Text style={s.legalLink} onPress={() => navigation.navigate('Legal', { doc: 'terms' })}>Terms</Text>
        {' '}and{' '}
        <Text style={s.legalLink} onPress={() => navigation.navigate('Legal', { doc: 'privacy' })}>Privacy Policy</Text>.
        {' '}You confirm you are 16+.
      </Text>

      <View style={s.buttons}>
        <Btn label={manage ? 'Save choices & continue' : 'Accept all & continue'} kind="primary" full onPress={() => finish(!manage)}/>
        <Btn label="Essential only" kind="soft" full onPress={() => finish(false)}/>
        {!manage && (
          <TouchableOpacity onPress={() => setManage(true)} style={s.manageBtn}>
            <Text style={s.manageBtnLabel}>Manage choices</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll:      { padding: 22, paddingTop: 64, paddingBottom: 40 },
  title:       { fontFamily: fonts.serif, fontSize: 27, color: colors.forest, marginTop: 16, lineHeight: 30 },
  body:        { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, lineHeight: 21, marginTop: 10 },
  toggles:     { marginTop: 18 },
  row:         { flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  rowTitle:    { fontFamily: fonts.sansBd, fontSize: 14.5, color: colors.ink },
  rowDesc:     { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted, marginTop: 3, lineHeight: 17 },
  lockedNote:  { fontFamily: fonts.sansSb, fontSize: 11, color: colors.muted },
  legal:       { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted, lineHeight: 18, marginTop: 16, marginBottom: 20 },
  legalLink:   { fontFamily: fonts.sansBd, color: colors.terra },
  buttons:     { gap: 10 },
  manageBtn:   { alignItems: 'center', paddingVertical: 8 },
  manageBtnLabel: { fontFamily: fonts.sansBd, fontSize: 13.5, color: colors.forest },
});
