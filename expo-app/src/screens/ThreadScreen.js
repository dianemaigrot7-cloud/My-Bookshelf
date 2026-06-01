import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { Cover, PriceTag, TopBar } from '../components';
import { colors, fonts, radius, shadow, spacing } from '../theme';

export default function ThreadScreen({ route, navigation }) {
  const { thread } = route.params;
  const { userId } = useAuth();
  const u   = thread.with_user || {};
  const book = thread.book || {};
  const [messages, setMessages] = useState(thread.messages || []);
  const [draft, setDraft]       = useState('');
  const [reqState, setReqState] = useState(thread.has_pending_request ? 'pending' : null);
  const listRef = useRef(null);

  function send() {
    if (!draft.trim()) return;
    const msg = { id: Date.now().toString(), sender_id: userId || 'me', content: draft.trim(), created_at: 'now' };
    setMessages(m => [...m, msg]);
    setDraft('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }

  const isMe = (msg) => msg.sender_id === (userId || 'me');

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={s.screen}>
        <TopBar onBack={() => navigation.goBack()} title={u.name}/>

        {/* Book context banner */}
        <TouchableOpacity style={s.bookBanner} activeOpacity={0.82}
          onPress={() => navigation.navigate('BookDetail', { bookId: book.id, book })}>
          <View style={{ width: 34 }}>
            <Cover isbn={book.isbn} title={book.title} author={book.author} width={34} radius={5}/>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.bannerTitle}>{book.title}</Text>
            <Text style={s.bannerMeta}>{book.is_free ? 'Free' : `€${book.price}`} · {book.condition}</Text>
          </View>
        </TouchableOpacity>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          contentContainerStyle={s.msgList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {reqState === 'pending' && (
                <View style={s.requestCard}>
                  <Text style={s.requestText}><Text style={{ fontFamily: fonts.sansBd }}>{u.name?.split(' ')[0]}</Text> requested this book.</Text>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                    <TouchableOpacity onPress={() => setReqState('declined')} style={s.declineBtn}>
                      <Text style={s.declineLabel}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setReqState('accepted')} style={s.acceptBtn}>
                      <Text style={s.acceptLabel}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {reqState === 'accepted' && (
                <View style={s.acceptedBanner}>
                  <Text style={s.acceptedText}>✓ Accepted — arrange your handover below</Text>
                </View>
              )}
            </>
          }
          renderItem={({ item: m }) => {
            const mine = isMe(m);
            return (
              <View style={[s.bubbleWrap, mine && s.bubbleWrapMe]}>
                <View style={[s.bubble, mine ? s.bubbleMe : s.bubbleThem]}>
                  <Text style={[s.bubbleText, mine && { color: '#fff' }]}>{m.content}</Text>
                </View>
                <Text style={[s.bubbleTime, mine && { textAlign: 'right' }]}>{m.created_at}</Text>
              </View>
            );
          }}
        />

        {/* Composer */}
        <View style={s.composer}>
          <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={send}
            placeholder="Message…" placeholderTextColor={colors.sage}
            style={s.input} returnKeyType="send"/>
          <TouchableOpacity onPress={send} style={s.sendBtn} activeOpacity={0.78}>
            <Text style={{ color: '#fff', fontSize: 18 }}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: colors.paper },
  bookBanner:   { flexDirection: 'row', gap: 12, alignItems: 'center', margin: 16, padding: 10, backgroundColor: colors.cream, borderRadius: 14 },
  bannerTitle:  { fontFamily: fonts.sansBd, fontSize: 13.5, color: colors.ink },
  bannerMeta:   { fontFamily: fonts.sans, fontSize: 11.5, color: colors.muted },
  msgList:      { padding: 16, gap: 10, paddingBottom: 20 },
  requestCard:  { backgroundColor: colors.card, borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 10, ...shadow.card },
  requestText:  { fontFamily: fonts.sans, fontSize: 13.5, color: colors.ink },
  declineBtn:   { flex: 1, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center' },
  declineLabel: { fontFamily: fonts.sansBd, fontSize: 14, color: colors.muted },
  acceptBtn:    { flex: 1, paddingVertical: 11, borderRadius: 12, backgroundColor: colors.forest, alignItems: 'center' },
  acceptLabel:  { fontFamily: fonts.sansBd, fontSize: 14, color: colors.cream },
  acceptedBanner: { backgroundColor: 'rgba(77,107,80,0.12)', borderRadius: 14, padding: 12, marginBottom: 10, alignItems: 'center' },
  acceptedText: { fontFamily: fonts.sansBd, fontSize: 13, color: colors.moss },
  bubbleWrap:   { alignSelf: 'flex-start', maxWidth: '76%' },
  bubbleWrapMe: { alignSelf: 'flex-end' },
  bubble:       { padding: 10, paddingHorizontal: 14, borderRadius: 16 },
  bubbleMe:     { backgroundColor: colors.terra, borderBottomRightRadius: 4 },
  bubbleThem:   { backgroundColor: colors.card, borderBottomLeftRadius: 4, ...shadow.card },
  bubbleText:   { fontFamily: fonts.sans, fontSize: 14, color: colors.ink, lineHeight: 20 },
  bubbleTime:   { fontFamily: fonts.sans, fontSize: 10.5, color: colors.muted, marginTop: 3 },
  composer:     { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, paddingHorizontal: 14, paddingBottom: 34, backgroundColor: colors.paper },
  input:        { flex: 1, fontFamily: fonts.sans, fontSize: 14, color: colors.ink, backgroundColor: colors.card, borderRadius: 99, paddingHorizontal: 18, paddingVertical: 12, borderWidth: 1, borderColor: colors.line },
  sendBtn:      { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.terra, alignItems: 'center', justifyContent: 'center', ...shadow.cta },
});
