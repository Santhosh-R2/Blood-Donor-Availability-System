const jwt = require("jsonwebtoken");
const User = require("../schemas/UserSchema");
const Donor = require("../schemas/DonerSchema");
const Hospital = require("../schemas/HospitalSchema");
const Admin = require("../schemas/AdminSchema"); // 1. Import Admin

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check all collections
            let account = await User.findById(decoded.id).select("-password");
            if (!account) account = await Donor.findById(decoded.id).select("-password");
            if (!account) account = await Hospital.findById(decoded.id).select("-password");
            if (!account) account = await Admin.findById(decoded.id).select("-password"); // 2. Check Admin

            if (!account) {
                return res.status(401).json({ message: "Not authorized, account not found" });
            }

            req.user = account;
            next();

        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protect };