const express = require('express');
const router = express.Router();
const controller = require('../controllers/vehicles.controller');

router.get('/', controller.getAll);
router.get('/class/:id', controller.getByClass);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
