const express = require('express');
const router = express.Router();
const { 
    createRequest,
    getUserRequests,
    getAllRequests,
    getRequestById,
    updateRequestStatus,
    deleteRequest,
    getMatchingRequests,
    scheduleDonation,
    getDonorHistory,
    createHospitalRequest
} = require('../controllers/BloodRequest.Controller');

const { protect } = require('../middleware/authMiddleware');

// --- 1. SPECIFIC ROUTES (Must come first) ---
router.post('/create', protect, createRequest);
router.get('/my-requests', protect, getUserRequests);
router.get('/all', protect, getAllRequests);
router.put('/schedule/:id', protect, scheduleDonation);
// ✅ FIX: Put this route BEFORE the /:id route
router.get('/matching', protect, getMatchingRequests); 
router.get('/donor-history', protect, getDonorHistory);
// --- 2. DYNAMIC ROUTES (Must come last) ---
// If you put this first, Express thinks "matching" is an ":id"
router.get('/:id', protect, getRequestById); 
router.put('/:id/status', protect, updateRequestStatus);
router.delete('/:id', protect, deleteRequest);
router.post('/hospital-request', protect, createHospitalRequest);
module.exports = router;