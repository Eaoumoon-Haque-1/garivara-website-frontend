function splitDateTime(value) {
  const [date = null, time = null] = value?.split("T") || [];
  return { date: date || null, time: time || null };
}

function formatLocationName(value) {
  // return String(value || "").slice(0, 100);
        // return address.split(",")[0]?.trim() || address;
  return String(value || '').split(',')[0]?.trim() || String(value || '');
}

export function createTripPayload(booking, searchCriteria) {
  const travelStart = splitDateTime(searchCriteria.pickupDateTime);
  const travelReturn = splitDateTime(searchCriteria.returnDateTime);
  const isRoundTrip = searchCriteria.tripType === "roundTrip";

  return {
    request_type: searchCriteria.tripType,
    duration: searchCriteria.duration,
    distance: searchCriteria.distance,
    vehical_type_id: booking.vehicle.id,
    from_latitude: searchCriteria.pickup.latitude,
    from_longitude: searchCriteria.pickup.longitude,
    from_location_name: formatLocationName(
      searchCriteria.pickup.displayAddress,
    ),
    to_latitude: searchCriteria.dropoff.latitude,
    to_longitude: searchCriteria.dropoff.longitude,
    to_location_name: formatLocationName(searchCriteria.dropoff.displayAddress),
    via_latitude: null,
    via_longitude: null,
    via_location_name: null,
    travel_start_date: travelStart.date,
    travel_start_time: travelStart.time,
    travel_return_date: isRoundTrip ? travelReturn.date : null,
    travel_return_time: isRoundTrip ? travelReturn.time : null,
    approximate_fare: String(booking.approximateFare),
    note: booking.note?.trim() || null,
    pay_mode: booking.payMode?.trim() || null,
    promo_code: booking.promoCode?.trim() || null,
  };
}
