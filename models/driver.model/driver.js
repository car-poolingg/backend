const { Schema, model } = require("mongoose");
const validator = require("validator");

const DriverSchema = new Schema(
    {
        phone: {
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
        vehicleColor: {
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
        extCarPhoto: {
            type: String,
        },
        intCarPhoto: {
            type: String,
        },
        vehicleColor: {
            type: String,
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
