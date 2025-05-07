// utils/amadeusAuth.js
import "dotenv/config";
import axios from "axios";
import qs from "qs";

let cachedToken = null;
let tokenExpiry = 0;

/**
 * getAmadeusToken
 * Returns a valid Amadeus access token, fetching a new one if expired.
 */
async function getAmadeusToken() {
  const now = Date.now();

  // Return cached token if not expired
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  // Prepare form data payload
  const payload = qs.stringify({
    grant_type: "client_credentials",
    client_id: process.env.AMADEUS_API_KEY,
    client_secret: process.env.AMADEUS_API_SECRET,
  });

  // Request a new token
  const response = await axios.post(process.env.AMADEUS_AUTH_URL, payload, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const { access_token, expires_in } = response.data;

  // Cache token and compute expiry timestamp
  cachedToken = access_token;
  tokenExpiry = now + expires_in * 1000;

  return cachedToken;
}

export { getAmadeusToken };
