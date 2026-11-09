const pendingBookingStorageKey = 'vehicleSearch.pendingBooking'

export function isValidPendingBooking(
  booking,
  { requirePayment = false } = {},
) {
  const vehicleId = Number(booking?.vehicle?.id)
  const fare = Number(booking?.approximateFare)
  const paymentIsValid = ['cash', 'digital'].includes(booking?.payMode)

  return Boolean(
    booking &&
      Number.isInteger(vehicleId) &&
      vehicleId > 0 &&
      Number.isFinite(fare) &&
      fare >= 0 &&
      typeof booking.note === 'string' &&
      booking.note.length <= 600 &&
      (!requirePayment || paymentIsValid) &&
      (requirePayment || booking.payMode === '' || paymentIsValid),
  )
}

export function getPendingBooking() {
  try {
    const storedBooking = localStorage.getItem(pendingBookingStorageKey)
    if (!storedBooking) return null

    const booking = JSON.parse(storedBooking)
    if (isValidPendingBooking(booking)) return booking

    clearPendingBooking()
    return null
  } catch {
    clearPendingBooking()
    return null
  }
}

export function savePendingBooking(booking) {
  localStorage.setItem(pendingBookingStorageKey, JSON.stringify(booking))
}

export function clearPendingBooking() {
  localStorage.removeItem(pendingBookingStorageKey)
}