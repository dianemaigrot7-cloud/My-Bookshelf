import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useBook } from '../hooks/useBooks';
import { TopBar, Cover, Stars, Eyebrow } from '../components';
import { colors, fonts, radius, shadow, spacing } from '../theme';

function Stamp({ entry, index }) {
  const rots = [-7, 5, -3, 8, -5];
  const tints = ['#a8472b', '#4d6b50', '#3a5870', '#9a6b2f', '#6b3a52'];
  const rot  = rots[index % rots.length];
  const tint = tints[index % tints.length];
  return (
    <View style={[s.stamp, { borderColor: tint, transform: [{ rotate: `${rot}deg` }] }]}>
      <Text style={{ fontSize: 28, lineHeight: 32 }}>{entry.country}</Text>
      <Text style={[s.stampCity, { color: tint }]}>{entry.city.toUpperCase()}</Text>
      <Text style={[s.stampDate, { color: tint }]}>{entry.date_received || entry.date}</Text>
    </View>
  );
}

export default function PassportScreen({ route, navigation }) {
  const { bookId, book: initial } = route.params;
  const { book: fetched } = useBook(bookId);
  const book = fetched || initial;
  if (!book) return <View style={{ flex: 1, backgroundColor: colors.forest }}/>;

  const journey  = book.ownership || [];
  const owners   = journey.length;
  const countries= new Set(journey.map(p => p.country)).size;
  const avg      = owners ? (journey.reduce((s, p) => s + (p.rating || 0), 0) / owners).toFixed(1) : '—';

  return (
    <View style={{ flex: 1, backgroundColor: colors.forest }}>
      <TopBar title="Book Passport" onBack={() => navigation.goBack()} dark/>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Passport booklet */}
        <View style={s.booklet}>
          {/* Header */}
          <View style={s.bookletHeader}>
            <Cover isbn={book.isbn} title={book.title} author={book.author} width={60} radius={6}/>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={s.ppLabel}>BOOK PASSPORT</Text>
              <Text style={s.ppTitle}>{book.title}</Text>
              <Text style={s.ppAuthor}>{book.author}</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={s.statsRow}>
            {[['Owners', owners], ['Countries', countries], ['Avg ★', avg]].map(([k, v]) => (
              <View key={k} style={s.stat}>
                <Text style={s.statVal}>{v}</Text>
                <Text style={s.statKey}>{k}</Text>
              </View>
            ))}
          </View>

          {/* Stamps */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.stampsScroll}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 20 }}>
            {journey.map((e, i) => <Stamp key={i} entry={e} index={i}/>)}
          </ScrollView>
          <Text style={s.stampCaption}>
            {countries > 1 ? `Travelled across ${countries} countries` : 'Beginning its journey'} · scroll →
          </Text>
        </View>

        {/* Timeline */}
        <View style={s.timeline}>
          <Eyebrow light>The journey, in order</Eyebrow>
          <View style={{ marginTop: 16, position: 'relative' }}>
            <View style={s.timelineLine}/>
            {journey.map((e, i) => {
              const owner = e.owner || {};
              const last  = i === journey.length - 1;
              return (
                <View key={i} style={s.timelineRow}>
                  <View style={s.avatarWrap}>
                    <View style={[s.timelineAvatar, last && s.timelineAvatarNow]}>
                      <Text style={{ fontSize: 22 }}>👤</Text>
                    </View>
                    {last && <View style={s.nowBadge}><Text style={s.nowText}>NOW</Text></View>}
                  </View>
                  <View style={s.timelineCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={s.ownerName}>{owner.name || 'Reader'}</Text>
                      <Stars value={e.rating} size={12}/>
                    </View>
                    <Text style={s.ownerMeta}>{e.country} {e.city} · {e.date_received || e.date}</Text>
                    <Text style={s.ownerReview}>"{e.review_text || e.note}"</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  scroll:         { paddingBottom: 40 },
  booklet:        { margin: 16, borderRadius: 20, overflow: 'hidden', backgroundColor: '#f6efdd', ...shadow.tab },
  bookletHeader:  { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 16, backgroundColor: 'rgba(168,71,43,0.08)' },
  ppLabel:        { fontFamily: fonts.sansBd, fontSize: 10, letterSpacing: 2, color: colors.terraDeep },
  ppTitle:        { fontFamily: fonts.serif, fontSize: 20, color: colors.ink, lineHeight: 22, marginTop: 3 },
  ppAuthor:       { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted, marginTop: 2 },
  statsRow:       { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(47,74,54,0.18)', marginHorizontal: 16 },
  stat:           { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statVal:        { fontFamily: fonts.serif, fontSize: 26, color: colors.terraDeep, lineHeight: 28 },
  statKey:        { fontFamily: fonts.sansBd, fontSize: 10, letterSpacing: 0.5, color: colors.muted, textTransform: 'uppercase', marginTop: 4 },
  stampsScroll:   { flexGrow: 0 },
  stamp:          { width: 90, height: 90, borderRadius: 45, borderWidth: 2.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  stampCity:      { fontFamily: fonts.sansEb, fontSize: 10, letterSpacing: 0.5, marginTop: 2 },
  stampDate:      { fontFamily: fonts.sansBd, fontSize: 8.5, marginTop: 1, opacity: 0.8 },
  stampCaption:   { fontFamily: fonts.sans, fontSize: 11, color: colors.muted, textAlign: 'center', fontStyle: 'italic', paddingBottom: 16 },
  timeline:       { paddingHorizontal: 22, paddingTop: 24 },
  timelineLine:   { position: 'absolute', left: 19, top: 22, bottom: 18, width: 2, backgroundColor: 'rgba(241,232,214,0.2)' },
  timelineRow:    { flexDirection: 'row', gap: 14, marginBottom: 22 },
  avatarWrap:     { position: 'relative', flexShrink: 0 },
  timelineAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(241,232,214,0.15)', borderWidth: 2, borderColor: 'rgba(241,232,214,0.3)', alignItems: 'center', justifyContent: 'center' },
  timelineAvatarNow: { borderColor: colors.clay },
  nowBadge:       { position: 'absolute', right: -2, bottom: -2, backgroundColor: colors.clay, borderRadius: 99, paddingHorizontal: 4, paddingVertical: 1 },
  nowText:        { fontFamily: fonts.sansEb, fontSize: 7, color: '#fff' },
  timelineCard:   { flex: 1, backgroundColor: 'rgba(251,246,234,0.97)', borderRadius: 14, padding: 12 },
  ownerName:      { fontFamily: fonts.sansBd, fontSize: 14, color: colors.ink },
  ownerMeta:      { fontFamily: fonts.sans, fontSize: 11.5, color: colors.muted, marginTop: 2 },
  ownerReview:    { fontFamily: fonts.serifI, fontSize: 13, color: colors.ink, marginTop: 7, opacity: 0.82, lineHeight: 19 },
});
