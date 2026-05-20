# Trade with Shafy — Mobile App (Expo / React Native)

Native iOS + Android client for the **Trade with Shafy** platform. Built with
Expo (managed workflow), expo-router, TypeScript, React Query and
expo-secure-store. Talks to the existing Next.js backend through the new
`/api/mobile/*` token endpoints and the shared `getAuthSession` resolver
that lets every existing API route accept a Bearer token.

> **Repo layout** — the Next.js web app lives at the repo root and is
> unchanged. This Expo app lives only in `mobile/`.

## What's inside

```
mobile/
  app/                       # expo-router file-based navigation
    (auth)/login, register, pending
    (app)/(tabs)/research, community, signals, classroom, profile
    (app)/research/[id], community/[id], community/new,
          classroom/[courseId], signals-history,
          live, calendar, brokers, resources, watchlist, calculator,
          notifications, reviews, order,
          affiliate/index, affiliate/withdraw, affiliate/commissions
    (admin)/index, users, signals, research, courses, sessions,
            calendar, brokers, resources, reviews, sales, affiliates,
            withdrawals, payments
  src/
    api/client.ts             # fetch wrapper + bearer + auto-refresh interceptor
    api/tokenStore.ts         # expo-secure-store
    api/hooks.ts              # useApi / useApiMutation (react-query)
    auth/AuthContext.tsx      # session bootstrap, signIn/signOut/register
    components/               # Screen, Card, Button, Field, Select, SignalCard, …
    lib/push.ts               # request permission, post Expo token to /api/mobile/devices
    lib/refcode.ts            # tradewithshafy://ref/<code> deep-link capture
    lib/gating.ts             # plan / tier / premium gating
    lib/format.ts             # ports of web lib/utils formatters + SERVICES
    theme.ts                  # exact colors from the web design
    types.ts                  # shared TS types
  app.config.ts               # Expo config (name, bundle ids, plugins, scheme)
  eas.json                    # build profiles
  package.json                # Expo SDK 52
```

## Prerequisites

- Node 18+
- `npm` or `pnpm`
- The Next.js backend running with the new mobile auth layer (`/api/mobile/*`)
- For builds: an Expo account + [EAS CLI](https://docs.expo.dev/build/setup/)
  `npm i -g eas-cli`

## Run in development

```bash
cd mobile
npm install
cp .env.example .env       # then edit EXPO_PUBLIC_API_URL
npm run start              # opens the Expo dev tools
# or
npm run android            # Android emulator / physical device with dev client
npm run ios                # iOS simulator (macOS only)
```

### API base URL

The dev client doesn't share `localhost` with your machine, so set
`EXPO_PUBLIC_API_URL` accordingly:

| Target              | Recommended value                       |
|---------------------|-----------------------------------------|
| iOS Simulator       | `http://localhost:3000`                 |
| Android Emulator    | `http://10.0.2.2:3000`                  |
| Physical device     | `http://<your-LAN-IP>:3000`             |
| Production          | `https://your-domain.com`               |

`app.config.ts` reads this via `expo-constants` and exposes it as
`Constants.expoConfig.extra.apiUrl` (used by `src/api/client.ts`).

### App icons / splash (placeholders)

`app.config.ts` references the standard icon/splash paths:

- `./assets/icon.png` (1024×1024)
- `./assets/splash.png` (1242×2436)
- `./assets/adaptive-icon.png` (1024×1024, Android)
- `./assets/notification-icon.png` (96×96, transparent, Android)

Drop final art at those paths before submitting to the stores. While
developing without them, Expo will warn and fall back to defaults.

## Test the backend token layer (curl)

```bash
# Login
curl -s -X POST $BASE/api/mobile/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"admin123"}'

# Use the token on any existing route
curl -s $BASE/api/signals \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Refresh
curl -s -X POST $BASE/api/mobile/auth/refresh \
  -H 'Content-Type: application/json' \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"
```

## Push notifications

1. **Inside the app** — on successful sign-in `src/lib/push.ts` is invoked
   from the root layout. It requests permission, asks Expo for the device
   push token, and POSTs `{ expoPushToken, platform }` to
   `/api/mobile/devices`. The token is stored in the `DeviceToken` Prisma
   table.

2. **From the server** — the helpers in `lib/push.ts` (in the web app)
   call the Expo push API. They are wired into:
   - `POST /api/signals` (new signal → broadcast)
   - `PATCH /api/signals` (signal closed → broadcast)
   - `PATCH /api/live` (session goes live → broadcast)
   - `lib/notify.ts → createNotification(...)` (per-user push +
     `Notification` row). This is what the withdrawals, sales and payments
     admin routes now call.

3. **Tap behaviour** — `app/_layout.tsx` registers
   `Notifications.addNotificationResponseReceivedListener` which reads the
   `data.link` payload and deep-links into the right screen.

### Manual push test

```bash
# Grab a device's Expo token from the DeviceToken table, then:
curl -H "Content-Type: application/json" -X POST \
  https://exp.host/--/api/v2/push/send \
  -d '{
    "to":"ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "sound":"default",
    "title":"Test",
    "body":"Hello from Expo",
    "data":{"link":"/signals"}
  }'
```

(That's the same request `lib/push.ts` makes in the backend.)

## EAS Build (App Store + Google Play)

1. `npx eas-cli login`
2. `npx eas-cli init` (once, to create a project and write `extra.eas.projectId`)
3. Update `eas.json` env vars per profile.
4. Builds:

```bash
# Internal preview .apk for Android testers
npx eas-cli build --profile preview --platform android

# Production builds
npx eas-cli build --profile production --platform android
npx eas-cli build --profile production --platform ios
```

5. Submit to stores:

```bash
npx eas-cli submit --platform android
npx eas-cli submit --platform ios
```

iOS requires an Apple Developer account; Android requires a Google Play
Console account and a signed service key (EAS prompts you on first
submit).

## Typecheck

```bash
cd mobile
npm run typecheck
```

## Backend changes summary (Part 1)

Added (no breaking changes to the web app):

- **Prisma** — new models `MobileRefreshToken`, `DeviceToken`
  (`prisma/schema.prisma`, applied via `npx prisma db push`; SQL recorded
  at `prisma/migrations_mobile_auth.sql`).
- **Shared session resolver** — `lib/mobile-auth.ts` (`getAuthSession(req)`)
  that returns the same shape as `getServerSession(authOptions)`, accepts
  EITHER the existing NextAuth cookie OR a `Authorization: Bearer …`
  header. Every existing `app/api/**` route was updated to use it.
- **Mobile auth endpoints**:
  - `POST /api/mobile/auth/login` (rate-limited, 8/min/IP+user)
  - `POST /api/mobile/auth/refresh` (single-use rotation)
  - `POST /api/mobile/auth/logout`
  - `GET  /api/mobile/auth/me`
  - `POST /api/mobile/devices` / `DELETE` (Expo push token registry)
  - `GET  /api/mobile/profile` (profile + certs + sales/earnings bundle)
  - `GET  /api/mobile/affiliate` (affiliate dashboard bundle)
  - `GET  /api/mobile/affiliate/commissions`
- **Push** — `lib/push.ts` (Expo push wrapper), `lib/notify.ts`
  (persist Notification + send push). Wired into signals, live and the
  three admin notification sites.
- **Tokens** — short-lived (15 min) signed JWT access tokens using
  `NEXTAUTH_SECRET`; 30-day opaque refresh tokens persisted as SHA-256
  hashes. Never logged.

## Roles & routing

- `ADMIN` → `(admin)` stack (bypasses the bottom tabs)
- `USER` / `AFFILIATE` with `status === 'APPROVED'` → `(app)/(tabs)/…`
- Anyone without `APPROVED` status → `(auth)/pending`
- Logged out → `(auth)/login`

Handled in `app/_layout.tsx` `RootNavigator` via `useSegments` + `useAuth`.

## Design system

All colors, spacing and radii live in `src/theme.ts` and mirror the web
app exactly — `#0a0a0f` background, `#111118` cards, `#f5c518` gold,
`#00c851` green, `#ff4444` red, `rgba(245,197,24,0.1)` borders. The
center "LIVE Signals" FAB pulses (Animated loop) and is rendered by a
custom tab bar at `app/(app)/(tabs)/_layout.tsx`.
