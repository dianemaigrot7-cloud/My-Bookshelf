# Publishing My Bookshelf to the Apple App Store

Step-by-step guide using **EAS Build** (Expo Application Services).

> ✅ **My Bookshelf is a free app** — no subscription, no in-app purchase.
> This removes Apple's most common rejection cause (the digital-subscription /
> In-App-Purchase rules), so the path to the store is straightforward.

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
eas login
```

## Step 2 — Link the project

```bash
cd expo-app
eas init          # creates/links an EAS project, fills extra.eas.projectId
```

## Step 3 — Production env vars (Supabase)

Store your Supabase credentials as EAS secrets (keeps them out of git):

```bash
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL      --value "https://xxx.supabase.co"
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..."
```

## Step 4 — App icons & splash

EAS needs real assets (the build fails without them):

- `assets/icon.png` — **1024×1024**, no transparency, no rounded corners
  (use the existing brand mark from `../my-bookshelf-icon-1024.png`)
- `assets/splash.png` — ≥ 1284×2778, centred logo on `#2f4a36`
- `assets/adaptive-icon.png` — 1024×1024 (Android foreground)

## Step 5 — Build the iOS binary

```bash
eas build --platform ios --profile production
```

On first run EAS will:
1. Ask you to log in with your **Apple ID**
2. Offer to create the App Store Connect app + bundle identifier automatically
3. Generate the distribution certificate & provisioning profile for you
4. Build in the cloud (~15–25 min) and give you a `.ipa`

## Step 6 — Create the App Store listing

In [App Store Connect](https://appstoreconnect.apple.com): **My Apps → +**

- Bundle ID: `com.mybookshelf.app`
- **Price: Free**
- Name, subtitle, description, keywords
- **Screenshots** (6.7" iPhone, 1290×2796)
- **Privacy Policy URL** (host your Terms/Privacy — required)
- **App Privacy** questionnaire (see below)
- Category: Books or Lifestyle · Age rating questionnaire

## Step 7 — Submit

```bash
eas submit --platform ios --profile production --latest
```

Then in App Store Connect, attach the build to your version and click
**Submit for Review**. Apple review usually takes **24–48 h**.

---

## App Store requirements covered by this app

### App Privacy declaration (App Store Connect → App Privacy)
Declare exactly what the app collects:
- **Coarse Location** → "App Functionality" (district only)
- **Email Address** → account
- **User Content** (reviews, messages) → "App Functionality"
- **Usage Data** → only if analytics consent is on → "Analytics"

The GDPR consent gate already gates these — keep the declaration honest.

### No payments ✅
The app processes no payments and has no subscription, so there are **no
In-App-Purchase obligations**. Book prices are settled directly between users
in person — outside the app — which Apple permits.

### Camera & location usage strings ✅
Specific `NS…UsageDescription` strings are set in `app.json` (Apple rejects
vague ones).

### In-app account deletion ✅
Required by Apple when you offer account creation — already built in
`PrivacyDataScreen` → "Delete my account".

---

## Command reference

```bash
eas login                                                # authenticate
eas init                                                 # link project
eas build  --platform ios --profile production           # build .ipa in cloud
eas submit --platform ios --profile production --latest  # upload to App Store
eas build  --platform ios --profile preview              # internal/TestFlight build
```

## TestFlight (recommended before public release)

Every production build is automatically available in **TestFlight** once
uploaded. Invite testers under App Store Connect → TestFlight before going
live — no review needed for internal testers.
