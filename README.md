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

### Mappls setup

Tourism search, autocomplete, nearby places, geocoding, and routing use Mappls REST APIs through the existing tourism provider layer. Add your Mappls Console **Static Key** as the server-side `MAPPLS_STATIC_KEY` in `.env.local`; do not expose it with a `NEXT_PUBLIC_` prefix. The provider sends that Static Key in Mappls' required `access_token` query parameter. The app continues to show its local catalogue when the Static Key is absent.

The project does not require a Mappls JavaScript SDK because it does not render an embedded map. Enable the required REST products in the Mappls Developer Console and copy the Static Key from the application's Credentials tab. No OAuth flow, bearer token, client ID, client secret, or token refresh is used.

Routing uses Mappls' documented `route_adv/{profile}/{coordinates}` REST path together with the same Static Key. `route_adv` is the documented route licence/resource segment, not a second secret or an additional environment variable.

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
