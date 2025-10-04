const referenceService = require('../services/referenceService');
const asyncHandler = require('../utils/asyncHandler');

const listCountries = asyncHandler(async (req, res) => {
  const countries = await referenceService.getCountries();
  res.json({ success: true, countries });
});

module.exports = {
  listCountries,
};
