import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { MOCK_USERS, MOCK_MY_BOOKS, MOCK_BOOKS } from '../data/mock';
import { Cover, PriceTag, Eyebrow, TopBar } from '../components';
import { colors, fonts, radius, shadow, spacing } from '../theme';

export default function ProfileScreen({ route, navigation }) {
  const { userId: viewingId } = route?.params || {};
  const { profile: me, signOut } = useAuth();
  const isMe = !viewingId || viewingId === 'me';
  const user = isMe ? me : (MOCK_USERS[viewingId] || MOCK_USERS.me);
  const shelf = isMe ? MOCK_MY_BOOKS : MOCK_BOOKS.filter(b => b.current_owner === viewingId);

  const trialDaysLeft = () => {
    if (!user?.trial_start_date) return 62;
    const start = new Date(user.trial_start_date);
    const end   = new Date(start.getTime() + 90 * 24 * 60 * 60 * 1000);
    return Math.max(0, Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24)));
  };

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      {!isMe && <TopBar onBack={() => navigation.goBack()} title=""/>}
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Avatar + info */}
        <View style={s.hero}>
          {user?.photo_url
            ? <Image source={{ uri: user.photo_url }} style={s.avatar}/>
            : <View style={[s.avatar, { backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ fontSize: 48 }}>👤</Text>
              </View>}
          <Text style={s.name}>{user?.name}</Text>
          <Text style={s.location}>📍 {user?.district}, {user?.city} {user?.country}</Text>
          <Text style={s.bio}>{user?.bio}</Text>
        </View>

        {/* My account cards */}
        {isMe && (
          <View style={s.cards}>
            <View style={s.trialCard}>
              <Text style={s.cardEye}>FREE TRIAL</Text>
              <Text style={s.cardVal}>{trialDaysLeft()} days left</Text>
            </View>
            <TouchableOpacity style={s.memberCard} activeOpacity={0.82}
              onPress={() => navigation.navigate('Paywall')}>
              <Text style={[s.cardEye, { color: 'rgba(241,232,214,0.7)' }]}>MEMBERSHIP</Text>
              <Text style={[s.cardVal, { color: colors.cream }]}>€29 / year →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Shelf */}
        <View style={s.section}>
          <Eyebrow>{isMe ? `On my shelf · ${shelf.length}` : `${user?.name?.split(' ')[0]}'s shelf · ${shelf.length}`}</Eyebrow>
          <View style={s.grid}>
            {shelf.map(b => (
              <TouchableOpacity key={b.id} style={s.gridItem} activeOpacity={0.82}
                onPress={() => navigation.navigate('BookDetail', { bookId: b.id, book: b })}>
                <Cover isbn={b.isbn} title={b.title} author={b.author} width="100%" radius={8}/>
                <View style={{ marginTop: 5, alignItems: 'center' }}>
                  <PriceTag price={b.price} isFree={b.is_free}/>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Legal + privacy */}
        {isMe && (
          <View style={s.section}>
            <Eyebrow>Privacy &amp; legal</Eyebrow>
            <View style={[s.legalList, shadow.card]}>
              {[
                ['Privacy & data', 'Manage consents and your GDPR rights', 'PrivacyData'],
                ['Terms & Conditions', null, 'Legal'],
                ['Privacy Policy', null, 'Privacy'],
              ].map(([title, desc, screen], i, arr) => (
                <TouchableOpacity key={title} style={[s.legalRow, i < arr.length - 1 && s.legalBorder]}
                  activeOpacity={0.75}
                  onPress={() => navigation.navigate(screen)}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.legalTitle}>{title}</Text>
                    {desc && <Text style={s.legalDesc}>{desc}</Text>}
                  </View>
                  <Text style={{ color: colors.sage }}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {isMe && (
          <View style={[s.section, { marginTop: 8 }]}>
            <TouchableOpacity onPress={signOut} style={s.signOutBtn}>
              <Text style={s.signOutLabel}>Sign out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Edit button */}
      {isMe && (
        <TouchableOpacity style={s.editFab} activeOpacity={0.82}
          onPress={() => navigation.navigate('EditProfile')}>
          <Text style={{ color: '#fff', fontFamily: fonts.sansBd, fontSize: 14 }}>✏ Edit</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: colors.paper },
  scroll:     { padding: spacing.md, paddingBottom: 100 },
  hero:       { alignItems: 'center', textAlign: 'center' },
  avatar:     { width: 92, height: 92, borderRadius: 28, overflow: 'hidden', ...shadow.cover },
  name:       { fontFamily: fonts.serif, fontSize: 25, color: colors.ink, marginTop: 14 },
  location:   { fontFamily: fonts.sansSb, fontSize: 13, color: colors.moss, marginTop: 4 },
  bio:        { fontFamily: fonts.sans, fontSize: 14, color: colors.ink, opacity: 0.8, marginTop: 12, lineHeight: 21, textAlign: 'center', maxWidth: 280 },
  cards:      { flexDirection: 'row', gap: 10, marginTop: 18 },
  trialCard:  { flex: 1, backgroundColor: 'rgba(216,164,65,0.14)', borderRadius: 14, padding: 12 },
  memberCard: { flex: 1, backgroundColor: colors.forest, borderRadius: 14, padding: 12 },
  cardEye:    { fontFamily: fonts.sansBd, fontSize: 11.5, color: colors.muted },
  cardVal:    { fontFamily: fonts.sansBd, fontSize: 14.5, color: colors.ink, marginTop: 2 },
  section:    { marginTop: 24 },
  grid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  gridItem:   { width: '30%' },
  legalList:  { backgroundColor: colors.card, borderRadius: 16, marginTop: 10, overflow: 'hidden' },
  legalRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, paddingHorizontal: 16 },
  legalBorder:{ borderBottomWidth: 1, borderBottomColor: colors.line },
  legalTitle: { fontFamily: fonts.sansBd, fontSize: 14.5, color: colors.ink },
  legalDesc:  { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginTop: 2 },
  signOutBtn: { padding: 14, alignItems: 'center', borderRadius: 14, borderWidth: 1.5, borderColor: colors.line },
  signOutLabel:{ fontFamily: fonts.sansBd, fontSize: 14, color: colors.muted },
  editFab:    { position: 'absolute', top: 60, right: 16, backgroundColor: colors.terra, borderRadius: 99, paddingHorizontal: 16, paddingVertical: 10, ...shadow.cta },
});
