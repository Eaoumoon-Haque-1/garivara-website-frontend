import axios from "axios";
import { getStoredSessionToken } from "../features/auth/utils/authStorage";

const authApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

authApiClient.interceptors.request.use((config) => {
  const token = getStoredSessionToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default authApiClient;