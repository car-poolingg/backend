const { Schema, model, Types } = require("mongoose");

const DriverSubscriptionSchema = new Schema({
    driver: {
        type: Types.ObjectId,
        ref: "Driver",
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

module.exports = model("DriverSubscription", DriverSubscriptionSchema);
