const express = require('express');
const ruleController = require('../controllers/ruleController');
const { auth, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.use(auth());
router.use(requireRole('Admin'));

router.get('/', ruleController.listRules);
router.post('/', ruleController.createRule);
router.post('/:id/approvers', ruleController.addApprovers);

module.exports = router;
