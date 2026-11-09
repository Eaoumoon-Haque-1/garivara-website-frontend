import authApiClient from "../api/authApiClient";

function getResponseData(response) {
  const payload = response?.data;
  const candidates = [
    payload?.data?.bids,
    payload?.data,
    payload?.bids,
    payload,
  ];
  return candidates.find(Array.isArray) || [];
}

export async function getPassengerBids(tripId, { signal } = {}) {
  const response = await authApiClient.get(
    `/trip-bid/passenger/${encodeURIComponent(tripId)}`,
    { signal },
  );

  return getResponseData(response);
}

export async function approveBid(bidId) {
  const { data } = await authApiClient.put(
    `/trip-bid/approve/${encodeURIComponent(bidId)}`,
    {
      is_approve: "YES",
    },
  );

  if (data?.status && data.status !== "success") {
    throw new Error(data?.message || "Unable to approve this bid.");
  }

  return data;
}
