import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  ActivityIndicator, Pressable,
} from 'react-native';
import { colors, fonts, radius, shadow, spacing } from '../theme';

// ── ShelfMark ─────────────────────────────────────────────────────────
export function ShelfMark({ size = 32 }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Math.round(size * 0.28) }}>
      <View style={{ width: size, height: size * 0.75, position: 'relative' }}>
        {/* Simplified inline mark using colored views */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: '100%', gap: 2 }}>
          <View style={{ width: 5, height: '80%', backgroundColor: colors.terra, borderRadius: 2 }}/>
          <View style={{ width: 6, height: '100%', backgroundColor: colors.gold, borderRadius: 2 }}/>
          <View style={{ width: 5, height: '68%', backgroundColor: colors.clay, borderRadius: 2 }}/>
          <View style={{ width: 6, height: '88%', backgroundColor: colors.terra, borderRadius: 2, transform: [{ rotate: '-5deg' }] }}/>
          <View style={{ width: 5, height: '76%', backgroundColor: colors.moss, borderRadius: 2 }}/>
        </View>
      </View>
      <Text style={{ fontFamily: fonts.serifI, fontSize: size * 0.64, color: colors.terra }}>My{' '}
        <Text style={{ fontFamily: fonts.serif, color: colors.ink }}>Bookshelf</Text>
      </Text>
    </View>
  );
}

// ── Stars ─────────────────────────────────────────────────────────────
export function Stars({ value = 0, size = 14 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Text key={i} style={{ fontSize: size, color: i <= value ? colors.gold : colors.line }}>★</Text>
      ))}
    </View>
  );
}

// ── StarPicker ────────────────────────────────────────────────────────
export function StarPicker({ value, onChange }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[1,2,3,4,5].map(i => (
        <TouchableOpacity key={i} onPress={() => onChange(i)} activeOpacity={0.7}>
          <Text style={{ fontSize: 34, color: i <= value ? colors.gold : colors.line }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Cover ─────────────────────────────────────────────────────────────
const COVER_COLORS = [colors.terra, colors.moss, '#3a5870', '#9a6b2f', '#6b3a52', colors.forest, '#7a4c38'];

export function Cover({ isbn, title, author, width = 100, radius: r = 10 }) {
  const [err, setErr] = useState(false);
  const url = isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : null;
  const idx = (isbn || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % COVER_COLORS.length;
  const bg  = COVER_COLORS[idx];
  const h   = Math.round(width * 1.5);

  if (!url || err) {
    return (
      <View style={[styles.coverFallback, { width, height: h, borderRadius: r, backgroundColor: bg }, shadow.cover]}>
        <Text style={styles.coverTitle} numberOfLines={4}>{title}</Text>
        <Text style={styles.coverAuthor} numberOfLines={1}>{author}</Text>
      </View>
    );
  }
  return (
    <Image source={{ uri: url }} style={[{ width, height: h, borderRadius: r }, shadow.cover]}
      onError={() => setErr(true)} resizeMode="cover"/>
  );
}

// ── PriceTag ──────────────────────────────────────────────────────────
export function PriceTag({ price, isFree, size = 'md' }) {
  const lg = size === 'lg';
  if (isFree) return <Text style={[styles.priceFree, lg && { fontSize: 22 }]}>Free</Text>;
  return <Text style={[styles.price, lg && { fontSize: 28 }]}>€{price}</Text>;
}

// ── ConditionBadge ────────────────────────────────────────────────────
const CONDITION_STYLES = {
  'As New':    { bg: 'rgba(77,107,80,0.12)',  color: colors.moss },
  'Used':      { bg: 'rgba(47,74,54,0.09)',   color: colors.forest },
  'Quite Old': { bg: 'rgba(168,71,43,0.10)',  color: colors.terraDeep },
};

export function ConditionBadge({ condition }) {
  const s = CONDITION_STYLES[condition] || CONDITION_STYLES['Used'];
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }]}>
      <Text style={[styles.badgeText, { color: s.color }]}>{condition}</Text>
    </View>
  );
}

// ── Btn ───────────────────────────────────────────────────────────────
const BTN_STYLES = {
  primary: { bg: colors.terra,  fg: '#fff',        extra: shadow.cta },
  forest:  { bg: colors.forest, fg: colors.cream,  extra: {} },
  ghost:   { bg: 'transparent', fg: colors.forest, extra: { borderWidth: 1.5, borderColor: colors.line } },
  soft:    { bg: colors.cream,  fg: colors.forest, extra: {} },
  danger:  { bg: colors.terraDeep, fg: '#fff',     extra: {} },
};

export function Btn({ label, kind = 'primary', onPress, full, icon, loading: busy, disabled }) {
  const s = BTN_STYLES[kind] || BTN_STYLES.primary;
  return (
    <TouchableOpacity
      onPress={disabled || busy ? undefined : onPress}
      activeOpacity={0.82}
      style={[styles.btn, s.extra, full && { width: '100%' },
        { backgroundColor: s.bg, opacity: (disabled || busy) ? 0.55 : 1 }]}>
      {busy
        ? <ActivityIndicator color={s.fg} size="small"/>
        : <>
            {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
            <Text style={[styles.btnLabel, { color: s.fg }]}>{label}</Text>
          </>
      }
    </TouchableOpacity>
  );
}

// ── Eyebrow ───────────────────────────────────────────────────────────
export function Eyebrow({ children, style: extra, light }) {
  return (
    <Text style={[styles.eyebrow, light && { color: 'rgba(241,232,214,0.65)' }, extra]}>
      {children}
    </Text>
  );
}

// ── TopBar ────────────────────────────────────────────────────────────
export function TopBar({ title, onBack, dark, right }) {
  const fg = dark ? '#fff' : colors.ink;
  const btnBg = dark ? 'rgba(255,255,255,0.12)' : colors.card;
  return (
    <View style={styles.topBar}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={[styles.topBtn, { backgroundColor: btnBg }]} activeOpacity={0.7}>
          <Text style={{ color: dark ? '#fff' : colors.forest, fontSize: 18, marginLeft: -2 }}>‹</Text>
        </TouchableOpacity>
      ) : <View style={{ width: 38 }}/>}
      <Text style={[styles.topTitle, { color: fg }]} numberOfLines={1}>{title}</Text>
      <View style={{ width: 38 }}>{right}</View>
    </View>
  );
}

// ── LocationButton ────────────────────────────────────────────────────
import * as Location from 'expo-location';

export function LocationButton({ onResult, onError }) {
  const [status, setStatus] = useState('idle');

  async function detect() {
    setStatus('loading');
    const { status: perm } = await Location.requestForegroundPermissionsAsync();
    if (perm !== 'granted') {
      setStatus('error');
      onError('Location permission denied. Please enter your neighbourhood manually.');
      return;
    }
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [place] = await Location.reverseGeocodeAsync(loc.coords);
      setStatus('done');
      onResult({
        district: place.district || place.subregion || place.neighborhood || '',
        city: place.city || place.region || '',
      });
    } catch {
      setStatus('error');
      onError('Could not detect location. Please enter it manually.');
    }
  }

  const label = { idle: 'Use my location', loading: 'Detecting…', done: '✓ Location detected', error: 'Try again' };
  const bg = status === 'done' ? 'rgba(77,107,80,0.10)' : colors.cream;
  const fg = status === 'done' ? colors.moss : colors.forest;

  return (
    <TouchableOpacity onPress={status === 'loading' ? undefined : detect}
      activeOpacity={0.78} style={[styles.locationBtn, { backgroundColor: bg }]}>
      <Text style={{ fontSize: 15, marginRight: 4 }}>📍</Text>
      <Text style={{ fontFamily: fonts.sansBd, fontSize: 14, color: fg }}>{label[status]}</Text>
    </TouchableOpacity>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  coverFallback: { alignItems: 'center', justifyContent: 'center', padding: 8 },
  coverTitle:    { fontFamily: fonts.serif, fontSize: 12, color: '#fff', textAlign: 'center', lineHeight: 16 },
  coverAuthor:   { fontSize: 9, color: 'rgba(255,255,255,0.7)', marginTop: 4, textAlign: 'center' },
  priceFree:     { fontFamily: fonts.sansEb, fontSize: 13.5, color: colors.moss },
  price:         { fontFamily: fonts.serif,  fontSize: 15, color: colors.terra },
  badge:         { paddingHorizontal: 11, paddingVertical: 4, borderRadius: radius.pill },
  badgeText:     { fontFamily: fonts.sansBd, fontSize: 12 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, paddingHorizontal: 22, borderRadius: radius.sm,
  },
  btnLabel: { fontFamily: fonts.sansBd, fontSize: 15.5 },
  eyebrow: {
    fontFamily: fonts.sansBd, fontSize: 11, letterSpacing: 1.4,
    textTransform: 'uppercase', color: colors.sage,
  },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingTop: 56, paddingBottom: 10,
    gap: 10, backgroundColor: 'transparent',
  },
  topBtn: {
    width: 38, height: 38, borderRadius: radius.xs,
    alignItems: 'center', justifyContent: 'center',
    ...shadow.card,
  },
  topTitle: { flex: 1, fontFamily: fonts.sansBd, fontSize: 17 },
  locationBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 11, borderRadius: radius.xs,
    borderWidth: 1, borderColor: colors.line, marginBottom: 14,
  },
});
