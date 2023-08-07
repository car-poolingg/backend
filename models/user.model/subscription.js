const { Schema, model, Types } = require("mongoose");

const UserSubscriptionSchema = new Schema({
    user: {
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

module.exports = model("UserSubscription", UserSubscriptionSchema);
