import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMyBooks } from '../hooks/useBooks';
import { Cover, PriceTag, Btn } from '../components';
import { colors, fonts, radius, shadow, spacing } from '../theme';

export default function LibraryScreen({ navigation }) {
  const [tab, setTab] = useState('reading');
  const { published, reading, publish } = useMyBooks();

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>My Library</Text>
        <View style={s.segmented}>
          {[['reading','Reading now'],['shelf','My shelf']].map(([k, label]) => (
            <TouchableOpacity key={k} onPress={() => setTab(k)} activeOpacity={0.78}
              style={[s.seg, tab === k && s.segOn]}>
              <Text style={[s.segLabel, tab === k && s.segLabelOn]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'reading' ? (
          reading.length ? reading.map(b => (
            <View key={b.id} style={[s.readingCard, shadow.card]}>
              <TouchableOpacity onPress={() => navigation.navigate('BookDetail', { bookId: b.id, book: b })}>
                <Cover isbn={b.isbn} title={b.title} author={b.author} width={64} radius={8}/>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text style={s.readingBadge}>PRIVATELY READING</Text>
                <Text style={s.bookTitle} numberOfLines={2}>{b.title}</Text>
                <Text style={s.bookAuthor}>{b.author}</Text>
                <View style={{ marginTop: 'auto', paddingTop: 10 }}>
                  <Btn label="Finished — publish it" kind="primary" onPress={() => publish(b.id)}
                    style={{ paddingVertical: 10, paddingHorizontal: 16 }}/>
                </View>
              </View>
            </View>
          )) : <Text style={s.empty}>Nothing on your reading shelf yet.</Text>
        ) : (
          <View style={s.grid}>
            {published.map(b => (
              <TouchableOpacity key={b.id} style={{ flex: 1 }} activeOpacity={0.82}
                onPress={() => navigation.navigate('BookDetail', { bookId: b.id, book: b })}>
                <Cover isbn={b.isbn} title={b.title} author={b.author} width="100%" radius={10}/>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <PriceTag price={b.price} isFree={b.is_free}/>
                  <Text style={s.owners}>{b.ownership?.length || 1} owners</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: colors.paper },
  header:      { paddingHorizontal: spacing.md, paddingTop: 8, paddingBottom: 14 },
  title:       { fontFamily: fonts.serif, fontSize: 27, color: colors.forest },
  segmented:   { flexDirection: 'row', backgroundColor: colors.cream, borderRadius: 13, padding: 4, marginTop: 14 },
  seg:         { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 10 },
  segOn:       { backgroundColor: colors.card, ...shadow.card },
  segLabel:    { fontFamily: fonts.sansBd, fontSize: 13.5, color: colors.muted },
  segLabelOn:  { color: colors.forest },
  scroll:      { padding: spacing.md, paddingBottom: 120, gap: 14 },
  readingCard: { flexDirection: 'row', gap: 14, backgroundColor: colors.card, borderRadius: 16, padding: 14 },
  readingBadge:{ fontFamily: fonts.sansBd, fontSize: 11, color: colors.clay, letterSpacing: 0.3 },
  bookTitle:   { fontFamily: fonts.serif, fontSize: 17, color: colors.ink, marginTop: 2, lineHeight: 20 },
  bookAuthor:  { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted },
  grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  owners:      { fontFamily: fonts.sans, fontSize: 11, color: colors.sage },
  empty:       { textAlign: 'center', color: colors.muted, fontSize: 14, marginTop: 60 },
});
