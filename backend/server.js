require('dotenv').config();
const express = require('express');
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const cors = require('cors');
const app = express()
const cookieParser = require("cookie-parser");

connectDB();
app.use(cors({
    origin: ["http://localhost:5173", "https://khz5bstr-5173.inc1.devtunnels.ms", "https://auth-deploy-demo.vercel.app"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/", authRoutes)

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});