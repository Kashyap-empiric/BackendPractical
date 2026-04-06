const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    diagnosedWith: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
    },
    bloodGroup: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        enum: ["M", "F"],
        required: true
    },
    admittedIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    }
}, {timestamps: true});

export const Patient = mongoose.model("Patient", patientSchema);