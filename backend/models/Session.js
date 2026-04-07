const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    deviceInfo: {
        deviceId: {
            type: String,
        },
        userAgent: {
            type: String,
        },
        deviceType: {
            type: String,
        },
        lastUsed: {
            type: Date,
        },
        ipAddress: {
            type: String,
        },
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {timestamps: true});

// sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Session", sessionSchema);