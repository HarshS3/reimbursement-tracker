const referenceService = require('../services/referenceService');
const asyncHandler = require('../utils/asyncHandler');

const listCountries = asyncHandler(async (req, res) => {
  const countries = await referenceService.getCountries();
  res.json({ success: true, countries });
});

const convertCurrency = asyncHandler(async (req, res) => {
  const { amount, from, to } = req.query;
  const result = await referenceService.convertCurrency(amount, from, to);
  res.json(result);
});

const getExpenseMetadata = asyncHandler(async (req, res) => {
  const metadata = referenceService.getExpenseMetadata();
  res.json({ success: true, metadata });
});

module.exports = {
  listCountries,
  convertCurrency,
  getExpenseMetadata,
};
