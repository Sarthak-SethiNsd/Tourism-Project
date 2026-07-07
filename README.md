# India Tourism Discovery

Phase 1 foundation for a premium, mobile-first tourism discovery platform for India.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Framer Motion
- Zustand
- Firebase Authentication and Firestore

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill the `NEXT_PUBLIC_FIREBASE_*` values in `.env.local` before using Firebase-backed authentication or database services.

## Architecture

The app is organized around feature boundaries under `src/features`.

- `authentication`
- `tourism`
- `maps`
- `saved-places`
- `user`
- `settings`
- `ai`

AI is intentionally isolated for future Version 2 work. The website foundation should remain fully functional without AI services.
