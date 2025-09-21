const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact
} = require('../../controllers/getQuote');

// Public routes
router.post('/', createContact);

// Protected routes (add authentication middleware as needed)
router.get('/', getContacts);
router.get('/:id', getContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;