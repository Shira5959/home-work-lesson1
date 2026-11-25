const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const { checkAuth, checkAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { userJoi } = require('../models/user.model');

router.post('/sign-up', validate(userJoi.register), controller.signUp);
router.post('/login', validate(userJoi.login), controller.login);

router.get('/', checkAuth, checkAdmin, controller.getAllUsers);
router.put('/:id', checkAuth, validate(userJoi.update), controller.updateUser);
router.patch('/:id/borrow', checkAuth, validate(userJoi.borrow), controller.borrowBook);

module.exports = router;