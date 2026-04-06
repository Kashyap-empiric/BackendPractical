import mongoose from "mongoose"

const todoSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        required: [true, "password is required"]
    }
}, {timestamps: true});

// export const User = mongoose.model("User", todoSchema);