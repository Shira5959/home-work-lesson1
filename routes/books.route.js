const express = require('express');
const router = express.Router();
const controller = require('../controllers/books.controller');
const validate = require('../middlewares/validate.middleware');
const uploadImage = require('../middlewares/upload.middleware');
const { bookJoi } = require('../models/book.model');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validate(bookJoi.create), controller.add);
router.put('/:id', validate(bookJoi.update), controller.update);
router.delete('/:id', controller.remove);
router.post('/:id/image', uploadImage, controller.uploadImage);

module.exports = router;