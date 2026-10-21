const controller = require('../controllers/books.controller');
router.get('/:code', controller.getByCode);