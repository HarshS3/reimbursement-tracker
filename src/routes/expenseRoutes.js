const express = require('express');
const expenseController = require('../controllers/expenseController');
const { auth, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.use(auth());

router.get('/', expenseController.listExpenses);
router.get('/:id', expenseController.getExpense);
router.post('/', requireRole('Employee', 'Admin'), expenseController.createExpense);
router.patch('/:id', requireRole('Employee', 'Admin'), expenseController.updateExpense);

module.exports = router;
