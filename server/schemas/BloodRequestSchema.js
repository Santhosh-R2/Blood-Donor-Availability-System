const mongoose = require("mongoose");

const BloodRequestSchema = new mongoose.Schema({
    // Link to the User who created the request
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // Patient Details
    patientName: {
        type: String,
        required: [true, "Patient Name is required"],
        trim: true
    },
    age: {
        type: Number,
        required: [true, "Age is required"]
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    bloodGroup: {
        type: String,
        required: [true, "Blood Group is required"],
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        uppercase: true
    },
    units: {
        type: Number,
        default: 1,
        min: 1
    },
    reason: {
        type: String,
        trim: true
    },
    
    // Hospital Details
    hospitalName: {
        type: String,
        required: [true, "Hospital Name is required"]
    },
    doctorName: {
        type: String,
        default: ""
    },
    hospitalAddress: {
        type: String,
        required: [true, "Hospital Address is required"]
    },
    hospitalPhone: {
        type: String,
        default: ""
    },appointmentSlot: {
        date: String,
        time: String
    },
    donorMessage: {
        type: String,
        default: ""
    },

    // Request Status & Urgency
    urgency: {
        type: String,
        enum: ["critical", "moderate", "low"],
        default: "moderate"
    },
    status: {
        type: String,
        enum: ["Pending", "Fulfilled", "Rejected", "Cancelled","Scheduled"],
        default: "Pending"
    },
    
    // If fulfilled, who fulfilled it? (Optional, usually a Donor or Hospital)
    fulfilledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor",
        default: null
    },
    
    // Date when the blood is required
    requiredDate: {
        type: Date,
        default: Date.now
    },
    targetHospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        default: null
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("BloodRequest", BloodRequestSchema);