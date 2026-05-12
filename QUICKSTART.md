# Trade with Shafy — Quick Start

## Run the project
```
cd C:\Users\hp\Desktop\TraderPlatform
npm run dev
```
Open: http://localhost:3000

## Admin Login
- URL: http://localhost:3000/login
- Username: `admin`
- Password: `admin123`

## Database
```
npm run db:push      # push schema changes
npm run db:studio    # open Prisma Studio (GUI)
npm run db:seed      # re-seed sample data
```

## Platform Map

| URL | Description |
|-----|-------------|
| `/landing` | Public landing page |
| `/login` | Sign in |
| `/register` | Affiliate registration |
| `/order` | Buy a plan |
| `/reviews` | Public reviews |
| `/research` | Market analysis posts |
| `/signals` | Live BUY/SELL signals |
| `/signals/history` | Signal track record |
| `/classroom` | Video courses |
| `/community` | Trader community |
| `/live` | Live sessions |
| `/calendar` | Economic calendar |
| `/watchlist` | TradingView live prices |
| `/calculator` | Risk/position size tool |
| `/brokers` | Recommended brokers |
| `/resources` | PDF library |
| `/profile` | User profile + certificates |
| `/affiliate` | Affiliate dashboard |
| `/admin` | Admin panel |

## Tech Stack
- **Framework:** Next.js 15 (App Router) + TypeScript
- **Database:** PostgreSQL (Neon) via Prisma ORM
- **Auth:** NextAuth.js (credentials)
- **Styling:** Tailwind CSS v4 + inline dark theme
