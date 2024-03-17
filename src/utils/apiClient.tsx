import axios from "axios";

const BASE_URL = "https://94f2-171-76-83-95.ngrok-free.app";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});
