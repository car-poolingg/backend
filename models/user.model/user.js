import { Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcryptjs";
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
        password: {
            type: String,
            required: true,
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
