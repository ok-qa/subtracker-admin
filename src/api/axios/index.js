import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: `${apiUrl}/api/`,
  timeout: 1000 * 20,
  withCredentials: true,
});
