import axios from "axios";

const BASE_URL = "http://localhost:8000";
// get token from local storage
const accessToken = localStorage.getItem(
  "CognitoIdentityServiceProvider.2gh350bk1thbt7j6etfuodvli2.3a63fc8e-115a-4027-a765-8e3b430ca812.idToken"
);
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    Authorization: `Bearer ${accessToken}`,
  },
});
