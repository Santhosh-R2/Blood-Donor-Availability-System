const Donor = require("../schemas/DonerSchema"); // Adjust path if necessary
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail")
// --- Helper: Generate JWT Token ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// ==========================================
// @desc    Register a new Donor
// @route   POST /api/donors/register
// @access  Public
// ==========================================
const registerDonor = async (req, res) => {
    try {
        const { 
            fullName, email, mobile, dob, gender, 
            bloodGroup, weight, hasDisease, hadSurgery, 
            password, latitude, longitude,lastDonationDate
        } = req.body;

        // 1. Check if donor already exists
        const donorExists = await Donor.findOne({ $or: [{ email }, { mobile }] });

        if (donorExists) {
            return res.status(400).json({ message: "Donor with this email or mobile already exists" });
        }

        // 2. Handle Location (if coordinates provided by frontend)
        // GeoJSON format: coordinates: [longitude, latitude]
        let locationData = undefined;
        if (latitude && longitude) {
            locationData = {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            };
        }

        // 3. Create new Donor
        const donor = await Donor.create({
            fullName,
            email,
            mobile,
            dob,
            gender,
            bloodGroup,
            weight,
            hasDisease,
            hadSurgery,
            password,
            location: locationData, // Optional
            lastDonationDate
        });

        if (donor) {
            res.status(201).json({
                _id: donor._id,
                fullName: donor.fullName,
                email: donor.email,
                bloodGroup: donor.bloodGroup,
                token: generateToken(donor._id),
                message: "Donor Registration Successful"
            });
        } else {
            res.status(400).json({ message: "Invalid donor data" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Auth donor & get token (Login)
// @route   POST /api/donors/login
// @access  Public
// ==========================================
const loginDonor = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if donor exists
        const donor = await Donor.findOne({ email });
console.log(donor);

        // 2. Check password
        if (donor && (await donor.matchPassword(password))) {
            res.json({
                _id: donor._id,
                fullName: donor.fullName,
                email: donor.email,
                bloodGroup: donor.bloodGroup,
                token: generateToken(donor._id),
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
// @desc    Get donor profile
// @route   GET /api/donors/profile
// @access  Private (Requires Token)
// ==========================================
const getDonorProfile = async (req, res) => {
    try {
        // Assumes authMiddleware adds req.user (or req.donor)
        const donor = await Donor.findById(req.user._id);

        if (donor) {
            res.json({
                _id: donor._id,
                fullName: donor.fullName,
                email: donor.email,
                mobile: donor.mobile,
                dob: donor.dob,
                gender: donor.gender,
                bloodGroup: donor.bloodGroup,
                weight: donor.weight,
                hasDisease: donor.hasDisease,
                hadSurgery: donor.hadSurgery,
                lastDonationDate: donor.lastDonationDate,
                isAvailable: donor.isAvailable,
                location: donor.location
            });
        } else {
            res.status(404).json({ message: "Donor not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Update donor profile
// @route   PUT /api/donors/profile
// @access  Private (Requires Token)
// ==========================================
const updateDonorProfile = async (req, res) => {
    try {
        const donor = await Donor.findById(req.user._id);

        if (donor) {
            // Update fields if provided
            donor.fullName = req.body.fullName || donor.fullName;
            donor.mobile = req.body.mobile || donor.mobile;
            donor.weight = req.body.weight || donor.weight;
            donor.hasDisease = req.body.hasDisease || donor.hasDisease;
            donor.hadSurgery = req.body.hadSurgery || donor.hadSurgery;
            
            // Allow updating donation status
            if (req.body.lastDonationDate) {
                donor.lastDonationDate = req.body.lastDonationDate;
            }
            // Allow toggling availability manually
            if (req.body.isAvailable !== undefined) {
                donor.isAvailable = req.body.isAvailable;
            }

            // Update Location if provided
            if (req.body.latitude && req.body.longitude) {
                donor.location = {
                    type: "Point",
                    coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
                };
            }

            // Handle Password change
            if (req.body.password) {
                donor.password = req.body.password;
            }

            const updatedDonor = await donor.save();

            res.json({
                _id: updatedDonor._id,
                fullName: updatedDonor.fullName,
                email: updatedDonor.email,
                bloodGroup: updatedDonor.bloodGroup,
                isAvailable: updatedDonor.isAvailable,
                token: generateToken(updatedDonor._id),
                message: "Profile Updated Successfully"
            });
        } else {
            res.status(404).json({ message: "Donor not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Find Donor
        const donor = await Donor.findOne({ email });
        if (!donor) {
            return res.status(404).json({ message: "Donor with this email does not exist" });
        }

        // 2. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // 3. Save OTP to DB (Valid for 10 minutes)
        donor.resetPasswordOtp = otp;
        donor.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 

        await donor.save({ validateBeforeSave: false });

        // 4. Send Email
        try {
            await sendEmail({
                email: donor.email,
                subject: "BloodLink - Password Reset OTP",
                otp: otp,
            });

            res.status(200).json({ message: "OTP sent to your email" });

        } catch (emailError) {
            console.error("Email Error:", emailError);
            donor.resetPasswordOtp = null;
            donor.resetPasswordExpire = null;
            await donor.save({ validateBeforeSave: false });

            res.status(500).json({ message: "Email could not be sent. Please try again." });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Reset Password (Verify OTP)
// @route   POST /api/donors/reset-password
// @access  Public
// ==========================================
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // 1. Find Donor with matching Email, OTP, and check Expiration
        const donor = await Donor.findOne({ 
            email,
            resetPasswordOtp: otp,
            resetPasswordExpire: { $gt: Date.now() } 
        });

        if (!donor) {
            return res.status(400).json({ message: "Invalid OTP or OTP has expired" });
        }

        // 2. Update Password (Middleware hashes it automatically)
        donor.password = newPassword;
        
        // 3. Clear OTP fields
        donor.resetPasswordOtp = null;
        donor.resetPasswordExpire = null;

        await donor.save();

        res.status(200).json({ message: "Password reset successful. You can now login." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    registerDonor,
    loginDonor,
    getDonorProfile,
    updateDonorProfile,
    forgotPassword,
    resetPassword   
    
};