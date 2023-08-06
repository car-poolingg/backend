const { Schema, model, Types } = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    endpoint: {
        type: String,
        required: true,
    },
    expirationTime: {
        type: Date,
        default: null,
    },
    keys: {
        p256dh: {
            type: String,
            required: true,
        },
        auth: {
            type: String,
            required: true,
        },
    },
});

module.exports = model("Subscription", SubscriptionSchema);
