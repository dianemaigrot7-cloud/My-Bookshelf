# Handoff: My Bookshelf — community book-sharing app

## Overview
**My Bookshelf** is a community book-sharing platform where neighbours sell, give away, and exchange second-hand books in person. Its signature feature is the **Book Passport** — a living travel journal that follows each physical copy across owners, cities, and countries. This bundle contains a high-fidelity, clickable mobile prototype of the core experience plus the finalized brand/logo.

## About the Design Files
The files in this bundle are **design references created in HTML/React (via in-browser Babel)** — prototypes showing the intended look, layout, and behavior. **They are not production code to copy directly.** Your task is to **recreate these designs in the target codebase's environment** using its established patterns and libraries.

The original brief specified a **Supabase-style relational schema, Open Library ISBN lookup, Stripe subscriptions, and a map view** — the prototype mocks all of these with static data. When implementing for real, wire the documented screens to:
- **Open Library API** — `https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data` for metadata; covers at `https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg`.
- **Stripe** — for the €29/year subscription after the 3-month trial.
- A real **map provider** (Mapbox / Google Maps) for the Neighbours view (the prototype uses a stylized faux map).
- A backend with the tables listed in **Data Model** below.

If no codebase exists yet, React Native / Expo (mobile-first) or React + a component library is a sensible choice — but defer to any existing environment.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, and interactions are all specified below and visible in the prototype. Recreate the UI faithfully, adapting to the target framework's idioms.

---

## Brand & Logo
The logo (the "Little Shelf" mark) is finalized and included as SVG/PNG in `logo-assets/`.
- **Mark:** a row of book spines of varying height on a baseline, one leaning, in the "Ink + Ember" palette (terracotta/mustard/clay spines).
- **App icon:** the mark centered on an ink (`#2c2722`) rounded tile (~23% corner radius). Provided at 1024/512/192/180/32 px.
- **Wordmark:** "My Bookshelf" in **DM Serif Display** — "My" in *italic terracotta* (`#c25a3a`), "Bookshelf" in roman ink (`#2b2a26`).
- One-color variants (ink, cream) provided for stamps/print.

---

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| `--forest` | `#2f4a36` | Primary brand green; dark screens, headers, primary-forest buttons |
| `--moss` | `#4d6b50` | Secondary green; "free", success, accents |
| `--sage` | `#86a083` | Muted green; inactive icons, meta labels |
| `--cream` | `#f1e8d6` | Warm panel / tab backgrounds, text on dark |
| `--paper` | `#fbf6ea` | App background |
| `--card` | `#fffdf7` | Card surface |
| `--terra` | `#c25a3a` | **Primary CTA / accent**, prices, "My" in wordmark |
| `--terra-deep` | `#a8472b` | Passport stamp ink, emphasis |
| `--clay` | `#d98e6a` | Tertiary warm accent, "now" markers |
| `--gold` | `#d8a441` | Star ratings |
| `--ink` | `#2b2a26` | Primary text |
| `--muted` | `#7d7763` | Secondary text |
| `--line` | `rgba(47,74,54,0.12)` | Borders/dividers |
| `--line-soft` | `rgba(47,74,54,0.07)` | Subtle borders |

### Typography
- **Display / headings / wordmark:** `DM Serif Display` (Google). Used at 18–44px. "My" set in italic.
- **UI / body:** `Hanken Grotesk` (Google), weights 400/500/600/700/800.
- **Mono labels (eyebrows, captions):** `Space Grotesk` for small uppercase metadata.
- Eyebrow style: 12px, weight 700, letter-spacing 1.4px, uppercase, color `--sage`.

### Radii & Shadows
- Card radius: 16–22px. Buttons: 14px. Pills/chips: 999px. App icon tile: ~23%.
- Tile/cover shadow: `0 6px 16px rgba(43,42,38,0.22)`.
- Card shadow: `0 2px 10px rgba(43,42,38,0.06)`.
- CTA shadow (terracotta): `0 8px 18px rgba(194,90,58,0.32)`.

### Spacing
- Screen horizontal padding: 18px. Card inner padding: 14–16px. Section gaps: 20–24px.
- Touch targets ≥ 44px. Bottom tab bar: 64px tall, floating with 14px side margins, 26px bottom inset (clears home indicator).

---

## Data Model
From the brief (adapt naming to your ORM):
- **Users**: id, name, photo, bio, neighbourhood (district), city, country, is_subscribed, trial_start_date. *Exact address never exposed — only district.*
- **Books**: id, isbn, title, author, cover_image_url, current_owner (→User), is_available, price, condition (`As New` | `Used` | `Quite Old`).
- **Reviews**: id, book (→Book), written_by (→User), rating (1–5), comment, date.
- **Ownership**: id, book (→Book), owner (→User), city, country, date_received, condition, rating, review (→Review). *This is the Passport backbone — one row per owner per copy.*
- **Messages**: id, sender (→User), receiver (→User), book (→Book), content, timestamp.

---

## Screens / Views

### 1. Home / Browse (`HomeScreen`)
- **Purpose:** Discover available books near the user.
- **Layout:** Fixed header (logo lockup + "Books near you in {district}, {city}", search field, horizontal scrolling filter chips), then a 2-column scrolling grid of book cards. Bottom tab bar overlaid.
- **Header:** ShelfMark (30px) + serif wordmark. Top-right: square icon button → Neighbours map.
- **Search field:** card surface, 14px radius, magnifier icon (sage), placeholder "Search title, author, genre". Filters title+author+genre live.
- **Filter chips:** `Free`, `As New`, `Used`, `Quite Old`. Active = forest bg + cream text; inactive = card bg + muted text, `--line` border. `white-space: nowrap`.
- **Book card:** cover (aspect 1:1.5, radius 10, spine shadow on left edge), title (DM Serif 15px, 2-line clamp), author (12px muted), then a row: PriceTag + district with pin icon.

### 2. Book Detail (`BookDetailScreen`)
- **Purpose:** Evaluate a book and request it.
- **Layout:** Soft cream→paper hero band (320px) behind a centered cover (150px wide). Below: title (DM Serif 26px centered), author, condition badge + genre. Then a 2-card row: **Price** card and a tappable forest **Passport** card ("{n} owners · {n} countries" → opens Passport). Then "{Seller}'s note": avatar + name + stars + italic serif review quote with a clay left-border. Sticky bottom **Request this book** button (terracotta).
- **Interaction:** Tapping Request → button is replaced by "✓ Request sent to {name}" + a forest **Message** button (opens the thread). Top-right heart (save) button.

### 3. Book Passport (`PassportScreen`) — THE HERO
- **Purpose:** Show the copy's journey across owners/cities/countries — "like a real passport with stamps."
- **Layout:** Full forest (`--forest`) background, white status bar. Title bar "Book Passport" + back.
  - **Passport booklet card:** paper-textured (subtle 135° repeating stripe), 20px radius, big shadow. Header = small cover (60px) + "BOOK PASSPORT" eyebrow (terra-deep) + title + author.
  - **Summary stats row:** three cells separated by dashed rules — **Owners**, **Countries**, **Avg ★** — numbers in DM Serif 26px terra-deep.
  - **Stamps row:** horizontally scrolling circular "stamps", each rotated slightly (−7°…+8°), dashed ring in a rotating ink color, containing country flag emoji + city (uppercase) + date. Caption: "Travelled across {n} countries · scroll the stamps →".
  - **Timeline:** "THE JOURNEY, IN ORDER" eyebrow (cream), then a vertical line with each owner: round avatar (last one ringed clay with a "NOW" badge), a paper card with name + stars, a meta line "{flag} {city} · {date}", and an italic review quote.
- **Data:** Render from the Ownership rows for that copy, oldest→newest. Avg = mean of ratings.

### 4. Add Book (`AddBookScreen`) — core flow
- **Stages (state machine):** `scan` → `found` → `form` → `done`.
- **scan:** Dark (`#11160f`) camera screen, white status bar. Viewfinder rectangle with corner brackets (clay), an animated horizontal scan line, a faux barcode. Copy: "Point at the barcode / on the back cover of your book". *(Real build: open camera, decode EAN-13/ISBN barcode.)*
- **found:** "✓ Found via Open Library" pill + fetched title/author. *(Real build: GET Open Library by ISBN.)* Auto-advances to form.
- **form (light):** Auto-filled book card ("✓ AUTO-FILLED" + cover + title + author + ISBN). Then: **Condition** segmented control (As New / Used / Quite Old), **Your rating** (interactive 5-star picker, gold), **Your note for the next reader** (textarea, placeholder "I loved this book, I recommend it because…"), **Price** (€ input) with a **Give free** toggle (disables price, turns moss). Sticky **List it on my shelf** button.
- **done:** Success check, "Added to your shelf", note that the passport has begun. Buttons: "See it in My Library" / "Back to browsing".
- **On submit (real build):** create a Book record (if new) + an Ownership record for this user with city/country/date/condition/rating/review.

### 5. My Library (`LibraryScreen`)
- **Two tabs (segmented):** **Reading now** (private shelf) and **My shelf** (public).
- **Reading now:** horizontal cards tagged "PRIVATELY READING" with a **"Finished — publish it"** terracotta button. After publishing → "✓ Published to your shelf" and the book appears on the public shelf + a new passport entry is added.
- **My shelf:** 2-column grid of the user's published books with price + "{n} owners".

### 6. Messages (`MessagesScreen` + `ThreadScreen`)
- **List:** avatar (with unread count badge in terracotta), name, book title (moss), last message preview + time.
- **Thread:** back bar with name + avatar. Tappable **book context banner** (cover + title + price/condition). If there's a pending **request**, a card with **Decline / Accept** buttons (accept → "✓ Accepted — arrange your handover"). Chat bubbles: mine = terracotta (#fff text, tail bottom-right), theirs = card surface (tail bottom-left), timestamps. Bottom composer: rounded input + circular terracotta send button. *No shipping — copy emphasises in-person handover.*

### 7. Profile / Public Library (`ProfileScreen`)
- **Own profile:** avatar (92px, 28 radius), name (DM Serif 25px), district/city/country with pin, bio. Two cards: **Free trial** ("62 days left") and **Membership** ("€29 / year →" → Paywall). Then "On my shelf · {n}" 3-column grid. Top-right gear → Paywall.
- **Other user's profile** (from Neighbours): same layout, back button, "{Name}'s shelf", their available books.

### 8. Neighbours Map (`NeighboursScreen`)
- Stylized faux map (streets, a river, parks) with circular avatar pins; selected pin enlarges + turns terracotta. Tapping shows a card: avatar, name, district, "{n} books to share", bio, and **"Browse {name}'s shelf"** (→ their profile). *(Real build: replace with Mapbox/Google Maps; pin = user's district centroid, never exact address.)*

### 9. Paywall (`PaywallScreen`)
- Forest gradient bg, cream ShelfMark. Headline "Keep your shelf *open*" (open in italic clay). Body explains the 3-month trial ended. White price card: "€29 / year", "That's €2.42 a month", feature checklist (Unlimited listings & swaps / Full book passports & journeys / Message every neighbour / Map of readers near you), **"Continue with Stripe"** button (card icon). "Cancel anytime · secure payment". *(Real build: Stripe Checkout/subscription; gate full features once trial_start_date + 3 months has passed and not is_subscribed.)*

---

## Interactions & Behavior
- **Navigation:** Bottom tab bar with 5 slots — Browse, Library, **center + (Add)**, Messages, Profile. The center add button is elevated, terracotta, with a paper ring. Tabs are hidden on stack/detail screens (Book detail, Passport, Add, Thread, Paywall, Neighbours), which show a back chevron instead.
- **Stack model:** main screens are tabs; detail screens push onto a stack with back navigation.
- **Status bar color:** dark text on light screens; **white text on the dark screens** (Passport, Paywall, Add-scan). Track per-screen.
- **Entrance animation:** subtle 6px upward slide on screen change (~0.32s). *Important: do NOT animate opacity from 0 for structural containers — if the animation timeline is paused the content would stay invisible. Keep resting state fully visible.*
- **Press feedback:** scale 0.97 + slight brightness on tap for interactive elements.
- **Free toggle, condition segments, star picker, filter chips, search** are all live/stateful.

## State Management
- Global: active tab, navigation stack (screen + params), status-bar darkness.
- Local: search query + active filters (Home), add-flow stage + form fields (Add), library tab + published set (Library), message draft + request state (Thread), requested state (Book detail), selected pin (Neighbours).
- Data fetching (real build): nearby books by district, book + ownership history (passport), threads/messages, Open Library lookup, Stripe subscription status.

## Assets
- **Logo:** `logo-assets/` — `my-bookshelf-icon.svg`, PNGs (1024/512/192/180/32), `my-bookshelf-symbol.svg`, `my-bookshelf-symbol-ink.svg`.
- **Book covers:** Open Library (`covers.openlibrary.org/b/isbn/{isbn}-L.jpg`) with a colored title/author fallback tile when an image is missing.
- **Avatars:** placeholder service in the prototype — replace with real user photos.
- **Fonts:** DM Serif Display, Hanken Grotesk, Space Grotesk (Google Fonts).
- **Icons:** inline SVG (home, books, chat, person, plus, search, pin, heart, map, gear, check, send) — substitute your icon library.

## GDPR & Legal Compliance

> **Not legal advice.** The Terms and Privacy Policy in this prototype are **templates** with `[bracketed placeholders]`. They must be completed and reviewed by qualified legal counsel for your company and jurisdiction before launch. The app shows this disclaimer to users on the document screens.

### Onboarding order
**Signup (age-gate) → Consent gate → App** (with a cookie banner shown once on the home screen). All surfaces are persisted (prototype: `localStorage` keys `bs_account`, `bs_consent`, `bs_cookie`; production: server-side records with version + timestamp).

### Signup with age-gate (`SignupScreen`)
- Collects name, email, neighbourhood/city, and **date of birth**. Computes age and **blocks under-16** (configurable `MIN_AGE` per jurisdiction) with a polite "Not quite yet" screen.
- Privacy-by-design copy: store only the **age band**, not full DOB; only district + city shown to others.
- Links to Terms & Privacy before account creation.

### Cookie / SDK banner variant (`CookieBanner`)
- A lighter, web-style bottom banner shown once on Home: **Accept all / Reject optional** (equal weight) + **Manage choices** (→ Privacy & data).
- Use for the web build, or as the in-app re-consent surface for analytics/personalisation SDKs. Mirror its choices in the full consent record.

### Edit profile / rectification (`EditProfileScreen`)
- Reachable from Profile (pencil icon) and from **"Correct my information"** in Privacy & data — fulfilling the right to rectification.
- Edits name, photo, bio, neighbourhood, city; reiterates that exact address is never shown.

### Consent gate (`ConsentScreen`) — first run
- Shown once before app use; choice persisted (prototype uses `localStorage` key `bs_consent` — use your backend + a versioned consent record in production).
- **Granular, opt-in** toggles: Essential (locked on, legal basis = contract), "Show readers near me" (location/district), Personalised recommendations, Usage analytics. Non-essential default **off** until the user agrees.
- **No dark patterns:** "Essential only" is presented with equal visual weight to "Accept all". "Manage choices" reveals all toggles.
- Links to Terms & Privacy Policy; explicit 16+ (digital-consent age) confirmation.
- Store: which consents were given, timestamp, and policy version. Re-prompt when policies materially change.

### Privacy & Data centre (`PrivacyDataScreen`) — in Profile
Lets users exercise GDPR rights at any time:
- **Manage consents** (same toggles, withdrawable anytime — withdrawal must be as easy as giving).
- **Right of access / portability** — "Download my data" (export a portable copy).
- **Rectification** — "Correct my information" (edit profile/listings).
- **Restriction / objection** — "Restrict or object".
- **Erasure** — "Delete my account" ("right to be forgotten"), with a confirmation sheet explaining that Passport entries are retained in **anonymised** form to preserve each book's history, and that limited records may be kept for legal obligations.
- Note pointing users to their local supervisory authority for complaints.

### Data-minimisation principles baked into the design
- **Never display exact address** — only neighbourhood/district. The Neighbours map must pin to a district centroid, not a precise location.
- Payment handled by Stripe; **no full card data** stored.
- Book metadata/covers from Open Library are third-party data shown "as is".
- Each Ownership/Passport row is personal data of that owner — handle accordingly on erasure (anonymise rather than break the chain).

### Terms & Conditions — risk-protective clauses included (template)
Platform-is-an-intermediary (not a party to transactions); in-person meetings at users' own risk + safety guidance; "as is" disclaimers; **limitation of liability** (cap + carve-outs that can't be excluded by law); **indemnity**; prohibited items/conduct; user-content licence (incl. Passport visibility persisting after handover); subscription/trial/refund terms; governing law `[jurisdiction]`; EU ODR reference. See `bookshelf/legal-content.jsx`.

### Privacy Policy — GDPR structure included (template)
Controller/DPO identity; data categories; **legal bases per purpose** (consent / contract / legitimate interest / legal obligation); recipients & processors (Stripe, hosting, maps, Open Library); international transfers (SCCs); retention; the full list of data-subject rights; cookies/SDKs; children; security. See `bookshelf/legal-content.jsx`.

### Implementation checklist for the developer
- [ ] Replace all `[bracketed]` placeholders; have counsel review Terms + Privacy.
- [ ] Persist consents server-side with version + timestamp; gate non-essential SDKs on consent.
- [ ] Build data-export and account-deletion pipelines (with Passport anonymisation).
- [ ] Ensure analytics/personalisation only initialise after opt-in.
- [ ] Cookie/SDK consent parity with the in-app toggles.
- [ ] Record-of-processing & DPA agreements with each processor (out of app scope).

## Files (in this bundle)
- `My Bookshelf App.html` — entry point; loads fonts + React + all modules below.
- `bookshelf/ios-frame.jsx` — device frame (prototype chrome only; not needed in a real app).
- `bookshelf/data.jsx` — mock users, books, passports, threads, neighbours.
- `bookshelf/ui.jsx` — **design tokens** + shared components (ShelfMark, Stars, StarPicker, Cover, PriceTag, ConditionBadge, Btn, Eyebrow, TopBar).
- `bookshelf/screens-home.jsx` — Home/Browse + Neighbours.
- `bookshelf/screens-book.jsx` — Book detail + Passport.
- `bookshelf/screens-add.jsx` — Add Book flow.
- `bookshelf/screens-misc.jsx` — Library, Messages, Thread, Profile, Paywall.
- `bookshelf/screens-legal.jsx` — Consent gate, Terms/Privacy viewer, Privacy & Data centre.
- `bookshelf/screens-onboarding.jsx` — Signup age-gate, Edit profile, Cookie banner.
- `bookshelf/legal-content.jsx` — **template** Terms & Privacy Policy copy (placeholders + disclaimer).
- `bookshelf/app.jsx` — navigation shell + tab bar + signup/consent/cookie gating + editable profile state.

Open `My Bookshelf App.html` in a browser to interact with the full prototype.
