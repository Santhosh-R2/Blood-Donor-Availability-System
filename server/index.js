// 1. LOAD DOTENV AT THE TOP
require("dotenv").config(); 

const express = require("express");
const app = express();
// Use the port from env or default to 5001
const PORT = process.env.PORT || 5001; 
const db = require("./database");
const UserRoute = require("./routes/userRoutes");
const donorRoutes = require('./routes/donorRoute');
const hospitalRoutes = require('./routes/hospitalRoute');
const adminRoutes = require('./routes/adminRoutes');
const requestRoutes = require('./routes/bloodRequestRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Built-in Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debugging: Check if the secret is loaded (Remove this line in production)
console.log("JWT Secret is:", process.env.JWT_SECRET ? "Loaded" : "MISSING");
const cors = require("cors")
app.use(cors())
app.use("/User", UserRoute);
app.use('/Donor', donorRoutes);
app.use('/Hospitals', hospitalRoutes); 
app.use('/Admin', adminRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/contact', contactRoutes);

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});