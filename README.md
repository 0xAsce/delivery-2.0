# Hanout Direct — B2B FMCG Ordering Pilot

A lightweight Next.js App Router pilot for shop owners ordering FMCG stock from one distributor.

## Included

- Existing catalog, categories, search, cart, reorder, order tracking and history
- French / Arabic toggle with RTL layout
- Shop credit balance on home and checkout
- Delivery settlement: paid in full, partial payment, or added to credit
- Separate ledger payments for old credit
- Distributor Shop Balances screen sorted by highest balance first
- Daily dashboard: orders, order value, outstanding credit
- Order status filtering and shop/order search
- Delivery notes on orders
- Paid / partial / unpaid / credit badges in order history
- Product creation with image upload or image URL
- In/out-of-stock and manual low-stock flags
- Bulk product price/stock/low-stock editing
- Lightweight responsive UI designed for small screens and slower connections
- Abstracted `lib/store.js` data layer
- Next.js API route contracts under `app/api/` for future backend migration

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Distributor password for the pilot: `pilot2026`.

## Data

The current pilot stores its working dataset in browser localStorage so it can run without a database. `lib/store.js` isolates the data operations. The project also includes API route contracts so the same UI model can later be moved to Prisma/Postgres.

For production, replace the local repository with a server-side repository and authentication; do not use the demo admin password.


## Seller account management

The seller portal is available at `/seller/register` and `/seller/login`.

Implemented:
- Seller registration, login and logout
- Password hashing with Node `scrypt` (no plaintext passwords)
- Password reset token flow
- Email verification token flow
- Phone verification code flow
- Optional TOTP two-factor authentication
- Seller profile with store name, logo, cover photo, description, address, latitude/longitude, delivery radius, opening hours, contact details and tax information
- Store status: `OPEN`, `BUSY`, `CLOSED`, `VACATION`
- HttpOnly, database-backed seller sessions
- Seller-only API authorization

### Database setup

The seller system uses the existing Prisma/PostgreSQL setup. Copy `.env.example` to `.env`, set `DATABASE_URL`, then run:

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

Email and SMS delivery are intentionally provider-neutral in this pilot. In development, verification/reset links and phone codes are returned by the API or logged to the server console. For production, connect the marked flows to your email/SMS provider before exposing them publicly.

Images are stored as data URLs for the pilot and capped at roughly 1.4 MB per image. For production, move logo/cover uploads to object storage (S3/R2/Supabase Storage, etc.) and store only the URL in PostgreSQL.

Seller sessions are independent from the existing customer/distributor demo localStorage flow, so adding the seller portal does not remove the pilot ordering UI.
