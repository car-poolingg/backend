const { Schema, model } = require("mongoose");
const validator = require("validator");
const { genSalt, compare, hash } = require("bcryptjs");

const DriverSchema = new Schema(
    {
        phoneNo: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: "Please provide a valid email",
            },
        },
        role: {
            type: String,
            default: "driver",
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        homeAddress: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        gender: {
            type: String,
            enum: ["male", "female"],
        },
        dateOfBirth: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        licenseType: {
            type: String,
        },
        vehicleYear: {
            type: String,
        },
        VehicleMM: {
            type: String,
        },
        licensePlate: {
            type: String,
        },
        driverLicenseNo: {
            type: String,
        },
        driverLicense: {
            type: String,
        },
        driverPhoto: {
            type: String,
        },
        frontViewCarPhoto: {
            type: String,
        },
        backViewCarPhoto: {
            type: String,
        },
        intCarPhoto: {
            type: String,
        },
        driverInsurance: {
            type: String,
        },
        driverInspection: {
            type: String,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        isVerified: {
            phone: {
                type: Boolean,
                default: false,
            },
            cleared: {
                type: Boolean,
                default: false,
            },
        },
        verified: {
            type: Date,
        },
        verificationToken: {
            type: String,
        },
        tokenExpirationDate: {
            type: Date,
        },
        passwordToken: {
            type: String,
        },
        passwordTokenExpirationDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

//populate with ratings

DriverSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
});

DriverSchema.methods.ComparePassword = async function (enteredPassword) {
    return compare(enteredPassword, this.password);
};

module.exports = model("Driver", DriverSchema);
