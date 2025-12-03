const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin ,forgotPassword, resetPassword ,getAdminStats , getAllUsers ,getAllDonors ,getAllHospitals,updateHospitalStatus,deleteHospital,getAllRequestsAdmin,deleteRequestAdmin,updateAdminProfile} = require('../controllers/Admin.Controller');

// Public Routes
router.post('/register', registerAdmin); // In production, protect this!
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword); // New
router.post('/reset-password', resetPassword);   // New
router.get('/stats', getAdminStats); // Add protect middleware
router.get('/users', getAllUsers);
router.get('/donors', getAllDonors);
router.get('/hospitals', getAllHospitals);
router.put('/hospitals/:id/status', updateHospitalStatus);
router.delete('/hospitals/:id', deleteHospital);
router.get('/requests', getAllRequestsAdmin);
router.delete('/requests/:id', deleteRequestAdmin);
router.put('/profile', updateAdminProfile);
module.exports = router;