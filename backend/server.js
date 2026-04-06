require('dotenv').config();
const express = require('express');
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes") 
const app = express()

connectDB();

app.use(express.json());

app.use("/api/", authRoutes)

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});