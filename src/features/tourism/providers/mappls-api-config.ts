export function getMapplsStaticKey() {
  const staticKey = process.env.MAPPLS_STATIC_KEY?.trim();

  return staticKey || undefined;
}

export function hasMapplsStaticKey() {
  return Boolean(getMapplsStaticKey());
}
