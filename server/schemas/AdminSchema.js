const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters"]
    },
    role: {
        type: String,
        default: "admin" // Can be 'super-admin', 'moderator', etc.
    },
    resetPasswordOtp: { type: Number, default: null },
    resetPasswordExpire: { type: Date, default: null }
}, {
    timestamps: true
});

// --- PASSWORD HASHING ---
AdminSchema.pre("save", async function () {
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

// --- MATCH PASSWORD ---
AdminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", AdminSchema);