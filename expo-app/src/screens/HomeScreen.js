import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNearbyBooks } from '../hooks/useBooks';
import { useAuth } from '../hooks/useAuth';
import { ShelfMark, Cover, PriceTag } from '../components';
import { colors, fonts, radius, shadow, spacing } from '../theme';

const FILTERS = ['Free', 'As New', 'Used', 'Quite Old'];

export default function HomeScreen({ navigation }) {
  const { profile } = useAuth();
  const { books, loading } = useNearbyBooks(profile?.district, profile?.city);
  const [query, setQuery]     = useState('');
  const [filters, setFilters] = useState([]);

  const toggle = (f) => setFilters(prev =>
    prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
  );

  const list = books.filter(b => {
    const text = `${b.title} ${b.author} ${b.genre || ''}`.toLowerCase();
    if (query && !text.includes(query.toLowerCase())) return false;
    if (filters.includes('Free') && !b.is_free) return false;
    const conds = filters.filter(f => f !== 'Free');
    if (conds.length && !conds.includes(b.condition)) return false;
    return true;
  });

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerRow}>
          <ShelfMark size={28}/>
          <TouchableOpacity onPress={() => navigation.navigate('Neighbours')}
            style={s.mapBtn} activeOpacity={0.75}>
            <Text style={{ fontSize: 18 }}>🗺</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.subtitle}>
          Books near you in{' '}
          <Text style={{ fontFamily: fonts.sansBd, color: colors.moss }}>
            {profile?.district || 'your area'}, {profile?.city || ''}
          </Text>
        </Text>
        {/* Search */}
        <View style={s.searchRow}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            value={query} onChangeText={setQuery}
            placeholder="Search title, author, genre"
            placeholderTextColor={colors.sage}
            style={s.searchInput}/>
        </View>
        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          {FILTERS.map(f => {
            const on = filters.includes(f);
            return (
              <TouchableOpacity key={f} onPress={() => toggle(f)} activeOpacity={0.78}
                style={[s.chip, on && s.chipOn]}>
                <Text style={[s.chipLabel, on && s.chipLabelOn]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Grid */}
      <FlatList
        data={list}
        keyExtractor={b => b.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 16 }}
        contentContainerStyle={s.grid}
        renderItem={({ item: b }) => (
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.82}
            onPress={() => navigation.navigate('BookDetail', { bookId: b.id, book: b })}>
            <Cover isbn={b.isbn} title={b.title} author={b.author} width="100%" radius={10}/>
            <Text style={s.bookTitle} numberOfLines={2}>{b.title}</Text>
            <Text style={s.bookAuthor}>{b.author}</Text>
            <View style={s.bookMeta}>
              <PriceTag price={b.price} isFree={b.is_free}/>
              <Text style={s.district}>📍 {b.current_owner?.district || ''}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && <Text style={s.empty}>No books match. Try fewer filters.</Text>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: colors.paper },
  header:     { paddingHorizontal: spacing.md, paddingTop: 8, paddingBottom: 12, backgroundColor: colors.paper },
  headerRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mapBtn:     { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  subtitle:   { fontFamily: fonts.sans, fontSize: 13.5, color: colors.muted, marginTop: 6, marginBottom: 12 },
  searchRow:  { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, gap: 10, ...shadow.card },
  searchIcon: { fontSize: 16 },
  searchInput:{ flex: 1, fontFamily: fonts.sans, fontSize: 15, color: colors.ink },
  chip:       { paddingHorizontal: 15, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, marginRight: 8 },
  chipOn:     { backgroundColor: colors.forest, borderColor: colors.forest },
  chipLabel:  { fontFamily: fonts.sansSb, fontSize: 13, color: colors.muted },
  chipLabelOn:{ color: colors.cream },
  grid:       { padding: spacing.md, paddingBottom: 120, gap: 22 },
  bookTitle:  { fontFamily: fonts.serif, fontSize: 15, color: colors.ink, marginTop: 8, lineHeight: 18 },
  bookAuthor: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginTop: 2 },
  bookMeta:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  district:   { fontFamily: fonts.sans, fontSize: 11, color: colors.sage },
  empty:      { textAlign: 'center', color: colors.muted, fontSize: 14, marginTop: 60 },
});
