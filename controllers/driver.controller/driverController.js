const Driver = require("../../models/driver.model/driver");
const utils = require("../../utils");
const customApiError = require("../../errors");

const AddDriverDocument = async (req, res) => {
    const { dlicense, dphoto, fViewPhoto, bViewPhoto, interiorPhoto, dinsurance, dinspection } = req.files;
    const { vehicleColor, vehicleYear, VehicleMM, licensePlate, dlicenseNo, firstName, lastName, gender, description, email, phoneNo, dateOfBirth, city, state, homeAddress } = req.fields;

    const uploadedImage = await utils.uploadImage(dlicense.path, req.driver.driverId);
    const uploadedDPhoto = await utils.uploadImage(dphoto.path, req.driver.driverId);
    const uploadedFrontPhoto = await utils.uploadImage(fViewPhoto.path, req.driver.driverId);
    const uploadedBackPhoto = await utils.uploadImage(bViewPhoto.path, req.driver.driverId);
    const uploadedIntPhoto = await utils.uploadImage(interiorPhoto.path, req.driver.driverId);
    const uploadedDriverInsurance = await utils.uploadImage(dinsurance.path, req.driver.driverId);
    const uploadedDriverInspection = await utils.uploadImage(dinspection.path, req.driver.driverId);

    if (!uploadedImage) new customApiError.NotFoundError("Error uploading image");
    if (!uploadedDPhoto) new customApiError.NotFoundError("Error uploading image");
    if (!uploadedFrontPhoto) new customApiError.NotFoundError("Error uploading image");
    if (!uploadedBackPhoto) new customApiError.NotFoundError("Error uploading image");
    if (!uploadedIntPhoto) new customApiError.NotFoundError("Error uploading image");
    if (!uploadedDriverInsurance) new customApiError.NotFoundError("Error uploading image");
    if (!uploadedDriverInspection) new customApiError.NotFoundError("Error uploading image");

    const driver = await Driver.findById(req.driver.driverId).select("-password");
    driver.driverLicense = uploadedImage.secure_url;
    driver.driverPhoto = uploadedDPhoto.secure_url;
    driver.frontViewCarPhoto = uploadedFrontPhoto.secure_url;
    driver.backViewCarPhoto = uploadedBackPhoto.secure_url;
    driver.intCarPhoto = uploadedIntPhoto.secure_url;
    driver.driverInsurance = uploadedDriverInsurance.secure_url;
    driver.driverInspection = uploadedDriverInspection.secure_url;
    driver.vehicleYear = vehicleYear;
    driver.VehicleMM = VehicleMM;
    driver.licensePlate = licensePlate;
    driver.vehicleColor = vehicleColor;
    driver.driverLicenseNo = dlicenseNo;
    driver.firstName = firstName;
    driver.lastName = lastName;
    driver.gender = gender;
    driver.description = description;
    driver.email = email;
    driver.phoneNo = phoneNo;
    driver.dateOfBirth = dateOfBirth;
    driver.city = city;
    driver.state = state;
    driver.homeAddress = homeAddress;

    await driver.save();

    // send credentials to mail

    return res.status(200).json({
        driver,
        message: "Your documents have been uploaded successfully.",
    });
};

const updateDriver = async (req, res) => {
    const payload = req.fields;
    const driver = await Driver.findByIdAndUpdate({ _id: req.driver.driverId }, { ...payload }, { new: true, runValidators: true }).select("-password");
    if (!driver) throw new customApiError.NotFoundError("Driver not found.");
    return res.status(200).json({ driver });
};

const showCurrentDriver = async (req, res) => {
    const driver = await Driver.findById(req.driver.driverId).select("-password");
    if (!driver) throw new customApiError.NotFoundError("Driver not found.");

    res.status(200).json({ driver });
};

module.exports = {
    showCurrentDriver,
    updateDriver,
    AddDriverDocument,
};
