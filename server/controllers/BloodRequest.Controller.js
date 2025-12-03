const BloodRequest = require("../schemas/BloodRequestSchema");
const Donor = require("../schemas/DonerSchema")
const sendEmail = require("../utils/sendEmail");
const Hospital = require("../schemas/HospitalSchema");
// ==========================================
// @desc    Create a new Blood Request
// @route   POST /api/requests/create
// @access  Private (User)
// ==========================================
const createRequest = async (req, res) => {
    try {
        const {
            patientName, age, gender, bloodGroup, units, reason,
            hospitalName, doctorName, hospitalAddress, hospitalPhone,
            urgency
        } = req.body;

        const newRequest = await BloodRequest.create({
            requester: req.user._id, // Got from authMiddleware
            patientName,
            age,
            gender,
            bloodGroup,
            units,
            reason,
            hospitalName,
            doctorName,
            hospitalAddress,
            hospitalPhone,
            urgency,
            status: "Pending"
        });

        res.status(201).json({
            success: true,
            data: newRequest,
            message: "Blood Request Submitted Successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Get logged-in user's request history
// @route   GET /api/requests/my-requests
// @access  Private (User)
// ==========================================
const getUserRequests = async (req, res) => {
    try {
        // Find requests where requester ID matches logged-in user
        const requests = await BloodRequest.find({ requester: req.user._id })
            .populate("fulfilledBy", "fullName mobile email")

            .sort({ createdAt: -1 });
        res.json(requests);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Get ALL Pending Requests (For Donors/Admins)
// @route   GET /api/requests/all
// @access  Private (Donor/Admin)
// ==========================================
const getAllRequests = async (req, res) => {
    try {
        // Fetch only Pending or Urgent requests
        const requests = await BloodRequest.find({ status: { $ne: 'Cancelled' } })
            .populate("requester", "fullName mobile email") // Show user info
            .sort({ urgency: 1, createdAt: -1 }); // Critical first

        res.json(requests);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Get Single Request Details
// @route   GET /api/requests/:id
// @access  Private
// ==========================================
const getRequestById = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id)
            .populate("requester", "fullName mobile");

        if (request) {
            res.json(request);
        } else {
            res.status(404).json({ message: "Request not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Update Request Status (Cancel or Fulfill)
// @route   PUT /api/requests/:id/status
// @access  Private (User/Admin)
// ==========================================
const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body; 
        const request = await BloodRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const userId = req.user._id.toString();

        // Authorization Logic (User, Target Hospital, or Admin)
        const isRequester = request.requester.toString() === userId;
        const isTargetHospital = request.targetHospital && request.targetHospital.toString() === userId;

        if (!isRequester && !isTargetHospital) {
            return res.status(401).json({ message: "Not authorized to update this request" });
        }

        // --- FIX: Update Donor's Last Donation Date ---
        if (status === "Fulfilled" && request.fulfilledBy) {
            const donor = await Donor.findById(request.fulfilledBy);
            
            if (donor) {
                donor.lastDonationDate = new Date(); // Update Date
                
                // Optional: Increment total donations if you track it in schema
                // donor.totalDonations = (donor.totalDonations || 0) + 1; 
                
                await donor.save();
                console.log(`Donor ${donor.fullName} last donation date updated.`);
            } else {
                console.log("Donor not found for fulfilled request");
            }
        }
        // ------------------------------------------------

        request.status = status;
        await request.save();

        res.json({ message: `Request marked as ${status}`, request });

    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Delete Request
// @route   DELETE /api/requests/:id
// @access  Private (User)
// ==========================================
const deleteRequest = async (req, res) => {
    try {
        const request = await BloodRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Ensure user owns the request
        if (request.requester.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await request.deleteOne();
        res.json({ message: "Request deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getMatchingRequests = async (req, res) => {
    try {
        // 1. Get Logged-in Donor Details
        // req.user is populated by authMiddleware, but let's fetch full details to be sure
        const donor = await Donor.findById(req.user._id);

        if (!donor) {
            return res.status(404).json({ message: "Donor profile not found" });
        }

        const donorBloodGroup = donor.bloodGroup;

        // 2. Find Requests matching criteria
        const matchingRequests = await BloodRequest.find({
            status: "Pending",          // Only Pending requests
            bloodGroup: donorBloodGroup // Exact Blood Group Match
        })
            .populate("requester", "fullName mobile email") // Optional: Show requester info
            .sort({ urgency: 1, createdAt: -1 }); // Urgent & Newest first

        res.json({
            count: matchingRequests.length,
            bloodGroup: donorBloodGroup,
            requests: matchingRequests
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const scheduleDonation = async (req, res) => {
    try {
        const { date, time, comments } = req.body;
        const requestId = req.params.id;
        const donorId = req.user._id; // From Auth Token

        // 1. Get Request and populate Requester (User) details to send email
        const request = await BloodRequest.findById(requestId).populate("requester", "fullName email mobile");

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.status !== "Pending") {
            return res.status(400).json({ message: "This request is no longer active." });
        }

        // 2. Get Donor Details
        const donor = await Donor.findById(donorId);

        // 3. Update Request in Database
        request.fulfilledBy = donorId;
        request.status = "Scheduled"; // Update status
        request.appointmentSlot = { date, time };
        request.donorMessage = comments;

        await request.save();

        // 4. SEND EMAIL TO THE USER (REQUESTER)
        const emailMessage = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #d32f2f;">Good News! A Donor is on the way.</h2>
                <p>Hello <strong>${request.requester.fullName}</strong>,</p>
                <p>A donor has accepted your blood request for <strong>${request.patientName}</strong>.</p>
                
                <div style="background: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
                    <h3 style="margin-top:0;">Donation Details</h3>
                    <p><strong>Donor Name:</strong> ${donor.fullName}</p>
                    <p><strong>Donor Contact:</strong> ${donor.mobile}</p>
                    <p><strong>Scheduled Date:</strong> ${date}</p>
                    <p><strong>Scheduled Time:</strong> ${time}</p>
                    <p><strong>Message:</strong> ${comments || "No message provided."}</p>
                </div>

                <p>Please coordinate with the hospital to receive the donor.</p>
                <p>Regards,<br><strong>BloodLink Team</strong></p>
            </div>
        `;

        try {
            await sendEmail({
                email: request.requester.email,
                subject: "BloodLink - Donor Appointment Confirmed",
                html: emailMessage // Note: ensure your sendEmail utility accepts 'html' or change to 'text'
            });
        } catch (emailError) {
            console.error("Failed to send email to user:", emailError);
            // We continue even if email fails, as the DB is updated
        }

        res.json({ message: "Donation scheduled and User notified successfully!" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getDonorHistory = async (req, res) => {
    try {
        const donorId = req.user._id;

        // Find requests where this donor is the one who fulfilled it
        const donations = await BloodRequest.find({ fulfilledBy: donorId })
            .sort({ updatedAt: -1 }); // Most recent first

        res.json(donations);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const createHospitalRequest = async (req, res) => {
    try {
        const {
            patientName, age, gender, bloodGroup, units, reason,
            hospitalId, hospitalName, hospitalAddress, urgency
        } = req.body;

        // 1. Basic Validation
        if (!hospitalId) {
            return res.status(400).json({ message: "Target Hospital ID is required" });
        }

        // 2. Fetch Hospital to Check Inventory
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        // 3. Map Frontend Blood Group to Backend Key
        // Example: "A+" -> "A_pos", "O-" -> "O_neg"
        const inventoryKey = bloodGroup.replace('+', '_pos').replace('-', '_neg');
        
        const availableStock = hospital.bloodInventory[inventoryKey] || 0;
        const requestedUnits = parseInt(units) || 1;

        // 4. Check Stock Availability
        if (requestedUnits > availableStock) {
            return res.status(400).json({ 
                message: `Insufficient Stock. ${hospitalName} only has ${availableStock} unit(s) of ${bloodGroup}.` 
            });
        }

        // 5. Create Request (If stock is sufficient)
        const newRequest = await BloodRequest.create({
            requester: req.user._id,
            targetHospital: hospitalId, 
            patientName,
            age,
            gender,
            bloodGroup,
            units: requestedUnits,
            reason,
            hospitalName,
            hospitalAddress,
            urgency,
            status: "Pending"
        });

        res.status(201).json({
            success: true,
            message: `Request sent to ${hospitalName}`,
            request: newRequest
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
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
};