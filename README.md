# India Tourism Discovery

India Tourism Discovery is a web application for finding places to visit across India and organizing them around real travel plans. It combines a curated local catalogue with optional Mappls-powered place services, then gives visitors and signed-in users tools to save, compare, revisit, and plan around destinations.

The experience begins with a state and district selection, continues through flexible exploration, and leads into detailed place pages with practical travel information.

## What you can do

- Browse destinations by state, district, category, budget, rating, and opening status.
- Search and sort places by rating, distance, popularity, recency, or name.
- Use distance-aware discovery when browser location access is available.
- Open detailed place pages with address, categories, photos, ratings, opening information, available reviews, nearby attractions, weather, and directions.
- Open destinations and routes in Mappls, using a current or manually entered origin and a driving, walking, or cycling preference.
- Compare up to three places side by side.
- Share a place link with the device share sheet or clipboard fallback.

## Discovery experience

The tourism catalogue covers Indian states, union territories, districts, categories, and featured destinations. Visitors can begin from the onboarding location choice or refine the Explore page directly.

Explore supports combined filters for category, minimum rating, price level, open-now status, distance, wishlist, visited places, and saved places. The selected filters persist for the browser session. Search history is recorded for signed-in users when they open a place from a search.

Place details bring together the information needed to evaluate a destination: location, category, image gallery when available, rating, opening information, reviews supplied by the data source, nearby attractions, current weather, and route estimates.

## Personal travel tools

| Tool | What it does |
| --- | --- |
| Saved places | Keeps account-based favorite places in Firebase. |
| Wishlist | Adds and removes places from a bucket list. |
| Visited places | Marks places as visited and records the visit date. |
| Recently viewed | Records recently opened places, with a maximum list size. |
| Collections | Creates named groups of places and lets you add, rename, or remove items. |
| Trip planner | Creates dated trips with notes and an ordered list of destinations. |
| Compare places | Keeps up to three selected places for side-by-side comparison. |
| Search history | Lists places opened from searches for signed-in users. |

Saved places and search history are account-based. Wishlist, visited places, recently viewed places, collections, and trips use Firebase for signed-in users and browser local storage for guests. Compare selections are stored in the browser.

## Authentication

You can explore as a guest without creating an account. Guest activity uses the device-local storage behavior described above.

The application also supports Google sign-in and email/password sign-in or sign-up through Firebase Authentication. After authentication, onboarding returns to location selection and account-backed features use the authenticated user.

To enable email/password forms, enable the **Email/Password** provider in Firebase Authentication. Google sign-in requires the **Google** provider to be enabled.

## External services

- **Mappls REST APIs** provide optional text search, autocomplete, place details, nearby search, geocoding, reverse geocoding, routing, and Mappls deep links. The local catalogue remains available when a Mappls Static Key is not configured.
- **Open-Meteo** provides current weather for places with coordinates. Weather results are cached during the session.
- **Firebase Authentication and Cloud Firestore** support authentication and account-backed personal data.
- **AI:** the application does not call an AI service or expose an AI user feature.

## Tech stack

- Next.js 15 with the App Router
- React 19 and TypeScript
- Tailwind CSS and shadcn/ui
- Framer Motion and Lucide icons
- Zustand
- Firebase Authentication and Cloud Firestore
- Mappls REST APIs

## Run locally

### Prerequisites

- Node.js and npm
- A Firebase project for authentication and account-backed data
- A Mappls application and Static Key for optional Mappls REST services

### Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Configure the Firebase web app values in `.env.local`:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Add the Mappls Static Key as the server-side value below. Do not expose it with a `NEXT_PUBLIC_` prefix.

```text
MAPPLS_STATIC_KEY
```

The Mappls provider sends the Static Key as the required `access_token` query parameter. It does not use OAuth, bearer tokens, a client secret, or an embedded Mappls JavaScript SDK.

### Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Project structure

```text
src/
├── app/                 # App Router routes
├── components/          # Shared layout and UI components
├── config/              # Application, route, and service configuration
├── features/            # Feature modules and tourism provider logic
├── services/firebase/   # Firebase client and Firestore helpers
├── stores/              # Shared client state
└── types/               # Shared TypeScript types
```

The `features` directory keeps discovery, authentication, personal travel tools, and provider integrations grouped by responsibility. `TourismService` is the shared boundary used by the UI for catalogue data, personal place actions, routing, weather, and location services.
