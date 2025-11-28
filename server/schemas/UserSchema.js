const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // You will need: npm install bcryptjs

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
        enum: ["Male", "Female", "Other"] // Restricts values to dropdown options
    },
    mobile: {
        type: String,
        required: [true, "Mobile number is required"],
        unique: true, // Prevents duplicate accounts with same number
        match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true, // Prevents duplicate emails
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
        type: String, // String is safer for postal codes (preserves leading zeros)
        required: [true, "Pincode is required"],
        trim: true,
        minLength: [6, "Pincode must be 6 digits"],
        maxLength: [6, "Pincode must be 6 digits"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters"]
    }
    // Note: confirmPassword is NOT stored in the database.
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// --- PASSWORD HASHING MIDDLEWARE ---
// This runs automatically before saving the user to DB
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// --- PASSWORD COMPARISON METHOD ---
// Used during Login to check if entered password matches hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);