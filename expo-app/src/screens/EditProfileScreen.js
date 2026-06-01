import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { TopBar, Btn, Eyebrow, LocationButton } from '../components';
import { colors, fonts, spacing } from '../theme';

export default function EditProfileScreen({ navigation }) {
  const { profile, saveProfile } = useAuth();
  const [name, setName]         = useState(profile?.name || '');
  const [bio, setBio]           = useState(profile?.bio || '');
  const [district, setDistrict] = useState(profile?.district || '');
  const [city, setCity]         = useState(profile?.city || '');
  const [geoNote, setGeoNote]   = useState('');
  const [busy, setBusy]         = useState(false);

  async function save() {
    setBusy(true);
    await saveProfile({ name, bio, district, city });
    setBusy(false);
    navigation.goBack();
  }

  const Field = ({ label, value, onChange, multiline, hint }) => (
    <View style={{ marginBottom: 18 }}>
      <Eyebrow>{label}</Eyebrow>
      {hint && <Text style={s.hint}>{hint}</Text>}
      <TextInput value={value} onChangeText={onChange}
        multiline={multiline} numberOfLines={multiline ? 3 : 1}
        placeholderTextColor={colors.sage}
        style={[s.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}/>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <TopBar title="Edit profile" onBack={() => navigation.goBack()}
        right={
          <Text style={s.saveBtn} onPress={save}>Save</Text>
        }
      />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Field label="Display name" value={name} onChange={setName}/>
        <Field label="Bio" value={bio} onChange={setBio} multiline/>

        <View style={{ marginBottom: 18 }}>
          <Eyebrow>Neighbourhood / district</Eyebrow>
          <Text style={s.hint}>Only your district is shown — never your exact address.</Text>
          <LocationButton
            onResult={({ district: d, city: c }) => {
              if (d) setDistrict(d);
              if (c) setCity(c);
              setGeoNote(`Detected: ${d}, ${c}`);
            }}
            onError={() => {}}
          />
          {geoNote ? <Text style={s.geoNote}>{geoNote}</Text> : null}
          <TextInput value={district} onChangeText={setDistrict}
            placeholderTextColor={colors.sage} style={s.input}/>
        </View>

        <Field label="City" value={city} onChange={setCity}/>
        <Btn label="Save changes" kind="primary" full loading={busy} onPress={save}/>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  scroll:   { padding: spacing.md, paddingBottom: 60 },
  saveBtn:  { fontFamily: fonts.sansBd, fontSize: 15.5, color: colors.terra, padding: 6 },
  hint:     { fontFamily: fonts.sans, fontSize: 11.5, color: colors.muted, marginTop: 3, marginBottom: 8, lineHeight: 16 },
  input:    { fontFamily: fonts.sans, fontSize: 15, color: colors.ink, backgroundColor: colors.card, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1, borderColor: colors.line, marginTop: 8 },
  geoNote:  { fontFamily: fonts.sansSb, fontSize: 12, color: colors.moss, marginBottom: 10 },
});
