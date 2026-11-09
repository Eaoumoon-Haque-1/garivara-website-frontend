import apiClient from '../api/apiClient'

const osrmRouteUrl = 'https://router.project-osrm.org/route/v1/driving'

function formatCoordinate({ latitude, longitude }) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Valid pickup and drop-off coordinates are required.')
  }

  return `${longitude},${latitude}`
}

export async function getRouteSummary(
  pickup,
  dropoff,
  tripType,
  { signal } = {},
) {
  const locations =
    tripType === 'roundTrip'
      ? [pickup, dropoff, pickup]
      : [pickup, dropoff]
  const coordinates = locations.map(formatCoordinate).join(';')

  const { data } = await apiClient.get(`${osrmRouteUrl}/${coordinates}`, {
    signal,
    timeout: 30000,
    params: {
      overview: false,
      steps: false,
    },
  })

  if (data?.code !== 'Ok' || !data.routes?.length) {
    throw new Error(data?.message || 'No driving route was found.')
  }

  const route = data.routes[0]

  return {
    distanceMeters: route.distance,
    distanceKm: route.distance / 1000,
    durationSeconds: route.duration,
    durationMinutes: route.duration / 60,
  }
}