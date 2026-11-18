const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const { checkAuth, checkAdmin } = require('../middlewares/auth.middleware');

router.post('/sign-up', controller.signUp);
router.post('/login', controller.login);

router.get('/', checkAuth, checkAdmin, controller.getAllUsers);
router.put('/:id', checkAuth, controller.updateUser);
router.patch('/:id/borrow', checkAuth, controller.borrowBook);

module.exports = router;