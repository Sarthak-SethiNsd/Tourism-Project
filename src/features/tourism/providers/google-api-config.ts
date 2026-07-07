export function getGoogleApiKey() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();

  return apiKey || undefined;
}

export function hasGoogleApiKey() {
  return Boolean(getGoogleApiKey());
}
