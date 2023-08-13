const Driver = require("../../models/driver.model/driver");
const utils = require("../../utils");
const customApiError = require("../../errors");

const AddDriverDocument = async (req, res) => {
    const driverInspection = req.files.document.tempFilePath;

    const uploadedImage = await utils.uploadImage(driverInspection, req.driver.driverId);
    console.log(uploadedImage);

    if (!uploadedImage) new customApiError.NotFoundError("Error uploading image");

    const driver = await Driver.findById(req.user.userId).select("-password");
    driver.image = uploadedImage.secure_url;
    await driver.save();

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
