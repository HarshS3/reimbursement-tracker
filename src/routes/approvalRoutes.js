const express = require('express');
const approvalController = require('../controllers/approvalController');
const { auth, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.use(auth());
router.use(requireRole('Manager', 'Admin'));

router.get('/', approvalController.listApprovals);
router.patch('/:id', approvalController.decideApproval);

module.exports = router;
