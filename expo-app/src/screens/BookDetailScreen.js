import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useBook } from '../hooks/useBooks';
import { TopBar, Cover, PriceTag, ConditionBadge, Stars, Btn, Eyebrow } from '../components';
import { colors, fonts, radius, shadow, spacing } from '../theme';

export default function BookDetailScreen({ route, navigation }) {
  const { bookId, book: initial } = route.params;
  const { book: fetched } = useBook(bookId);
  const book = fetched || initial;
  const [requested, setRequested] = useState(false);

  if (!book) return <View style={{ flex: 1, backgroundColor: colors.paper }}/>;

  const seller  = book.current_owner || {};
  const journey = book.ownership || [];
  const owners  = journey.length;
  const countries = new Set(journey.map(p => p.country)).size;

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      {/* Cream hero band */}
      <View style={[StyleSheet.absoluteFill, { height: 320, backgroundColor: colors.cream }]}/>

      <TopBar onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity style={s.heartBtn} activeOpacity={0.75}>
            <Text style={{ fontSize: 18, color: colors.terra }}>♡</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Cover + title */}
        <View style={s.hero}>
          <Cover isbn={book.isbn} title={book.title} author={book.author} width={150} radius={12}/>
          <Text style={s.title}>{book.title}</Text>
          <Text style={s.author}>{book.author}</Text>
          <View style={s.badgeRow}>
            <ConditionBadge condition={book.condition}/>
            <View style={s.dot}/>
            <Text style={s.genre}>{book.genre}</Text>
          </View>
        </View>

        {/* Price + Passport row */}
        <View style={s.cards}>
          <View style={[s.priceCard, shadow.card]}>
            <Text style={s.cardLabel}>PRICE</Text>
            <View style={{ marginTop: 4 }}>
              <PriceTag price={book.price} isFree={book.is_free} size="lg"/>
            </View>
          </View>
          <TouchableOpacity style={[s.passportCard, shadow.card]} activeOpacity={0.82}
            onPress={() => navigation.navigate('Passport', { bookId: book.id, book })}>
            <Text style={s.cardLabelLight}>PASSPORT</Text>
            <Text style={s.passportMeta}>{owners} owners · {countries} {countries === 1 ? 'country' : 'countries'}</Text>
            <Text style={{ fontSize: 28, position: 'absolute', right: 10, bottom: 8, opacity: 0.2 }}>🌍</Text>
          </TouchableOpacity>
        </View>

        {/* Seller note */}
        <View style={s.section}>
          <Eyebrow>{seller.name?.split(' ')[0] || 'Seller'}'s note</Eyebrow>
          <View style={s.sellerRow}>
            {seller.photo_url
              ? <View style={s.avatar}><Text style={{ fontSize: 28 }}>👤</Text></View>
              : <View style={s.avatar}><Text style={{ fontSize: 28 }}>👤</Text></View>}
            <View>
              <Text style={s.sellerName}>{seller.name}</Text>
              <Stars value={book.rating || 4} size={13}/>
            </View>
          </View>
          <Text style={s.review}>"{book.review}"</Text>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={s.cta}>
        {!requested ? (
          <Btn label="Request this book" kind="primary" full onPress={() => setRequested(true)}/>
        ) : (
          <View style={s.requestedRow}>
            <View style={s.requestedBadge}>
              <Text style={s.requestedText}>✓ Request sent to {seller.name?.split(' ')[0]}</Text>
            </View>
            <Btn label="Message" kind="forest"
              onPress={() => navigation.navigate('Messages')}/>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  scroll:        { paddingBottom: 140 },
  hero:          { alignItems: 'center', paddingHorizontal: 24, paddingTop: 4 },
  title:         { fontFamily: fonts.serif, fontSize: 26, color: colors.ink, textAlign: 'center', marginTop: 18, lineHeight: 30 },
  author:        { fontFamily: fonts.sans, fontSize: 14.5, color: colors.muted, marginTop: 4 },
  badgeRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  dot:           { width: 4, height: 4, borderRadius: 99, backgroundColor: colors.line },
  genre:         { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
  heartBtn:      { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  cards:         { flexDirection: 'row', gap: 12, paddingHorizontal: spacing.md, marginTop: 20 },
  priceCard:     { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, padding: 14 },
  passportCard:  { flex: 1, backgroundColor: colors.forest, borderRadius: radius.md, padding: 14, overflow: 'hidden' },
  cardLabel:     { fontFamily: fonts.sansBd, fontSize: 11, color: colors.muted, letterSpacing: 0.3 },
  cardLabelLight:{ fontFamily: fonts.sansBd, fontSize: 11, color: 'rgba(241,232,214,0.7)', letterSpacing: 0.3 },
  passportMeta:  { fontFamily: fonts.sansBd, fontSize: 14, color: colors.cream, marginTop: 4 },
  section:       { paddingHorizontal: spacing.md, marginTop: 22 },
  sellerRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  avatar:        { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  sellerName:    { fontFamily: fonts.sansBd, fontSize: 14, color: colors.ink },
  review:        { fontFamily: fonts.serifI, fontSize: 17, lineHeight: 26, color: colors.ink, marginTop: 12, paddingLeft: 14, borderLeftWidth: 3, borderLeftColor: colors.clay, opacity: 0.88 },
  cta:           { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.md, paddingTop: 14, paddingBottom: 34, backgroundColor: colors.paper },
  requestedRow:  { flexDirection: 'row', gap: 10 },
  requestedBadge:{ flex: 1, backgroundColor: colors.cream, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  requestedText: { fontFamily: fonts.sansBd, fontSize: 14, color: colors.moss },
});
