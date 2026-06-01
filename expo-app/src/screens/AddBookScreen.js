import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { lookupISBN } from '../lib/openLibrary';
import { useAddBook } from '../hooks/useBooks';
import { useAuth } from '../hooks/useAuth';
import { TopBar, Cover, StarPicker, Eyebrow, Btn } from '../components';
import { colors, fonts, radius, shadow, spacing } from '../theme';

export default function AddBookScreen({ navigation }) {
  const [stage, setStage]   = useState('scan'); // scan|found|form|done
  const [perm, requestPerm] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [book, setBook]     = useState(null);
  const [cond, setCond]     = useState('Used');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [price, setPrice]   = useState('5');
  const [free, setFree]     = useState(false);
  const { save, saving }    = useAddBook();
  const { userId, profile } = useAuth();

  async function onBarcode({ data: isbn }) {
    if (scanned) return;
    setScanned(true);
    const found = await lookupISBN(isbn);
    if (found) { setBook(found); setStage('found'); }
    else { setScanned(false); } // let user try again
  }

  useEffect(() => {
    if (stage === 'found') {
      const t = setTimeout(() => setStage('form'), 1400);
      return () => clearTimeout(t);
    }
  }, [stage]);

  async function submit() {
    const saved = await save({
      isbn: book.isbn, title: book.title, author: book.author,
      coverUrl: book.coverUrl, condition: cond, rating, reviewText: review,
      price, isFree: free, genre: book.genres?.[0] || '',
      city: profile?.city || '', country: profile?.country || '',
    }, userId);
    if (saved) setStage('done');
  }

  // ── Scan stage ───────────────────────────────────────────────────────
  if (stage === 'scan' || stage === 'found') {
    return (
      <View style={[s.screen, { backgroundColor: '#11160f' }]}>
        <TopBar title="Scan ISBN" onBack={() => navigation.goBack()} dark/>
        <View style={s.scanCenter}>
          {perm?.granted ? (
            <View style={s.viewfinder}>
              <CameraView style={StyleSheet.absoluteFill}
                barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'isbn13'] }}
                onBarcodeScanned={stage === 'scan' ? onBarcode : undefined}/>
              {/* Corner brackets */}
              {[[-1,1],[-1,-1],[1,1],[1,-1]].map(([y,x], i) => (
                <View key={i} style={[s.corner, {
                  top: y === -1 ? 10 : undefined, bottom: y === 1 ? 10 : undefined,
                  left: x === -1 ? 10 : undefined, right: x === 1 ? 10 : undefined,
                  borderTopWidth: y === -1 ? 3 : 0, borderBottomWidth: y === 1 ? 3 : 0,
                  borderLeftWidth: x === -1 ? 3 : 0, borderRightWidth: x === 1 ? 3 : 0,
                }]}/>
              ))}
              {/* Scan line */}
              {stage === 'scan' && <View style={s.scanLine}/>}
            </View>
          ) : (
            <View style={s.viewfinder}>
              <TouchableOpacity onPress={requestPerm} style={{ padding: 20 }}>
                <Text style={{ color: colors.cream, fontFamily: fonts.sansBd, fontSize: 15, textAlign: 'center' }}>
                  Tap to allow camera access
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {stage === 'scan' ? (
            <View style={{ alignItems: 'center', marginTop: 28 }}>
              <Text style={s.scanTitle}>Point at the barcode</Text>
              <Text style={s.scanSub}>on the back cover of your book</Text>
            </View>
          ) : (
            <View style={{ alignItems: 'center', marginTop: 28 }}>
              <View style={s.foundPill}>
                <Text style={{ color: colors.clay, fontFamily: fonts.sansBd }}>✓ Found via Open Library</Text>
              </View>
              <Text style={[s.scanTitle, { marginTop: 14 }]}>{book?.title}</Text>
              <Text style={s.scanSub}>{book?.author}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  // ── Done stage ───────────────────────────────────────────────────────
  if (stage === 'done') {
    return (
      <View style={[s.screen, { alignItems: 'center', justifyContent: 'center', padding: 30 }]}>
        <View style={s.successCircle}><Text style={{ fontSize: 42 }}>✓</Text></View>
        <Text style={s.successTitle}>Added to your shelf</Text>
        <Text style={s.successBody}>
          "{book?.title}" is now live for neighbours nearby — and its passport has begun.
        </Text>
        <View style={{ width: '100%', gap: 10, marginTop: 24 }}>
          <Btn label="See it in My Library" kind="primary" full onPress={() => navigation.navigate('Library')}/>
          <Btn label="Back to browsing" kind="ghost" full onPress={() => navigation.navigate('Home')}/>
        </View>
      </View>
    );
  }

  // ── Form stage ───────────────────────────────────────────────────────
  return (
    <View style={s.screen}>
      <TopBar title="Add your book" onBack={() => navigation.goBack()}/>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}>
        {/* Auto-filled book card */}
        <View style={[s.bookCard, shadow.card]}>
          <View style={{ width: 56 }}>
            <Cover isbn={book?.isbn} title={book?.title} author={book?.author} width={56} radius={7}/>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.autoLabel}>✓ AUTO-FILLED</Text>
            <Text style={s.formTitle}>{book?.title}</Text>
            <Text style={s.formAuthor}>{book?.author}</Text>
            <Text style={s.formIsbn}>ISBN {book?.isbn}</Text>
          </View>
        </View>

        {/* Condition */}
        <View style={{ marginTop: 22 }}>
          <Eyebrow>Condition</Eyebrow>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            {['As New','Used','Quite Old'].map(c => (
              <TouchableOpacity key={c} onPress={() => setCond(c)} activeOpacity={0.78}
                style={[s.condBtn, cond === c && s.condBtnOn]}>
                <Text style={[s.condLabel, cond === c && s.condLabelOn]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rating */}
        <View style={{ marginTop: 22 }}>
          <Eyebrow>Your rating</Eyebrow>
          <View style={{ marginTop: 10 }}><StarPicker value={rating} onChange={setRating}/></View>
        </View>

        {/* Review */}
        <View style={{ marginTop: 22 }}>
          <Eyebrow>Your note for the next reader</Eyebrow>
          <TextInput value={review} onChangeText={setReview} multiline numberOfLines={3}
            placeholder="I loved this book, I recommend it because…"
            placeholderTextColor={colors.sage}
            style={s.textarea}/>
        </View>

        {/* Price */}
        <View style={{ marginTop: 22 }}>
          <Eyebrow>Price</Eyebrow>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <View style={[s.priceInput, free && { opacity: 0.5 }]}>
              <Text style={s.euro}>€</Text>
              <TextInput value={price} onChangeText={v => setPrice(v.replace(/[^0-9]/g, ''))}
                editable={!free} keyboardType="numeric" style={s.priceField}/>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Switch value={free} onValueChange={setFree}
                trackColor={{ false: colors.line, true: colors.moss }}
                thumbColor="#fff"/>
              <Text style={{ fontFamily: fonts.sansBd, fontSize: 13.5, color: free ? colors.moss : colors.muted }}>
                Give free
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={s.ctaBar}>
        <Btn label="List it on my shelf" kind="primary" full loading={saving} onPress={submit}/>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: colors.paper },
  scanCenter:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  viewfinder:  { width: 260, height: 200, borderRadius: 18, overflow: 'hidden', backgroundColor: '#2a3326' },
  corner:      { position: 'absolute', width: 26, height: 26, borderColor: colors.clay, borderRadius: 4 },
  scanLine:    { position: 'absolute', left: 14, right: 14, height: 2, backgroundColor: colors.terra, top: '46%' },
  scanTitle:   { fontFamily: fonts.serif, fontSize: 19, color: colors.cream },
  scanSub:     { fontFamily: fonts.sans, fontSize: 13, color: 'rgba(241,232,214,0.6)', marginTop: 6 },
  foundPill:   { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(77,107,80,0.25)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99 },
  successCircle:{ width: 76, height: 76, borderRadius: 38, backgroundColor: colors.moss, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontFamily: fonts.serif, fontSize: 24, color: colors.ink, marginTop: 20 },
  successBody:  { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 21 },
  bookCard:     { flexDirection: 'row', gap: 14, backgroundColor: colors.card, borderRadius: 16, padding: 14 },
  autoLabel:    { fontFamily: fonts.sansBd, fontSize: 10.5, color: colors.moss, letterSpacing: 0.4 },
  formTitle:    { fontFamily: fonts.serif, fontSize: 18, color: colors.ink, marginTop: 3, lineHeight: 20 },
  formAuthor:   { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted },
  formIsbn:     { fontFamily: fonts.sans, fontSize: 11, color: colors.muted, opacity: 0.7, marginTop: 3 },
  condBtn:      { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 13, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  condBtnOn:    { backgroundColor: colors.forest, borderColor: colors.forest },
  condLabel:    { fontFamily: fonts.sansBd, fontSize: 13, color: colors.muted },
  condLabelOn:  { color: colors.cream },
  textarea:     { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 13, padding: 12, marginTop: 10, fontFamily: fonts.sans, fontSize: 14, color: colors.ink, lineHeight: 21, minHeight: 90 },
  priceInput:   { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: colors.line },
  euro:         { fontFamily: fonts.serif, fontSize: 20, color: colors.terra },
  priceField:   { flex: 1, fontFamily: fonts.sansBd, fontSize: 18, color: colors.ink, marginLeft: 6 },
  ctaBar:       { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.md, paddingBottom: 34, backgroundColor: colors.paper },
});
