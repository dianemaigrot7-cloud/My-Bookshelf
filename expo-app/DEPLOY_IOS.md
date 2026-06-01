# Publishing My Bookshelf to the Apple App Store

Complete step-by-step guide using **EAS Build** (Expo Application Services).

---

## Prerequisites

| Requirement | Cost | Notes |
|---|---|---|
| **Apple Developer Program** | $99 / year | [developer.apple.com/programs](https://developer.apple.com/programs/) — required to publish |
| **Expo account** | Free | [expo.dev/signup](https://expo.dev/signup) |
| **EAS CLI** | Free | `npm install -g eas-cli` |
| A **Mac** | — | *Not* required — EAS builds in the cloud |

---

## Step 1 — Install & log in

```bash
npm install -g eas-cli
eas login                 # use your Expo credentials
```

## Step 2 — Link the project

```bash
cd expo-app
eas init                  # creates/links an EAS project, fills extra.eas.projectId
```

This replaces the placeholder `projectId` in `app.json` with your real one.

## Step 3 — Configure production env vars

Edit `eas.json` → `build.production.env` with your real Supabase URL + anon key,
**or** (recommended) store them as EAS secrets so they're not committed:

```bash
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://xxx.supabase.co"
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..."
```

## Step 4 — Provide app icons & splash

EAS needs real assets (the build will fail without them):

- `assets/icon.png` — **1024×1024**, no transparency, no rounded corners
- `assets/splash.png` — at least 1284×2778 (centred logo on `#2f4a36`)
- `assets/adaptive-icon.png` — 1024×1024 (Android foreground)

> Use the existing brand mark from `../my-bookshelf-icon-1024.png` as the icon.

## Step 5 — Build the iOS binary

```bash
eas build --platform ios --profile production
```

On first run EAS will:
1. Ask you to log in with your **Apple ID**
2. Offer to **create the App Store Connect app** and **bundle identifier** automatically
3. Generate the **distribution certificate** and **provisioning profile** for you (no Mac, no Keychain juggling)
4. Build in the cloud (~15–25 min) and give you a `.ipa` URL

## Step 6 — Create the App Store listing

In [App Store Connect](https://appstoreconnect.apple.com):

1. **My Apps → +** → New App
   - Platform: iOS
   - Bundle ID: `com.mybookshelf.app`
   - SKU: `mybookshelf-001`
2. Fill in:
   - **Name**, subtitle, description, keywords
   - **Screenshots** (6.7" iPhone required — 1290×2796)
   - **Privacy Policy URL** (host your `legal-content` — required since you collect data)
   - **App Privacy** questionnaire (declare: location → district, email, usage data; see notes below)
   - **Category**: Books or Lifestyle
   - **Age rating** questionnaire

## Step 7 — Submit the build

```bash
eas submit --platform ios --profile production --latest
```

This uploads the build to App Store Connect. After processing (~10 min), select
the build under your app's version, then click **Submit for Review**.

## Step 8 — Review

Apple review typically takes **24–48 h**. Once approved you choose to release
manually or automatically.

---

## Critical App Store requirements for THIS app

Because My Bookshelf collects data and has payments, watch out for:

### 1. App Privacy declaration (App Store Connect → App Privacy)
Declare exactly what `supabase.js` / consent flow collect:
- **Coarse Location** → "App Functionality" (district only)
- **Email Address** → "App Functionality" / account
- **User Content** (reviews, messages) → "App Functionality"
- **Usage Data** → only if analytics consent is on → "Analytics"

Your GDPR consent gate already supports this — just keep the declaration honest.

### 2. Payments — Apple's 30% rule ⚠️
The €29/year subscription is the tricky part:

| Payment type | Apple's rule |
|---|---|
| **Digital subscription** unlocking in-app features | **MUST** use Apple In-App Purchase (StoreKit) — Stripe is **rejected** |
| Physical goods / real-world services (the books, in person) | Stripe / external payment **allowed** |

Since the €29/year unlocks *digital* features (passports, messaging, map),
Apple requires **In-App Purchase**, not Stripe, for that subscription.
→ Replace the Paywall's Stripe button with **`expo-in-app-purchases`** or
**RevenueCat** (recommended — wraps StoreKit + your Supabase entitlement).
The book transactions themselves stay peer-to-peer/in-person, so they're fine.

### 3. Required reason for camera & location
Already covered by the `NS…UsageDescription` strings in `app.json` — Apple
rejects builds with vague descriptions, so keep them specific (they are).

### 4. Account deletion
Apple **requires** in-app account deletion if you offer account creation.
✅ Already built — `PrivacyDataScreen` → "Delete my account".

---

## Quick command reference

```bash
eas login                                          # authenticate
eas init                                            # link project
eas build  --platform ios --profile production      # build .ipa in cloud
eas submit --platform ios --profile production --latest   # upload to App Store
eas build  --platform ios --profile preview         # internal TestFlight-style build
```

## TestFlight (recommended before public release)

Every production build is automatically available in **TestFlight** once
uploaded. Invite testers under App Store Connect → TestFlight before going live —
no review needed for internal testers.
