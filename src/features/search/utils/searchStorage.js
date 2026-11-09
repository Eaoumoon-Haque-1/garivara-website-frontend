const vehicleSearchStorageKey = 'vehicleSearch.criteria'

function isValidDateTime(value) {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) &&
    !Number.isNaN(new Date(value).getTime())
  )
}

function isReturnAfterPickup(pickupDateTime, returnDateTime) {
  return (
    new Date(returnDateTime).getTime() > new Date(pickupDateTime).getTime()
  )
}

function isValidLocation(location) {
  return (
    location &&
    typeof location.displayAddress === 'string' &&
    location.displayAddress.trim().length > 0 &&
    Number.isFinite(location.latitude) &&
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    Number.isFinite(location.longitude) &&
    location.longitude >= -180 &&
    location.longitude <= 180
  )
}

export function isValidVehicleSearchCriteria(criteria) {
  if (!criteria || !['oneWay', 'roundTrip'].includes(criteria.tripType)) {
    return false
  }

  if (
    !isValidLocation(criteria.pickup) ||
    !isValidLocation(criteria.dropoff) ||
    !isValidDateTime(criteria.pickupDateTime)
  ) {
    return false
  }

  return (
    criteria.tripType === 'oneWay' ||
    (isValidDateTime(criteria.returnDateTime) &&
      isReturnAfterPickup(
        criteria.pickupDateTime,
        criteria.returnDateTime,
      ))
  )
}

export function getVehicleSearchCriteria() {
  try {
    const storedCriteria = localStorage.getItem(vehicleSearchStorageKey)
    if (!storedCriteria) return null

    const criteria = JSON.parse(storedCriteria)
    if (isValidVehicleSearchCriteria(criteria)) return criteria

    clearVehicleSearchCriteria()
    return null
  } catch {
    clearVehicleSearchCriteria()
    return null
  }
}

export function saveVehicleSearchCriteria(criteria) {
  localStorage.setItem(vehicleSearchStorageKey, JSON.stringify(criteria))
}

export function clearVehicleSearchCriteria() {
  localStorage.removeItem(vehicleSearchStorageKey)
}