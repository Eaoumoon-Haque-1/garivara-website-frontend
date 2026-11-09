import apiClient from '../api/apiClient'

export async function getVehicleTypes({ signal } = {}) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL

  if (!baseUrl) {
    throw new Error('The backend API URL is not configured.')
  }

  const { data } = await apiClient.get(`${baseUrl}/vehical-type-info`, {
    signal,
  })

  if (data?.status !== 'success' || !Array.isArray(data.data)) {
    throw new Error(data?.message || 'Unable to load vehicle types.')
  }

  return data.data
}