const express = require('express');
const router = express.Router();
const { 
    registerDonor, 
    loginDonor, 
    getDonorProfile, 
    updateDonorProfile ,
    forgotPassword,
    resetPassword
} = require('../controllers/Donor.controller'); // Ensure file name matches your controller file

// Import Auth Middleware
const { protect } = require('../middleware/authMiddleware'); 

// ==========================================
// Public Routes
// ==========================================
router.post('/register', registerDonor);
router.post('/login', loginDonor);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// ==========================================
// Private Routes (Donor must be logged in)
// ==========================================
router.route('/profile')
    .get(protect, getDonorProfile)      // View Profile
    .put(protect, updateDonorProfile);  // Update Profile (including availability)

module.exports = router;