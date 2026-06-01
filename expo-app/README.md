# My Bookshelf — Expo App

React Native / Expo mobile app. Works immediately with mock data; connect Supabase for a real backend.

## Quick start

```bash
cd expo-app
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) or press `i` / `a` for simulators.

## Connect Supabase (optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in your project's SQL editor
3. Copy `.env.example` → `.env` and fill in your URL + anon key
4. Restart the dev server

The app detects whether Supabase is configured at startup. Without credentials it runs entirely on mock data — all screens are functional.

## Project structure

```
App.js                     Entry point
src/
  lib/
    supabase.js            Supabase client + query helpers
    openLibrary.js         Open Library API (ISBN lookup + search)
  hooks/
    useAuth.js             Auth context (signup, login, profile, consent)
    useBooks.js            Book queries + add-book flow
    useMessages.js         Threads + realtime messages
  components/index.js      Shared UI (ShelfMark, Cover, Btn, TopBar…)
  navigation/index.js      React Navigation stack + bottom tabs
  screens/                 15 screens (see below)
  data/mock.js             Mock data (used when Supabase is not configured)
  theme.js                 Design tokens (colors, fonts, spacing…)
supabase/
  schema.sql               Full PostgreSQL schema with RLS policies
```

## Screens

| Screen | File |
|---|---|
| Home / Browse | `HomeScreen.js` |
| Book Detail | `BookDetailScreen.js` |
| Book Passport | `PassportScreen.js` |
| Add Book (ISBN scan) | `AddBookScreen.js` |
| My Library | `LibraryScreen.js` |
| Messages | `MessagesScreen.js` |
| Chat Thread | `ThreadScreen.js` |
| Profile | `ProfileScreen.js` |
| Edit Profile | `EditProfileScreen.js` |
| Neighbours Map | `NeighboursScreen.js` |
| Signup (age-gate) | `SignupScreen.js` |
| GDPR Consent | `ConsentScreen.js` |
| Terms / Privacy | `LegalScreen.js` |
| Privacy & Data centre | `LegalScreen.js` (PrivacyDataScreen) |

## Real-world integrations (next steps)

- **Open Library** — already wired: `src/lib/openLibrary.js` → `lookupISBN()` is called live during the Add Book scan flow
- **Supabase auth** — email/password via `signUp` / `signInWithPassword`; session persisted in `expo-secure-store`
- **Supabase realtime** — messages table subscribed for live chat updates
- **Free app** — no subscription, no in-app payment. Book prices are settled directly between users in person.
- **Maps** — replace the `NeighboursScreen` faux map with `react-native-maps` + Mapbox/Google; pin to district centroid
- **Camera / barcode** — `expo-camera` + `CameraView` already in `AddBookScreen.js`; reads EAN-13/ISBN barcodes natively
