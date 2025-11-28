const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // npm install bcryptjs

const DonorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full Name is required"],
        trim: true
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
    mobile: {
        type: String,
        required: [true, "Mobile number is required"],
        unique: true,
        match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"]
    },
    dob: {
        type: Date,
        required: [true, "Date of Birth is required"]
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ["Male", "Female", "Other"]
    },
    bloodGroup: {
        type: String,
        required: [true, "Blood Group is required"],
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        uppercase: true
    },
    weight: {
        type: Number,
        required: [true, "Weight is required"],
        min: [45, "Weight must be at least 45kg to donate blood"]
    },
    lastDonationDate: {
        type: Date,
        default: null
    },
    hasDisease: {
        type: String, // Storing 'yes' or 'no' from frontend
        enum: ["yes", "no", ""],
        default: "no"
    },
    hadSurgery: {
        type: String, // Storing 'yes' or 'no' from frontend
        enum: ["yes", "no", ""],
        default: "no"
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters"]
    },
    // Track Availability status
    isAvailable: {
        type: Boolean,
        default: true 
    },
    // Geo-location for finding nearby donors (Optional but recommended)
    location: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], index: "2dsphere" } // [longitude, latitude]
    }
}, {
    timestamps: true
});

// --- PASSWORD HASHING ---
DonorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// --- PASSWORD MATCH ---
DonorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Donor", DonorSchema);