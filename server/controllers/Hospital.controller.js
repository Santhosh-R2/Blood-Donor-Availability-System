const Hospital = require("../schemas/HospitalSchema"); // Adjust path if necessary
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const BloodRequest = require("../schemas/BloodRequestSchema");
// --- Helper: Generate JWT Token ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// ==========================================
// @desc    Register a new Hospital
// @route   POST /api/hospitals/register
// @access  Public
// ==========================================
const registerHospital = async (req, res) => {
    try {
        const {
            hospitalName, licenseNumber, ownershipType,
            email, phone, emergencyPhone, website,
            address, city, state, zipCode, totalBeds,
            password, latitude, longitude,
            hasBloodBank, hasAmbulance
        } = req.body;

        // 1. Check if hospital already exists (Email OR License Number)
        const hospitalExists = await Hospital.findOne({
            $or: [{ email }, { licenseNumber }, { phone }]
        });

        if (hospitalExists) {
            return res.status(400).json({ message: "Hospital with this Email, Phone, or License Number already exists" });
        }

        // 2. Handle Location (GeoJSON format)
        let locationData = undefined;
        if (latitude && longitude) {
            locationData = {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            };
        }

        // 3. Create new Hospital
        const hospital = await Hospital.create({
            hospitalName,
            licenseNumber,
            ownershipType,
            email,
            phone,
            emergencyPhone,
            website,
            address,
            city,
            state,
            zipCode,
            totalBeds,
            password,
            hasBloodBank,
            hasAmbulance,
            location: locationData
            // status defaults to 'pending' via Schema
            // bloodInventory defaults to 0s via Schema
        });

        if (hospital) {
            res.status(201).json({
                _id: hospital._id,
                hospitalName: hospital.hospitalName,
                email: hospital.email,
                licenseNumber: hospital.licenseNumber,
                status: hospital.status, // Frontend can show "Verification Pending"
                token: generateToken(hospital._id),
                message: "Hospital Registered Successfully"
            });
        } else {
            res.status(400).json({ message: "Invalid hospital data" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Auth hospital & get token (Login)
// @route   POST /api/hospitals/login
// @access  Public
// ==========================================
const loginHospital = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if hospital exists
        const hospital = await Hospital.findOne({ email });

        if (!hospital) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 2. CHECK STATUS - Only allow if approved
        if (hospital.status !== "approved") {
            return res.status(403).json({ 
                message: "Account pending approval. Please contact Admin." 
            });
        }

        // 3. Check password
        if (await hospital.matchPassword(password)) {
            res.json({
                _id: hospital._id,
                hospitalName: hospital.hospitalName,
                email: hospital.email,
                role: "hospital", // Explicitly adding role helps frontend
                status: hospital.status,
                token: generateToken(hospital._id),
                message: "Login Successful"
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Get hospital profile & inventory
// @route   GET /api/hospitals/profile
// @access  Private (Requires Token)
// ==========================================
const getHospitalProfile = async (req, res) => {
    try {
        // req.user is populated by authMiddleware (Needs update to support Hospitals)
        const hospital = await Hospital.findById(req.user._id);

        if (hospital) {
            res.json({
                _id: hospital._id,
                hospitalName: hospital.hospitalName,
                email: hospital.email,
                phone: hospital.phone,
                emergencyPhone: hospital.emergencyPhone,
                address: hospital.address,
                city: hospital.city,
                state: hospital.state,
                zipCode: hospital.zipCode,
                bloodInventory: hospital.bloodInventory, // Critical for dashboard
                hasBloodBank: hospital.hasBloodBank,
                hasAmbulance: hospital.hasAmbulance,
                status: hospital.status,
                location: hospital.location,
                website: hospital.website,
                totalBeds: hospital.totalBeds,
                ownershipType:hospital.ownershipType,
                licenseNumber:hospital.licenseNumber
            });
        } else {
            res.status(404).json({ message: "Hospital not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Update hospital profile & Inventory
// @route   PUT /api/hospitals/profile
// @access  Private (Requires Token)
// ==========================================
const updateHospitalProfile = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.user._id);

        if (hospital) {
            // --- General Details Update ---
            hospital.hospitalName = req.body.hospitalName || hospital.hospitalName;
            hospital.phone = req.body.phone || hospital.phone;
            hospital.emergencyPhone = req.body.emergencyPhone || hospital.emergencyPhone;
            hospital.website = req.body.website || hospital.website;
            hospital.totalBeds = req.body.totalBeds || hospital.totalBeds;

            // --- Address Update ---
            hospital.address = req.body.address || hospital.address;
            hospital.city = req.body.city || hospital.city;
            hospital.state = req.body.state || hospital.state;
            hospital.zipCode = req.body.zipCode || hospital.zipCode;

            // --- Facilities Update ---
            if (req.body.hasBloodBank !== undefined) hospital.hasBloodBank = req.body.hasBloodBank;
            if (req.body.hasAmbulance !== undefined) hospital.hasAmbulance = req.body.hasAmbulance;

            // --- Blood Inventory Update ---
            // Expecting body: { bloodInventory: { A_pos: 10, O_neg: 5 } }
            if (req.body.bloodInventory) {
                hospital.bloodInventory = {
                    ...hospital.bloodInventory, // Keep existing values
                    ...req.body.bloodInventory  // Overwrite with new values
                };
            }

            // --- Location Update ---
            if (req.body.latitude && req.body.longitude) {
                hospital.location = {
                    type: "Point",
                    coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
                };
            }

            // --- Password Update ---
            if (req.body.password) {
                hospital.password = req.body.password;
            }

            const updatedHospital = await hospital.save();

            res.json({
                _id: updatedHospital._id,
                hospitalName: updatedHospital.hospitalName,
                email: updatedHospital.email,
                bloodInventory: updatedHospital.bloodInventory,
                token: generateToken(updatedHospital._id),
                message: "Profile Updated Successfully"
            });
        } else {
            res.status(404).json({ message: "Hospital not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Find Hospital
        const hospital = await Hospital.findOne({ email });
        if (!hospital) {
            return res.status(404).json({ message: "Hospital with this email does not exist" });
        }

        // 2. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // 3. Save OTP to DB (Valid for 10 minutes)
        hospital.resetPasswordOtp = otp;
        hospital.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await hospital.save({ validateBeforeSave: false });

        // 4. Send Email
        try {
            await sendEmail({
                email: hospital.email,
                subject: "BloodLink - Password Reset OTP",
                otp: otp,
            });

            res.status(200).json({ message: "OTP sent to hospital email" });

        } catch (emailError) {
            console.error("Email Error:", emailError);
            hospital.resetPasswordOtp = null;
            hospital.resetPasswordExpire = null;
            await hospital.save({ validateBeforeSave: false });

            res.status(500).json({ message: "Email could not be sent. Please try again." });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Reset Password (Verify OTP)
// @route   POST /api/hospitals/reset-password
// @access  Public
// ==========================================
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // 1. Find Hospital with matching Email, OTP, and check Expiration
        const hospital = await Hospital.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!hospital) {
            return res.status(400).json({ message: "Invalid OTP or OTP has expired" });
        }

        // 2. Update Password (Middleware hashes it automatically)
        hospital.password = newPassword;

        // 3. Clear OTP fields
        hospital.resetPasswordOtp = null;
        hospital.resetPasswordExpire = null;

        await hospital.save();

        res.status(200).json({ message: "Password reset successful. You can now login." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getAllHospitals = async (req, res) => {
    try {
        // Fetch only necessary fields
        const hospitals = await Hospital.find({})
            .select("hospitalName city address bloodInventory phone");
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const createHospitalRequest = async (req, res) => {
    try {
        const {
            patientName, age, gender, bloodGroup, units, reason, urgency,
            hospitalId, hospitalName, hospitalAddress // Passed from frontend
        } = req.body;

        const newRequest = await BloodRequest.create({
            requester: req.user._id,
            targetHospital: hospitalId, // Link to the specific hospital account
            patientName,
            age,
            gender,
            bloodGroup,
            units,
            reason,
            hospitalName,
            hospitalAddress,
            urgency,
            status: "Pending"
        });

        res.status(201).json({
            success: true,
            message: "Request sent directly to hospital dashboard",
            request: newRequest
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateInventory = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.user._id);

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        // Expected Body: { bloodGroup: "A_pos", quantity: 5, action: "add" | "remove" | "set" }
        const { bloodGroup, quantity, action } = req.body;

        if (!hospital.bloodInventory[bloodGroup] && hospital.bloodInventory[bloodGroup] !== 0) {
            return res.status(400).json({ message: "Invalid Blood Group Key" });
        }

        let currentStock = hospital.bloodInventory[bloodGroup];
        let newStock = currentStock;

        if (action === "add") {
            newStock = currentStock + parseInt(quantity);
        } else if (action === "remove") {
            newStock = currentStock - parseInt(quantity);
            if (newStock < 0) newStock = 0; // Prevent negative
        } else if (action === "set") {
            newStock = parseInt(quantity);
        }
        if (action === "remove") {
            newStock = currentStock - parseInt(quantity); // Use quantity from body
            if (newStock < 0) newStock = 0;
        }
        // Update the specific field
        hospital.bloodInventory[bloodGroup] = newStock;

        await hospital.save();

        res.json({
            message: "Inventory Updated",
            inventory: hospital.bloodInventory
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getHospitalRequests = async (req, res) => {
    try {
        const hospitalId = req.user._id;
        const requests = await BloodRequest.find({ targetHospital: hospitalId })
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
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
};