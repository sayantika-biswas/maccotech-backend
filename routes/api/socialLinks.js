const express = require('express');
const router = express.Router();
const controller = require('../../controllers/socialLinkController');

// GET all social links
router.get('/', controller.getAll);

// GET single social link by ID
router.get('/:id', controller.getById);

// POST create single or multiple social links
router.post('/', controller.create);

// PUT update a social link
router.put('/:id', controller.update);

// DELETE single social link
router.delete('/:id', controller.delete);

// DELETE multiple social links
router.delete('/', controller.deleteMultiple);

module.exports = router;