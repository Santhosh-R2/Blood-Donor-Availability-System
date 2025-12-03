const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const HospitalSchema = new mongoose.Schema({
    hospitalName: {
        type: String,
        required: [true, "Hospital Name is required"],
        trim: true
    },
    licenseNumber: {
        type: String,
        required: [true, "License/Registration Number is required"],
        unique: true, // Prevents duplicate registrations
        trim: true
    },
    ownershipType: {
        type: String,
        required: [true, "Ownership Type is required"],
        enum: ["Government", "Private", "Non-Profit", "Military", "Other"]
    },
    email: {
        type: String,
        required: [true, "Official Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
            "Please enter a valid email address"
        ]
    },
    phone: {
        type: String,
        required: [true, "Phone Number is required"],
        unique: true,
        match: [/^[0-9]{10,12}$/, "Please enter a valid phone number"]
    },
    emergencyPhone: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        trim: true,
        default: ""
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
    zipCode: {
        type: String,
        required: [true, "Zip Code is required"],
        trim: true
    },
    totalBeds: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters"]
    },
    // --- HOSPITAL SPECIFIC FLAGS ---
    hasBloodBank: {
        type: Boolean,
        default: false
    },
    hasAmbulance: {
        type: Boolean,
        default: false
    },
    // Admin Approval Status
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending" // Hospitals usually need admin verification before going live
    },
    // Geo-location for mapping nearby hospitals
    location: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], index: "2dsphere" } // [longitude, latitude]
    },
    // Inventory (Embedded Object for Quick Access)
    bloodInventory: {
        A_pos: { type: Number, default: 0 },
        A_neg: { type: Number, default: 0 },
        B_pos: { type: Number, default: 0 },
        B_neg: { type: Number, default: 0 },
        AB_pos: { type: Number, default: 0 },
        AB_neg: { type: Number, default: 0 },
        O_pos: { type: Number, default: 0 },
        O_neg: { type: Number, default: 0 }
    },
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

// --- PASSWORD HASHING ---
HospitalSchema.pre("save", async function () {
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

// --- PASSWORD MATCH ---
HospitalSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Hospital", HospitalSchema);