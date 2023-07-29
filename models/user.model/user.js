const { Schema, model } = require("mongoose");
const { genSalt, hash, compare } = require("bcryptjs");
const validator = require("validator");

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            validate: {
                validator: validator.isEmail,
                message: "Please provide a valid email",
            },
        },
        phoneNumber: {
            type: Number,
        },
        role: {
            type: String,
            default: "passenger",
        },
        googleId: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        isVerified: {
            email: {
                type: Boolean,
                default: false,
            },
        },
        verified: {
            type: Date,
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
});

UserSchema.methods.ComparePassword = async function (enteredPassword) {
    return compare(enteredPassword, this.password);
};
module.exports = model("User", UserSchema);
