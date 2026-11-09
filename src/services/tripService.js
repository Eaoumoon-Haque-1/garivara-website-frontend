import authApiClient from '../api/authApiClient'
import { createTripPayload } from '../features/booking/utils/tripPayload'

function getTripList(payload) {
  const candidates = [
    payload?.data?.data,
    payload?.data?.trips,
    payload?.data,
    payload?.trips,
    payload,
  ]

  return candidates.find(Array.isArray) || []
}

function getCreatedTripId(payload) {
  const candidates = [
    payload?.data?.trip_info?.id,
    payload?.data?.trip_id,
    payload?.data?.tripId,
    payload?.data?.id,
    payload?.trip_id,
    payload?.tripId,
    payload?.id,
    typeof payload?.data === 'number' || typeof payload?.data === 'string'
      ? payload.data
      : null,
  ]

  return candidates.find(
    (value) => value !== null && value !== undefined && String(value).trim(),
  )
}

export async function createTrip(booking, searchCriteria) {
  const payload = createTripPayload(booking, searchCriteria)
  const { data } = await authApiClient.post('/trip_info/create', payload)

  if (data?.status !== 'success') {
    throw new Error(data?.message || 'Unable to create the trip.')
  }

  const tripId = getCreatedTripId(data)
  if (!tripId) {
    throw new Error('Trip created, but the response did not include a trip ID.')
  }

  return { data, tripId }
}
export async function getPassengerTrips({ signal } = {}) {
  const { data } = await authApiClient.get('/trip_info/passenger', { signal })

  if (data?.status && data.status !== 'success') {
    throw new Error(data?.message || 'Unable to load your trips.')
  }

  return getTripList(data)
}