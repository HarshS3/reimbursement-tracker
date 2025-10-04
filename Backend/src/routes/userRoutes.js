const express = require('express');
const userController = require('../controllers/userController');
const { auth, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.use(auth());
router.use(requireRole('Admin'));

router.get('/', userController.listUsers);
router.post('/', userController.createUser);
router.patch('/:id', userController.updateUser);

module.exports = router;
