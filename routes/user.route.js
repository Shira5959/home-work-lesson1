const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');

router.get('/', controller.getAllUsers);
router.post('/sign-up', controller.signUp);
router.post('/login', controller.login);

module.exports = router;