const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const ruleRoutes = require('./ruleRoutes');
const expenseRoutes = require('./expenseRoutes');
const approvalRoutes = require('./approvalRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/rules', ruleRoutes);
router.use('/expenses', expenseRoutes);
router.use('/approvals', approvalRoutes);

module.exports = router;
