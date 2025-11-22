import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!apiKey) {
  console.error("Google Maps API Key missing");
}

const LOADER_ID = '__GOOGLE_MAPS_LOADER_PROMISE__';

export const loadGoogleMaps = () => {
  if (window[LOADER_ID]) {
    return window[LOADER_ID];
  }

  setOptions({
    key: apiKey,
    v: "weekly",
  });

  console.log(`[GoogleMaps] Initializing Loader...`);

  window[LOADER_ID] = Promise.all([
    importLibrary("maps"),
    importLibrary("marker"),
    importLibrary("places"),
    importLibrary("geometry")
  ]).catch((error) => {
    console.error("[GoogleMaps] Failed to load libraries:", error);
    window[LOADER_ID] = null;
    throw error;
  });

  return window[LOADER_ID];
};