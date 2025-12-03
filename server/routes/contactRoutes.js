const express = require('express');
const router = express.Router();
const { submitContact, getAllMessages, deleteMessage } = require('../controllers/Contact.Controller');
const { protect } = require('../middleware/authMiddleware');

// Public
router.post('/', submitContact);

// Admin Only
router.get('/all', protect, getAllMessages);
router.delete('/:id', protect, deleteMessage);

module.exports = router;