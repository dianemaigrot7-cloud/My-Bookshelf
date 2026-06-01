import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { TopBar, Btn, Eyebrow } from '../components';
import { colors, fonts, spacing } from '../theme';

// ── Template legal content ────────────────────────────────────────────
const TERMS = [
  { h: '1. Who we are', p: 'These Terms govern your use of the My Bookshelf application operated by [Company Legal Name]. By creating an account you accept these Terms and our Privacy Policy.' },
  { h: '2. Eligibility', p: 'You must be at least 16 years old and able to form a binding contract.' },
  { h: '3. What My Bookshelf is — and is not', p: 'My Bookshelf is a platform for neighbours to discover, list, give away, sell and exchange second-hand books. We are an intermediary only — not a party to any transaction.' },
  { h: '4. Listings & prices', p: 'You are solely responsible for your listings. Book metadata from Open Library is provided "as is".' },
  { h: '5. In-person exchanges', p: 'All handovers happen in person. YOU ATTEND MEETINGS AT YOUR OWN RISK. Meet in public places and never share your exact address.' },
  { h: '6. Subscription & trial', p: 'New accounts receive a 3-month free trial. After the trial, continued access requires a subscription (€29/year). Statutory withdrawal rights are respected.' },
  { h: '7. Book Passport', p: 'Passport entries may remain visible after a book passes to a new owner. By submitting a review or note you grant us a licence to display it as part of the Passport.' },
  { h: '8. Limitation of liability', p: 'To the maximum extent permitted by law, we are not liable for indirect or consequential damages. Our total aggregate liability is capped at €50 or fees paid in the 12 months prior to the claim.' },
  { h: '9. Governing law', p: 'These Terms are governed by the laws of [jurisdiction]. EU consumers may use the European Commission\'s Online Dispute Resolution platform.' },
];

const PRIVACY = [
  { h: '1. Data controller', p: '[Company Legal Name], [registered address]. DPO contact: [dpo@yourcompany.com].' },
  { h: '2. Data we collect', p: 'Name, email (not shared), photo, bio, district/city (never exact address), listings, reviews, messages, payment status (via Stripe — no full card numbers stored).' },
  { h: '3. Legal bases (GDPR)', p: 'Contract — to run your account. Consent — for optional analytics and recommendations. Legitimate interests — security and service improvement. Legal obligation — accounting and law.' },
  { h: '4. Who we share it with', p: 'Other users see your public profile, district, listings and Passport entries. Processors (Stripe, hosting, Open Library) act on our instructions. We do not sell your data.' },
  { h: '5. Your rights', p: 'Access, rectify, erase, restrict, object, and port your data anytime via Profile → Privacy & data, or by contacting us. You may also lodge a complaint with your local supervisory authority.' },
  { h: '6. Retention', p: 'We delete or anonymise personal data when you close your account. Passport entries may be kept in anonymised form to preserve each book\'s history.' },
];

export default function LegalScreen({ route, navigation }) {
  const doc = route?.params?.doc || 'terms';
  const isTerms = doc === 'terms';
  const sections = isTerms ? TERMS : PRIVACY;
  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <TopBar title={isTerms ? 'Terms & Conditions' : 'Privacy Policy'} onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.updated}>Last updated 1 June 2026</Text>
        {/* Template disclaimer */}
        <View style={s.notice}>
          <Text style={s.noticeText}>⚠ Template — not legal advice. Must be reviewed by qualified counsel before launch.</Text>
        </View>
        {sections.map((sec, i) => (
          <View key={i} style={{ marginBottom: 18 }}>
            <Text style={s.sectionTitle}>{sec.h}</Text>
            <Text style={s.sectionBody}>{sec.p}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ── Privacy & Data Centre ─────────────────────────────────────────────
export function PrivacyDataScreen({ navigation }) {
  const { consent, saveConsent } = require('../hooks/useAuth').useAuth();
  const [toast, setToast]   = useState('');
  const [confirm, setConfirm] = useState(false);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2200); };

  const RightRow = ({ icon, title, desc, onPress, danger }) => (
    <TouchableOpacity onPress={onPress} style={s.right} activeOpacity={0.78}>
      <View style={[s.rightIcon, danger && { backgroundColor: 'rgba(168,71,43,0.10)' }]}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.rightTitle, danger && { color: colors.terraDeep }]}>{title}</Text>
        <Text style={s.rightDesc}>{desc}</Text>
      </View>
      <Text style={{ color: colors.sage }}>›</Text>
    </TouchableOpacity>
  );

  const Toggle = ({ title, desc, field }) => (
    <View style={s.row}>
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{title}</Text>
        <Text style={s.rowDesc}>{desc}</Text>
      </View>
      <View style={{ flexShrink: 0, pointerEvents: field ? 'auto' : 'none' }}>
        {/* Simple toggle for each consent field */}
        <TouchableOpacity onPress={field ? () => saveConsent({ [field]: !consent?.[field] }) : undefined}
          style={[s.toggle, consent?.[field] && s.toggleOn]}>
          <View style={[s.toggleThumb, consent?.[field] && s.toggleThumbOn]}/>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <TopBar title="Privacy & data" onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Eyebrow>Your consents</Eyebrow>
        <View style={[s.card, { padding: '2px 16px', marginTop: 10, marginBottom: 22 }]}>
          <Toggle title="Essential" desc="Required to run the app." field={null}/>
          <Toggle title="Show readers near me" desc="District only — never exact address." field="location"/>
          <Toggle title="Personalised recommendations" desc="Suggestions from what you read." field="personalise"/>
          <Toggle title="Usage analytics" desc="Anonymised data to improve the app." field="analytics"/>
        </View>

        <Eyebrow>Your rights under GDPR</Eyebrow>
        <View style={{ marginTop: 10, gap: 0 }}>
          <RightRow icon="📥" title="Download my data" desc="Get a portable copy of your account data."
            onPress={() => flash('We\'ll email your data export shortly.')}/>
          <RightRow icon="✏️" title="Correct my information" desc="Edit your profile and listings."
            onPress={() => navigation.navigate('EditProfile')}/>
          <RightRow icon="🚫" title="Restrict or object" desc="Limit how we process your data."
            onPress={() => flash('Request received — we\'ll be in touch.')}/>
          <RightRow icon="🗑️" title="Delete my account" desc="Erase your data ('right to be forgotten')."
            onPress={() => setConfirm(true)} danger/>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
          <Btn label="Terms" kind="ghost" full onPress={() => navigation.navigate('Legal', { doc: 'terms' })}/>
          <Btn label="Privacy Policy" kind="ghost" full onPress={() => navigation.navigate('Legal', { doc: 'privacy' })}/>
        </View>
        <Text style={s.authority}>You can lodge a complaint with your local data protection authority.</Text>
      </ScrollView>

      {toast ? (
        <View style={s.toast}><Text style={s.toastText}>{toast}</Text></View>
      ) : null}

      {confirm && (
        <View style={s.overlay}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Delete your account?</Text>
            <Text style={s.sheetBody}>This erases your profile, listings and messages. Passport entries you contributed are kept in anonymised form. This can't be undone.</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
              <Btn label="Keep account" kind="ghost" full onPress={() => setConfirm(false)}/>
              <Btn label="Delete" kind="danger" full onPress={() => { setConfirm(false); flash('Account deletion requested.'); }}/>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  scroll:      { padding: spacing.md, paddingBottom: 40 },
  updated:     { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginBottom: 14 },
  notice:      { backgroundColor: 'rgba(216,164,65,0.16)', borderRadius: 12, padding: 12, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(216,164,65,0.5)' },
  noticeText:  { fontFamily: fonts.sans, fontSize: 12, color: '#7a4a2c', lineHeight: 17 },
  sectionTitle:{ fontFamily: fonts.serif, fontSize: 17, color: colors.forest, marginBottom: 6, lineHeight: 21 },
  sectionBody: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.ink, opacity: 0.85, lineHeight: 21 },
  // privacy data
  card:        { backgroundColor: colors.card, borderRadius: 16 },
  row:         { flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  rowTitle:    { fontFamily: fonts.sansBd, fontSize: 14.5, color: colors.ink },
  rowDesc:     { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted, marginTop: 3, lineHeight: 17 },
  toggle:      { width: 46, height: 28, borderRadius: 99, backgroundColor: colors.line, justifyContent: 'center', position: 'relative' },
  toggleOn:    { backgroundColor: colors.moss },
  toggleThumb: { position: 'absolute', left: 3, width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  toggleThumbOn: { left: 21 },
  right:       { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, backgroundColor: colors.card, borderRadius: 14, marginBottom: 10 },
  rightIcon:   { width: 38, height: 38, borderRadius: 11, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' },
  rightTitle:  { fontFamily: fonts.sansBd, fontSize: 14.5, color: colors.ink },
  rightDesc:   { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginTop: 2, lineHeight: 16 },
  authority:   { fontFamily: fonts.sans, fontSize: 11.5, color: colors.muted, marginTop: 16, textAlign: 'center', lineHeight: 17 },
  toast:       { position: 'absolute', left: 18, right: 18, bottom: 30, backgroundColor: colors.forest, borderRadius: 14, padding: 14, alignItems: 'center' },
  toastText:   { fontFamily: fonts.sansSb, fontSize: 13.5, color: colors.cream },
  overlay:     { position: 'absolute', inset: 0, backgroundColor: 'rgba(43,42,38,0.55)', justifyContent: 'flex-end' },
  sheet:       { backgroundColor: colors.paper, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 24, paddingBottom: 34 },
  sheetTitle:  { fontFamily: fonts.serif, fontSize: 21, color: colors.ink },
  sheetBody:   { fontFamily: fonts.sans, fontSize: 13.5, color: colors.muted, lineHeight: 20, marginTop: 8 },
});

import { spacing } from '../theme';
