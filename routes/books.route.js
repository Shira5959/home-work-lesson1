const express = require('express');
const router = express.Router();
const controller = require('../controllers/books.controller');

router.get('/', controller.getAll);
router.get('/:code', controller.getByCode);
router.post('/', controller.add);
router.put('/:code', controller.update);
router.patch('/:code/borrow', controller.borrow);
router.patch('/:code/return', controller.giveBack);
router.delete('/:code', controller.remove);

module.exports = router;