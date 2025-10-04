const fetch = require('node-fetch');
const AppError = require('../utils/errors');

const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const cache = new Map();

function normalizeCurrency(code) {
  if (!code || typeof code !== 'string') {
    throw AppError.badRequest('Currency code is required');
  }
  return code.trim().toUpperCase();
}

function roundToTwo(value) {
  return Math.round(Number(value) * 100) / 100;
}

async function fetchRates(baseCurrency) {
  const normalizedBase = normalizeCurrency(baseCurrency);
  const cacheEntry = cache.get(normalizedBase);
  const now = Date.now();

  if (cacheEntry && cacheEntry.expiresAt > now) {
    return cacheEntry.rates;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${normalizedBase}`, {
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (err) {
    throw AppError.serviceUnavailable('Unable to reach currency conversion service');
  }

  if (!response.ok) {
    throw AppError.badGateway(`Currency conversion service responded with status ${response.status}`);
  }

  let payload;
  try {
    payload = await response.json();
  } catch (err) {
    throw AppError.badGateway('Invalid response from currency conversion service');
  }

  if (!payload || typeof payload !== 'object' || typeof payload.rates !== 'object') {
    throw AppError.badGateway('Currency conversion service returned unexpected data');
  }

  cache.set(normalizedBase, {
    rates: payload.rates,
    expiresAt: now + CACHE_TTL_MS,
  });

  return payload.rates;
}

async function convertAmount(amount, fromCurrency, toCurrency) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    throw AppError.badRequest('Amount must be a valid number');
  }

  const normalizedFrom = normalizeCurrency(fromCurrency);
  const normalizedTo = normalizeCurrency(toCurrency);

  const numericAmount = Number(amount);

  if (normalizedFrom === normalizedTo) {
    return {
      convertedAmount: roundToTwo(numericAmount),
      rate: 1,
    };
  }

  const rates = await fetchRates(normalizedTo);
  const rate = rates[normalizedFrom];

  if (!rate) {
    throw AppError.badRequest(`Currency ${normalizedFrom} is not supported by exchange service`);
  }

  const convertedAmount = roundToTwo(numericAmount / rate);
  return {
    convertedAmount,
    rate: convertedAmount / numericAmount,
  };
}

function clearCache() {
  cache.clear();
}

module.exports = {
  convertAmount,
  clearCache,
};
