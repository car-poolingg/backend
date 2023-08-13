const Driver = require("../../models/driver.model/driver");
const utils = require("../../utils");
const customApiError = require("../../errors");

const AddDriverDocument = async (req, res) => {
    const driverLicense = req.files.dlicense.tempFilePath;
    const driverLicenseNo = req.files.dlicenseNo.tempFilePath;
    const driverPhoto = req.files.dphoto.tempFilePath;
    const frontViewCarPhoto = req.files.fViewPhoto.tempFilePath;
    const backViewCarPhoto = req.files.bViewPhoto.tempFilePath;
    const intCarPhoto = req.files.interiorPhoto.tempFilePath;
    const vehicleColor = req.body.vehicleColor;
    const vehicleYear = req.body.vehicleYear;
    const VehicleMM = req.body.VehicleMM;
    const licensePlate = req.body.licensePlate;
    const driverInsurance = req.files.dinsurance.tempFilePath;
    const driverInspection = req.files.dinspection.tempFilePath;

    





    const uploadedImage = await utils.uploadImage(driverLicense, req.driver.driverId);
    const uploadedDPhoto = await utils.uploadImage(driverPhoto, req.driver.driverId);
    const uploadedFrontPhoto = await utils.uploadImage(frontViewCarPhoto, req.driver.driverId);
    const uploadedBackPhoto = await utils.uploadImage(backViewCarPhoto, req.driver.driverId);
    const uploadedIntPhoto = await utils.uploadImage(intCarPhoto, req.driver.driverId);
    const uploadedDriverInsurance =  await utils.uploadImage(driverInsurance, req.driver.driverId);
    const uploadedDriverInspection =  await utils.uploadImage(driverInspection, req.driver.driverId);

    console.log(uploadedImage);
    

    if (!uploadedImage) new customApiError.NotFoundError("Error uploading image");
    if (!uploadedDPhoto) new customApiError.NotFoundError("Error uploading image");
    if (!uploadedFrontPhoto) new customApiError.NotFoundError("Error uploading image");
    if (!uploadedBackPhoto) new customApiError.NotFoundError("Error uploading image");
    if (!uploadedIntPhoto) new customApiError.NotFoundError("Error uploading image");
    if (!uploadedDriverInsurance) new customApiError.NotFoundError("Error uploading image");
    if (!uploadedDriverInspection) new customApiError.NotFoundError("Error uploading image");





    const driver = await Driver.findById(req.driver.driverId).select("-password");
    driver.driverLicense = uploadedImage.secure_url;
    driver.driverPhoto =  uploadedDPhoto.secure_url;
    driver.frontViewCarPhoto = uploadedFrontPhoto.secure_url;
    driver.backViewCarPhoto = uploadedBackPhoto.secure_url;
    driver.intCarPhoto = uploadedIntPhoto.secure_url;
    driver.driverInsurance = uploadedDriverInsurance.secure_url;
    driver.driverInspection = uploadedDriverInspection.secure_url;
    driver.vehicleYear = vehicleYear;
    driver.VehicleMM = VehicleMM;
    driver.licensePlate = licensePlate;
    driver.vehicleColor = vehicleColor;
    driver.driverLicenseNo = driverLicenseNo;


    await driver.save();
    console.log(driver.driverLicense)

    return res.status(200).json({ driver });
};



const updateDriver = async (req, res) => {
    const payload = req.body;
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
