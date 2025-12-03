const express = require('express');
const router = express.Router();
const { 
    registerHospital, 
    loginHospital, 
    getHospitalProfile, 
    updateHospitalProfile,
     forgotPassword,
    resetPassword,
    getAllHospitals,
    createHospitalRequest,
    updateInventory,
    getHospitalRequests
} = require('../controllers/Hospital.controller'); // Ensure filename matches your controller file

// Import Auth Middleware
const { protect } = require('../middleware/authMiddleware'); 

// ==========================================
// Public Routes
// ==========================================
router.post('/register', registerHospital);
router.post('/login', loginHospital);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// ==========================================
// Private Routes (Hospital must be logged in)
// ==========================================
router.route('/profile')
    .get(protect, getHospitalProfile)      // View Hospital Profile & Inventory
    .put(protect, updateHospitalProfile);  // Update Profile & Inventory
router.get('/all', protect, getAllHospitals);
router.post('/hospital-request', protect, createHospitalRequest);
router.put('/inventory', protect, updateInventory);
router.get('/my-requests', protect, getHospitalRequests);
module.exports = router;