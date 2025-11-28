const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile 
} = require('../controllers/User.Controller');

// Import your Auth Middleware (to protect routes)
const { protect } = require('../middleware/authMiddleware'); 

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private Routes (User must be logged in)
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;