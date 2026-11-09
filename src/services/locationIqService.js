import apiClient from '../api/apiClient'

const LOCATION_IQ_AUTOCOMPLETE_URL = 'https://api.locationiq.com/v1/autocomplete'

export async function searchLocations(query, { signal } = {}) {
  const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY

  if (!apiKey) {
    throw new Error('LocationIQ API key is not configured.')
  }

  const { data } = await apiClient.get(LOCATION_IQ_AUTOCOMPLETE_URL, {
    signal,
    params: {
      key: apiKey,
      q: query,
      format: 'json',
      limit: 5,
      dedupe: 1,
      countrycodes: 'bd',
      addressdetails: 1,
    },
  })

  return data.map((place) => ({
    placeId: String(place.place_id),
    displayAddress: place.display_name,
    latitude: Number(place.lat),
    longitude: Number(place.lon),
  }))
}
