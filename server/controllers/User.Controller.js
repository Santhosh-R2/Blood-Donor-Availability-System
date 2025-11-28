const User = require("../schemas/UserSchema"); // Ensure this matches your file path
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// --- Helper: Generate JWT Token ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d", // Token valid for 30 days
    });
};

// ==========================================
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
// ==========================================
const registerUser = async (req, res) => {
    try {
        const { 
            fullName, age, gender, mobile, email, 
            address, city, state, pincode, password 
        } = req.body;

        // 1. Check if user already exists (by email or mobile)
        const userExists = await User.findOne({ $or: [{ email }, { mobile }] });

        if (userExists) {
            return res.status(400).json({ message: "User with this email or mobile already exists" });
        }

        // 2. Create new user
        // Password hashing is handled in the User Model's pre('save') middleware
        const user = await User.create({
            fullName,
            age,
            gender,
            mobile,
            email,
            address,
            city,
            state,
            pincode,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                mobile: user.mobile,
                token: generateToken(user._id), // Send token immediately
                message: "Registration Successful"
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
// ==========================================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ email });

        // 2. Check password
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                mobile: user.mobile,
                token: generateToken(user._id),
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
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Requires Token)
// ==========================================
const getUserProfile = async (req, res) => {
    try {
        // req.user comes from the auth middleware (see below)
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                mobile: user.mobile,
                address: user.address,
                city: user.city,
                state: user.state,
                pincode: user.pincode,
                age: user.age,
                gender: user.gender
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (Requires Token)
// ==========================================
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Update fields if provided in body, otherwise keep existing
            user.fullName = req.body.fullName || user.fullName;
            user.mobile = req.body.mobile || user.mobile;
            user.address = req.body.address || user.address;
            user.city = req.body.city || user.city;
            user.state = req.body.state || user.state;
            user.pincode = req.body.pincode || user.pincode;
            
            // Handle Password change separately to trigger hash middleware
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                mobile: updatedUser.mobile,
                token: generateToken(updatedUser._id), // Refresh token
                message: "Profile Updated Successfully"
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};