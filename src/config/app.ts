export const appConfig = {
  name: "India Tourism Discovery",
  shortName: "India Travel",
  tagline: "Discover India with a foundation built for journeys.",
  description:
    "A premium, mobile-first tourism discovery platform scaffolded for authentication, saved places, maps, and future AI planning.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  heroImageAlt: "Sunrise over a scenic Indian travel landscape",
} as const;
