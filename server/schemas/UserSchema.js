const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // npm install bcryptjs

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full Name is required"],
        trim: true
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [18, "You must be at least 18 years old"]
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ["Male", "Female", "Other"]
    },
    mobile: {
        type: String,
        required: [true, "Mobile number is required"],
        unique: true,
        match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
            "Please enter a valid email address"
        ]
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        trim: true
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true
    },
    state: {
        type: String,
        required: [true, "State is required"],
        trim: true
    },
    pincode: {
        type: String, 
        required: [true, "Pincode is required"],
        trim: true,
        minLength: [6, "Pincode must be 6 digits"],
        maxLength: [6, "Pincode must be 6 digits"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters"]
    },
    // --- OTP FIELDS ---
    resetPasswordOtp: {
        type: Number,
        default: null
    },
    resetPasswordExpire: {
        type: Date,
        default: null
    }
}, {
    timestamps: true 
});

// --- PASSWORD HASHING MIDDLEWARE ---
// ✅ CORRECT
// --- PASSWORD HASHING MIDDLEWARE ---
UserSchema.pre("save", async function () {
    // 1. If password is NOT modified (like in forgotPassword), exit function
    if (!this.isModified("password")) {
        return; 
    }

    try {
        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw new Error(error);
    }
});

// --- PASSWORD MATCH METHOD ---
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);