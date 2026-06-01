import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThreads } from '../hooks/useMessages';
import { useAuth } from '../hooks/useAuth';
import { colors, fonts, spacing, shadow } from '../theme';

export default function MessagesScreen({ navigation }) {
  const { userId } = useAuth();
  const { threads, loading } = useThreads(userId);

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Messages</Text>
      </View>
      <FlatList
        data={threads}
        keyExtractor={t => t.id}
        contentContainerStyle={s.list}
        renderItem={({ item: t }) => {
          const u    = t.with_user || {};
          const msgs = t.messages || [];
          const last = msgs[msgs.length - 1];
          const isMe = last?.sender_id === userId || last?.sender_id === 'me';
          return (
            <TouchableOpacity onPress={() => navigation.navigate('Thread', { thread: t })}
              activeOpacity={0.82} style={s.row}>
              <View style={s.avatarWrap}>
                {u.photo_url
                  ? <Image source={{ uri: u.photo_url }} style={s.avatar}/>
                  : <View style={[s.avatar, { backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' }]}>
                      <Text style={{ fontSize: 26 }}>👤</Text>
                    </View>}
                {t.unread > 0 && (
                  <View style={s.badge}>
                    <Text style={s.badgeText}>{t.unread}</Text>
                  </View>
                )}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={s.rowTop}>
                  <Text style={s.name}>{u.name}</Text>
                  <Text style={s.time}>{last?.created_at || ''}</Text>
                </View>
                <Text style={s.bookName} numberOfLines={1}>{t.book?.title}</Text>
                <Text style={s.preview} numberOfLines={1}>
                  {isMe ? 'You: ' : ''}{last?.content || ''}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          !loading && <Text style={s.empty}>No messages yet. Request a book to start chatting!</Text>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: colors.paper },
  header:    { paddingHorizontal: spacing.md, paddingTop: 8, paddingBottom: 12 },
  title:     { fontFamily: fonts.serif, fontSize: 27, color: colors.forest },
  list:      { paddingVertical: 4, paddingBottom: 120 },
  row:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 16 },
  avatarWrap:{ position: 'relative' },
  avatar:    { width: 50, height: 50, borderRadius: 15 },
  badge:     { position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.terra, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.paper },
  badgeText: { fontFamily: fonts.sansEb, fontSize: 10, color: '#fff' },
  rowTop:    { flexDirection: 'row', justifyContent: 'space-between' },
  name:      { fontFamily: fonts.sansBd, fontSize: 15, color: colors.ink },
  time:      { fontFamily: fonts.sans, fontSize: 11.5, color: colors.muted },
  bookName:  { fontFamily: fonts.sansSb, fontSize: 12, color: colors.moss, marginTop: 2 },
  preview:   { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginTop: 1 },
  empty:     { textAlign: 'center', color: colors.muted, fontSize: 14, padding: 40 },
});
