const Contact = require("../schemas/ContactSchema");

// @desc    Submit Contact Form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message, role } = req.body;
        await Contact.create({ name, email, subject, message, role });
        res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get All Messages
// @route   GET /api/admin/messages
// @access  Private (Admin)
const getAllMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark as Read / Delete
// @route   DELETE /api/admin/messages/:id
const deleteMessage = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: "Message deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitContact, getAllMessages, deleteMessage };