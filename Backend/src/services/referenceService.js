const fetch = require('node-fetch');
const AppError = require('../utils/errors');

const REST_COUNTRIES_URL = 'https://restcountries.com/v3.1/all?fields=name,currencies';
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

let cachedResponse = null;
let cacheExpiresAt = 0;

function mapCountries(rawCountries) {
  return rawCountries.map((country) => {
    const commonName = country?.name?.common || null;
    const officialName = country?.name?.official || null;
    const currencies = country?.currencies
      ? Object.entries(country.currencies).map(([code, currency]) => ({
          code,
          name: currency?.name || null,
          symbol: currency?.symbol || null,
        }))
      : [];

    return {
      name: commonName || officialName,
      officialName,
      currencies,
    };
  });
}

async function fetchCountriesFromSource() {
  let response;

  try {
    response = await fetch(REST_COUNTRIES_URL, {
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (err) {
    throw AppError.serviceUnavailable('Unable to reach country metadata service');
  }

  if (!response.ok) {
    throw AppError.badGateway(`Country metadata service responded with status ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw AppError.badGateway('Unexpected response from country metadata service');
  }

  return mapCountries(payload);
}

async function getCountries() {
  const now = Date.now();
  if (cachedResponse && cacheExpiresAt > now) {
    return cachedResponse;
  }

  const countries = await fetchCountriesFromSource();
  cachedResponse = countries;
  cacheExpiresAt = now + CACHE_TTL_MS;
  return countries;
}

module.exports = {
  getCountries,
};
