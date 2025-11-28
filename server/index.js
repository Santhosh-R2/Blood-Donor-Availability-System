// 1. LOAD DOTENV AT THE TOP
require("dotenv").config(); 

const express = require("express");
const app = express();
// Use the port from env or default to 5001
const PORT = process.env.PORT || 5001; 
const db = require("./database");
const UserRoute = require("./routes/userRoutes");

// Built-in Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debugging: Check if the secret is loaded (Remove this line in production)
console.log("JWT Secret is:", process.env.JWT_SECRET ? "Loaded" : "MISSING");
const cors = require("cors")
app.use(cors())
app.use("/User", UserRoute);

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
});