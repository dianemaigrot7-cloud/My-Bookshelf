import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { MOCK_NEIGHBOURS } from '../data/mock';
import { TopBar, Btn } from '../components';
import { colors, fonts, shadow, spacing } from '../theme';

const { width: W } = Dimensions.get('window');
const MAP_H = 340;

export default function NeighboursScreen({ navigation }) {
  const [selected, setSelected] = useState(null);
  const sel = MOCK_NEIGHBOURS.find(n => n.id === selected);

  return (
    <View style={s.screen}>
      <TopBar title="Neighbours" onBack={() => navigation.goBack()}/>

      {/* Faux map */}
      <View style={s.map}>
        {/* Street grid (SVG-equivalent using views) */}
        <View style={[s.street, { top: 90, left: 0, right: 0, height: 8 }]}/>
        <View style={[s.street, { top: 190, left: 0, right: 0, height: 8 }]}/>
        <View style={[s.street, { top: 280, left: 0, right: 0, height: 8 }]}/>
        <View style={[s.street, { left: 70, top: 0, bottom: 0, width: 8 }]}/>
        <View style={[s.street, { left: 160, top: 0, bottom: 0, width: 8 }]}/>
        <View style={[s.street, { left: 230, top: 0, bottom: 0, width: 8 }]}/>
        {/* River */}
        <View style={s.river}/>
        {/* Parks */}
        <View style={[s.park, { top: 130, left: 100, width: 44, height: 44 }]}/>
        <View style={[s.park, { top: 300, left: 200, width: 52, height: 52 }]}/>

        {/* User pins */}
        {MOCK_NEIGHBOURS.map(n => {
          const on = selected === n.id;
          const left = (n.x * (W - 36)) - 21;
          const top  = (n.y * MAP_H) - (on ? 56 : 46);
          return (
            <TouchableOpacity key={n.id} onPress={() => setSelected(n.id)}
              style={[s.pin, { left, top, zIndex: on ? 5 : 1 }]} activeOpacity={0.85}>
              <View style={[s.pinCircle, on && s.pinCircleOn,
                { width: on ? 52 : 42, height: on ? 52 : 42 }]}>
                {n.photo_url
                  ? <Image source={{ uri: n.photo_url }} style={{ width: '100%', height: '100%' }}/>
                  : <Text style={{ fontSize: on ? 28 : 24 }}>👤</Text>}
              </View>
              <View style={[s.pinTip, on && s.pinTipOn]}/>
            </TouchableOpacity>
          );
        })}

        {/* Count badge */}
        <View style={s.countBadge}>
          <Text style={s.countText}>{MOCK_NEIGHBOURS.length} readers nearby</Text>
        </View>
      </View>

      {/* Selected user card */}
      <View style={{ padding: spacing.md }}>
        {sel ? (
          <View style={[s.card, shadow.card]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={s.cardAvatar}>
                {sel.photo_url
                  ? <Image source={{ uri: sel.photo_url }} style={{ width: '100%', height: '100%' }}/>
                  : <Text style={{ fontSize: 32 }}>👤</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardName}>{sel.name}</Text>
                <Text style={s.cardSub}>{sel.district} · {sel.book_count} books to share</Text>
              </View>
            </View>
            <Text style={s.cardBio}>{sel.bio}</Text>
            <Btn label={`Browse ${sel.name.split(' ')[0]}'s shelf`} kind="forest" full
              onPress={() => navigation.navigate('Profile', { userId: sel.id })}/>
          </View>
        ) : (
          <Text style={s.hint}>Tap a neighbour to peek at their shelf.</Text>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: colors.paper },
  map:         { margin: 18, marginTop: 4, height: MAP_H, borderRadius: 20, overflow: 'hidden', backgroundColor: '#e8e3cf', borderWidth: 1, borderColor: colors.line, position: 'relative' },
  street:      { position: 'absolute', backgroundColor: 'rgba(47,74,54,0.10)' },
  river:       { position: 'absolute', top: 230, left: -10, right: -10, height: 18, backgroundColor: 'rgba(90,140,180,0.30)', borderRadius: 99 },
  park:        { position: 'absolute', borderRadius: 99, backgroundColor: 'rgba(77,107,80,0.18)' },
  pin:         { position: 'absolute' },
  pinCircle:   { borderRadius: 99, overflow: 'hidden', borderWidth: 3, borderColor: '#fff', ...shadow.cover },
  pinCircleOn: { borderColor: colors.terra },
  pinTip:      { width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#fff', alignSelf: 'center', marginTop: -1 },
  pinTipOn:    { borderTopColor: colors.terra },
  countBadge:  { position: 'absolute', left: 12, bottom: 12, backgroundColor: 'rgba(251,246,234,0.9)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  countText:   { fontFamily: fonts.sansSb, fontSize: 11.5, color: colors.muted },
  card:        { backgroundColor: colors.card, borderRadius: 18, padding: 16, gap: 12 },
  cardAvatar:  { width: 52, height: 52, borderRadius: 14, backgroundColor: colors.cream, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  cardName:    { fontFamily: fonts.serif, fontSize: 18, color: colors.ink },
  cardSub:     { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted },
  cardBio:     { fontFamily: fonts.sans, fontSize: 13.5, color: colors.ink, opacity: 0.8, lineHeight: 20 },
  hint:        { fontFamily: fonts.sans, fontSize: 13.5, color: colors.muted, textAlign: 'center', paddingVertical: 8 },
});
