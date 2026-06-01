import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShelfMark, Btn, TopBar } from '../components';
import { colors, fonts, radius, shadow, spacing } from '../theme';

const FEATURES = [
  'Unlimited listings & swaps',
  'Full book passports & journeys',
  'Message every neighbour',
  'Map of readers near you',
];

export default function PaywallScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[colors.forest, '#26392c']} style={{ flex: 1 }}>
        <TopBar onBack={() => navigation.goBack()} dark/>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <ShelfMark size={56}/>
          <Text style={s.headline}>
            Keep your shelf{'\n'}
            <Text style={{ fontFamily: fonts.serifI, color: colors.clay }}>open</Text>
          </Text>
          <Text style={s.body}>
            Your 3-month trial has ended. Continue sharing, swapping, and following your books across the world.
          </Text>

          {/* Price card */}
          <View style={s.card}>
            <View style={s.priceRow}>
              <Text style={s.priceMain}>€29</Text>
              <Text style={s.priceSub}>/ year</Text>
            </View>
            <Text style={s.monthly}>That's €2.42 a month</Text>

            <View style={s.features}>
              {FEATURES.map(f => (
                <View key={f} style={s.featureRow}>
                  <View style={s.check}><Text style={{ color: '#fff', fontSize: 11 }}>✓</Text></View>
                  <Text style={s.featureText}>{f}</Text>
                </View>
              ))}
            </View>

            <Btn label="Continue with Stripe" kind="primary" full onPress={() => navigation.goBack()}/>
            <Text style={s.disclaimer}>Cancel anytime · secure payment</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const s = StyleSheet.create({
  scroll:      { padding: 24, alignItems: 'center', paddingBottom: 40 },
  headline:    { fontFamily: fonts.serif, fontSize: 30, color: colors.cream, marginTop: 18, lineHeight: 36, textAlign: 'center' },
  body:        { fontFamily: fonts.sans, fontSize: 14.5, color: 'rgba(241,232,214,0.8)', marginTop: 10, lineHeight: 22, maxWidth: 300, textAlign: 'center' },
  card:        { width: '100%', backgroundColor: colors.card, borderRadius: 22, padding: 22, marginTop: 26, ...shadow.tab },
  priceRow:    { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 6 },
  priceMain:   { fontFamily: fonts.serif, fontSize: 44, color: colors.forest },
  priceSub:    { fontFamily: fonts.sansSb, fontSize: 15, color: colors.muted },
  monthly:     { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted, textAlign: 'center', marginTop: 2, marginBottom: 18 },
  features:    { gap: 11, marginBottom: 22 },
  featureRow:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  check:       { width: 20, height: 20, borderRadius: 99, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
  featureText: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.ink, flex: 1 },
  disclaimer:  { fontFamily: fonts.sans, fontSize: 11, color: colors.muted, textAlign: 'center', marginTop: 12 },
});
