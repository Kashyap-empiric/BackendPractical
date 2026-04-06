require('dotenv').config();
const express = require('express');
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const cors = require('cors');
const app = express()
const cookieParser = require("cookie-parser");

connectDB();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/", authRoutes)

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});