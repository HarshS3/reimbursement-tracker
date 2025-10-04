const express = require('express');
const referenceController = require('../controllers/referenceController');

const router = express.Router();

router.get('/countries', referenceController.listCountries);
router.get('/convert', referenceController.convertCurrency);
router.get('/expenses/metadata', referenceController.getExpenseMetadata);

module.exports = router;
