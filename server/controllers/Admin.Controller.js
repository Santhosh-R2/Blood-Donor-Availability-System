const Admin = require("../schemas/AdminSchema");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail")
const User = require("../schemas/UserSchema");
const Donor = require("../schemas/DonerSchema");
const Hospital = require("../schemas/HospitalSchema");
const BloodRequest = require("../schemas/BloodRequestSchema");
// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ==========================================
// @desc    Register Admin (RESTRICTED TO 1)
// @route   POST /api/admin/register
// ==========================================
const registerAdmin = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // --- 1. KEY CHANGE: Check if ANY admin already exists ---
        const adminCount = await Admin.countDocuments();
        
        if (adminCount > 0) {
            return res.status(403).json({ 
                message: "Registration Failed. An Admin account already exists. Only one Admin is allowed." 
            });
        }

        // 2. Create the Admin
        const admin = await Admin.create({
            fullName,
            email,
            password,
            role: "super-admin"
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                fullName: admin.fullName,
                email: admin.email,
                token: generateToken(admin._id),
                message: "Super Admin Created Successfully"
            });
        } else {
            res.status(400).json({ message: "Invalid admin data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... keep loginAdmin as is ...
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role,
                token: generateToken(admin._id),
                message: "Welcome back, Admin"
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const otp = Math.floor(100000 + Math.random() * 900000);
        admin.resetPasswordOtp = otp;
        admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await admin.save({ validateBeforeSave: false });

        try {
            await sendEmail({
                email: admin.email,
                subject: "Admin Security - Password Reset OTP",
                otp: otp
            });
            res.status(200).json({ message: "OTP sent to Admin email" });
        } catch (error) {
            admin.resetPasswordOtp = null;
            admin.resetPasswordExpire = null;
            await admin.save({ validateBeforeSave: false });
            res.status(500).json({ message: "Email failed" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const admin = await Admin.findOne({ 
            email, 
            resetPasswordOtp: otp, 
            resetPasswordExpire: { $gt: Date.now() } 
        });

        if (!admin) return res.status(400).json({ message: "Invalid/Expired OTP" });

        admin.password = newPassword;
        admin.resetPasswordOtp = null;
        admin.resetPasswordExpire = null;
        await admin.save();

        res.status(200).json({ message: "Admin Password Reset Successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getAdminStats = async (req, res) => {
    try {
        // 1. Basic Counts
        const users = await User.countDocuments();
        const donors = await Donor.countDocuments();
        const hospitals = await Hospital.countDocuments();
        const requests = await BloodRequest.countDocuments();

        // 2. Request Trends (Unchanged)
        const currentYear = new Date().getFullYear();
        const requestTrends = await BloodRequest.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(`${currentYear}-01-01`), $lt: new Date(`${currentYear + 1}-01-01`) }
                }
            },
            { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyRequests = months.map((name, index) => {
            const found = requestTrends.find(item => item._id === index + 1);
            return { name, requests: found ? found.count : 0 };
        });

        // --- 3. NEW LOGIC: Fulfilled Requests by Blood Group ---
        const fulfilledStats = await BloodRequest.aggregate([
            {
                $match: { status: "Fulfilled" } // Only count fulfilled
            },
            {
                $group: {
                    _id: "$bloodGroup", // Group by Blood Type (A+, O-, etc.)
                    count: { $sum: 1 }  // Count them
                }
            }
        ]);

        // Format for Recharts
        // Ensure all groups are present even if count is 0
        const allGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const bloodDistribution = allGroups.map(group => {
            const found = fulfilledStats.find(item => item._id === group);
            return { name: group, value: found ? found.count : 0 };
        });

        res.json({
            counts: { users, donors, hospitals, requests },
            monthlyRequests,
            bloodDistribution // Now contains fulfilled counts
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getAllDonors = async (req, res) => {
    try {
        // 1. Get all donors
        const donors = await Donor.find().select('-password').sort({ createdAt: -1 });

        // 2. For each donor, count fulfilled requests
        // Using Promise.all because we are running async queries inside map
        const donorsWithStats = await Promise.all(donors.map(async (donor) => {
            const count = await BloodRequest.countDocuments({ 
                fulfilledBy: donor._id, 
                status: 'Fulfilled' 
            });
            
            // Convert Mongoose Document to JS Object to attach new property
            return { 
                ...donor.toObject(), 
                totalDonations: count 
            };
        }));

        res.json(donorsWithStats);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find().select('-password').sort({ createdAt: -1 });
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Update Hospital Status (Approve/Reject)
// @route   PUT /api/admin/hospitals/:id/status
// @access  Private (Admin)
// ==========================================
const updateHospitalStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const hospital = await Hospital.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        res.json({ message: `Hospital marked as ${status}`, hospital });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Delete Hospital
// @route   DELETE /api/admin/hospitals/:id
// @access  Private (Admin)
// ==========================================
const deleteHospital = async (req, res) => {
    try {
        await Hospital.findByIdAndDelete(req.params.id);
        res.json({ message: "Hospital deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllRequestsAdmin = async (req, res) => {
    try {
        const requests = await BloodRequest.find()
            .populate("requester", "fullName email mobile") // User Info
            .populate("fulfilledBy", "fullName mobile")     // Donor Info (if any)
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Delete a Request (Admin Override)
// @route   DELETE /api/admin/requests/:id
// @access  Private (Admin)
// ==========================================
const deleteRequestAdmin = async (req, res) => {
    try {
        await BloodRequest.findByIdAndDelete(req.params.id);
        res.json({ message: "Request deleted by Admin" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.user._id);

        if (admin) {
            admin.fullName = req.body.fullName || admin.fullName;
            admin.email = req.body.email || admin.email;
            
            if (req.body.password) {
                admin.password = req.body.password;
            }

            const updatedAdmin = await admin.save();

            res.json({
                _id: updatedAdmin._id,
                fullName: updatedAdmin.fullName,
                email: updatedAdmin.email,
                role: updatedAdmin.role,
                token: generateToken(updatedAdmin._id),
                message: "Profile Updated"
            });
        } else {
            res.status(404).json({ message: "Admin not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { registerAdmin, loginAdmin , forgotPassword, resetPassword ,getAdminStats ,getAllUsers,getAllDonors,getAllHospitals, updateHospitalStatus, deleteHospital, getAllRequestsAdmin, deleteRequestAdmin,updateAdminProfile };