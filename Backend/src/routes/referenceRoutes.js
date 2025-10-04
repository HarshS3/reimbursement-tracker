const express = require('express');
const referenceController = require('../controllers/referenceController');

const router = express.Router();

router.get('/countries', referenceController.listCountries);

module.exports = router;
