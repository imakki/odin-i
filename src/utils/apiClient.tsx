import axios from "axios";

// Define the base URL
const BASE_URL = "https://cither.staging.chatginie.com";

// Function to dynamically get the access token from local storage
function getAccessToken() {
  // Update '2gh350bk1thbt7j6etfuodvli2' with the correct key prefix for your app's users
  const userKeyPrefix = "CognitoIdentityServiceProvider.2gh350bk1thbt7j6etfuodvli2";
  const userKeys = Object.keys(localStorage).filter(k => k.startsWith(userKeyPrefix) && k.includes(".idToken"));

  if (userKeys.length === 0) {
    console.warn("No access token found in local storage.");
    return null;
  }

  // Assuming the first key found is the correct one
  return localStorage.getItem(userKeys[0]);
}

// Create the axios instance with the base URL
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});

// Interceptor to add the Authorization header to each request dynamically
apiClient.interceptors.request.use(
  config => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);
