const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    role: { type: String, default: 'Guest' }, // User, Donor, Hospital, or Guest
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Contact", ContactSchema);