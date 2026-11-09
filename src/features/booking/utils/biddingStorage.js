const biddingSessionStorageKey = 'vehicleSearch.biddingSession'
const approvedTripsStorageKey = 'vehicleSearch.approvedTrips'

export function saveBiddingSession(session) {
  localStorage.setItem(biddingSessionStorageKey, JSON.stringify(session))
}

export function getBiddingSession(tripId) {
  try {
    const storedSession = localStorage.getItem(biddingSessionStorageKey)
    if (!storedSession) return null

    const session = JSON.parse(storedSession)
    if (String(session?.tripId) !== String(tripId)) return null
    if (!Number.isFinite(Number(session?.startedAt))) return null

    return session
  } catch {
    return null
  }
}

export function clearBiddingSession() {
  localStorage.removeItem(biddingSessionStorageKey)
}
function getApprovedTrips() {
  try {
    const value = JSON.parse(localStorage.getItem(approvedTripsStorageKey))
    return value && typeof value === 'object' ? value : {}
  } catch {
    return {}
  }
}

export function markTripBidApproved(tripId, bidId) {
  const approvedTrips = getApprovedTrips()
  approvedTrips[String(tripId)] = { bidId, approvedAt: Date.now() }
  localStorage.setItem(approvedTripsStorageKey, JSON.stringify(approvedTrips))
}

export function getApprovedTripBid(tripId) {
  return getApprovedTrips()[String(tripId)] || null
}