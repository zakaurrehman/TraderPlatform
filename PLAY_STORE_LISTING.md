# Google Play Store Listing — Trade with Shafy

Copy/paste each section directly into Google Play Console.
After the web is redeployed, the privacy URL and feature graphic URL will work.

---

## 1. App details

| Field | Value |
| --- | --- |
| **App name** | `Trade with Shafy` |
| **Default language** | `English (United States) – en-US` |
| **App or game** | `App` |
| **Free or paid** | `Free` |
| **Category** | `Finance` |
| **Tags** (max 5) | `Investing`, `Personal Finance`, `Education`, `News & Magazines`, `Communication` |

---

## 2. Short description (max 80 chars)

```
Live forex signals, ICT trading courses & community for serious traders.
```

(73 characters — safe.)

---

## 3. Full description (max 4000 chars)

```
Trade with Shafy is your all-in-one platform for professional Forex trading education, live BUY/SELL signals, and a thriving community of 5,000+ active traders.

Built around the proven ICT (Inner Circle Trader) and Smart Money Concepts methodology, our app gives you everything needed to go from complete beginner to a consistently profitable trader.

━━━━━ KEY FEATURES ━━━━━

▸ LIVE FOREX SIGNALS
Daily BUY/SELL signals on XAU/USD, EUR/USD, GBP/USD, USD/JPY, GBP/JPY and other major pairs. Every signal includes precise Entry, Take Profit 1, Take Profit 2 and Stop Loss levels plus a short rationale so you learn WHY, not just what.

▸ ICT & SMART MONEY COURSES
A structured curriculum from Beginner to Master covering market structure, order blocks, fair value gaps, liquidity sweeps and institutional order flow. Track your progress, earn certificates and unlock the next level at your own pace.

▸ ECONOMIC CALENDAR
Never miss a high-impact event. NFP, FOMC, CPI and central bank decisions are colour-coded by impact level so you can plan around volatility.

▸ MARKET RESEARCH
Daily analysis from Shafy on Forex, Gold, Crypto, Stocks, Indices and Crude Oil. Premium subscribers get full deep-dives; free users get the headline takeaways.

▸ COMMUNITY
Post your charts, share analysis, comment on other traders' setups and react with likes. Learn alongside a community that's been at it for years.

▸ RISK CALCULATOR
Professional position-size calculator that converts your account balance, risk percentage and stop-loss distance into the exact lot size you should trade. Stop blowing accounts.

▸ BROKER RECOMMENDATIONS
Hand-picked, regulated brokers with quick-sign-up affiliate links. Compare ratings, min deposit and regulation at a glance.

▸ RESOURCE LIBRARY
Free PDFs, cheat sheets and trading guides. Premium members get exclusive masterclasses and trade-review sessions.

▸ 50% AFFILIATE PROGRAM
Refer friends with your unique link and earn 50% commission on referral sales. No cap, no minimum, withdraw to bank, Wise, PayPal or USDT (TRC20).

▸ INSTANT PUSH NOTIFICATIONS
The moment Shafy posts a new signal, the moment a trade closes in profit, or the moment a live session goes on air — your phone buzzes.

━━━━━ MEET SHAFY ━━━━━

Shafqat Rafique is a full-time Forex trader and mentor specialising in ICT and Smart Money strategies. He has taught 5,000+ traders across the world to read market structure, follow institutional order flow and trade with discipline. 80%+ verified signal win rate, transparent monthly performance — nothing hidden.

━━━━━ RISK WARNING ━━━━━

Trading Forex and financial markets involves significant risk of loss and is not suitable for all investors. Past performance is not indicative of future results. Trade with Shafy provides educational content and signals for informational purposes only — we are not licensed financial advisors. Please consult a licensed financial professional before making any investment decision.

For support: shafqatrafique45978@gmail.com
Website: https://www.tradewithshaffy.com
```

(≈ 3,000 characters — comfortably under 4,000.)

> **Do not add prices or plan lists back into this description.** Google Play's
> Payments policy forbids steering users to non-Play payment methods, and that
> rule covers the store listing too. Plans are sold on the website only; the
> Android app is consumption-only (`SHOW_IN_APP_PURCHASES = false` in
> `mobile/src/lib/gating.ts`).

---

## 4. Graphics

| Asset | Source / How to get it |
| --- | --- |
All ready-to-upload files are in `C:\Users\hp\Desktop\app-screenshots\play\`:

| Asset | File |
| --- | --- |
| **App icon** (512×512 PNG, no alpha) | `icon-512.png` |
| **Feature graphic** (1024×500 PNG, no alpha) | `feature-graphic-1024x500.png` (saved from `/feature-graphic`) |
| **Phone screenshots** (1080×1920, 9:16) | `01-live-signals.png` → `05-landing.png`, upload in number order |
| **Tablet screenshots** (optional) | Skip for v1. |

Play rejects screenshots taller than 2:1. The raw iPhone captures are 2.17:1 and
show the iOS status bar, so the Play set crops the status bar off and frames each
screen at 9:16.

---

## 5. Contact details

| Field | Value |
| --- | --- |
| **Email** | `shafqatrafique45978@gmail.com` |
| **Phone** (optional) | leave empty or your real number |
| **Website** | `https://www.tradewithshaffy.com` |

---

## 6. Privacy policy URL

```
https://www.tradewithshaffy.com/privacy
```

The page is now live at that URL — Google bots will visit it during review.

---

## 7. App content questionnaire answers

These are answers to the **Policy → App content** section that you fill out before submitting.

### Privacy policy
- URL: `https://www.tradewithshaffy.com/privacy` ✓

### App access
- **Are parts of your app restricted in any way?** → **Yes, parts of my app are restricted**
- **Login credentials for review**: a **dedicated reviewer account**, never the admin account.
  1. Register a new user on the website (e.g. username `playreview`) with a strong, unique password.
  2. In Admin → Users, approve it and set its plan to `PREMIUM` so reviewers can see every feature.
  3. Enter that username/password here.
  - Notes: *"New registrations require manual approval, so please use this pre-approved account. It has the Premium plan, so all research, courses and signals are visible. Plans are purchased on our website; the app does not sell anything."*

> **Security:** this file previously listed `admin / admin123` here. That is the
> seed default (`prisma/seed.ts`) and it is in git history. If production's admin
> account still uses it, change it now.

### Ads
- **Does your app contain ads?** → **No, my app does not contain ads.**

### Content ratings (IARC questionnaire — Finance category)
Answer honestly. For this app:
- Violence, sexual content, profanity, drugs, gambling, simulated gambling → **No**
- **Users can interact / exchange content** (community posts and comments) → **Yes**
- **User-generated content is moderated** → **Yes** (admin approves accounts and can remove content)
- **Shares user location** → **No**
- **Digital purchases** → **No** (nothing is sold in the app)

The interaction answers will likely raise the rating. That is expected and fine
for an 18+ finance app.

### Target audience and content
- **Target age range** → **18 and over** (DO NOT check any range below 18 — triggers COPPA + Families Policy)
- **Does your app unintentionally appeal to children?** → **No**

### News app
- **Is your app a news app?** → **No**

### COVID-19 contact tracing
- **Is this a COVID-19 contact tracing or status app?** → **No**

### Data safety (critical — be accurate)
**Does your app collect or share any of the required user data types?** → **Yes**

Declare these data types, all marked as **Collected** and **Encrypted in transit**:

| Data type | Purpose | Collection optional? |
| --- | --- | --- |
| **Personal info → Name** | Account management | Required |
| **Personal info → Email address** | Account management, support | Required |
| **Personal info → Phone number** | Account verification | Required |
| **Personal info → User IDs** | Account management | Required |
| **Financial info → Other financial info** (payout method preference, withdrawal payment details) | App functionality (affiliate payouts) | Optional |
| **App activity → App interactions** (course progress, posts, reactions) | App functionality | Required |
| **App activity → In-app search history** | Personalisation | Optional |
| **Device or other IDs → Device or other IDs** (Expo push token) | Push notifications | Optional |

- **Is all of the user data collected by your app encrypted in transit?** → **Yes**
- **Do you provide a way for users to request that their data is deleted?** → **Yes**
  - In-app: Profile → Danger Zone → **Delete My Account**
  - **Delete account URL** (Play requires a web link): `https://www.tradewithshaffy.com/privacy` (section 7, Account Deletion)

### Government apps
- **Is your app developed by or on behalf of a government?** → **No**

### Financial features
- **Does your app provide financial features?** → **Yes — Investing services**
- Specifically: **Investing services > Personal investing tools and information (not licensed financial advisor)**
- Provide a link to your **license / authorization to provide these features**:
  - If you are NOT a licensed advisor in your country, select: *"My app provides educational content about investing — it does not provide personalised financial advice or execute trades."*
  - Add a note: *"Trade with Shafy provides Forex trading education and signals for informational purposes only. We are not licensed financial advisors. All risk disclosures are shown in-app and in our privacy policy."*

---

## 8. Release notes (for the first release)

```
Welcome to Trade with Shafy on Android!

• Live BUY/SELL Forex signals with full Entry, TP1, TP2 and SL levels
• Structured ICT & Smart Money courses
• Daily market research
• Economic calendar with impact-level colouring
• Risk calculator
• Active trading community
• 50% affiliate program
• Push notifications for new signals

Questions? Email shafqatrafique45978@gmail.com
```

---

## 9. Release path

### Production access (personal developer accounts)
Personal Play developer accounts created after 13 Nov 2023 can't publish to
Production straight away. You must first run a **closed test with at least 12
testers opted in for 14 days in a row**, then apply for production access
(Dashboard → "Apply for production"). Organization accounts skip this. Check
your Play Console Dashboard: if Production is locked, this applies to you.

### First upload must be manual
Google's API can't create the first release of a new app, so `eas submit`
fails until one AAB has been uploaded by hand. After that first upload,
`eas submit --platform android --latest` works (it needs a Google service
account key).

## 10. Submission checklist

- [ ] `https://www.tradewithshaffy.com/privacy` loads and shows the full policy
- [ ] Fresh AAB: `cd mobile` → `eas build --platform android --profile production` (the old SDK 52 AAB must not be shipped)
- [ ] App icon uploaded (`icon-512.png`)
- [ ] Feature graphic uploaded (`feature-graphic-1024x500.png`)
- [ ] 5 phone screenshots uploaded (`01`–`05`, 1080×1920)
- [ ] Short + full description filled (no prices in the description)
- [ ] Privacy policy URL set
- [ ] Content rating completed honestly (community = user interaction)
- [ ] Target audience set to **18+**
- [ ] Data safety form completed, including the delete-account URL
- [ ] Financial features declaration answered with the educational-content disclosure
- [ ] App access uses the dedicated **reviewer account** (approved, PREMIUM plan), not admin
- [ ] AAB uploaded manually to **Closed testing** (or Internal testing) and testers invited
- [ ] If required: 12+ testers opted in for 14 days → apply for production access
- [ ] Production release created → **Send for review**

Google reviewers will install the app, log in with the reviewer account, look
through the screens, and check the privacy policy URL. Reviews usually take a
few days, sometimes up to a week for a new app.
