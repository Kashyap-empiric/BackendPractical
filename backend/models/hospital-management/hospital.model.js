const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
}, {timestamps: true});

export const Hospital = mongoose.model("Hospital", hospitalSchema);