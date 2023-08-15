const User = require("../../models/user.model/user");
const utils = require("../../utils");
const customApiError = require("../../errors");

const AddUserImage = async (req, res) => {
    const fileStr = req.files.photo.path;

    const uploadedImage = await utils.uploadImage(fileStr, req.user.userId);

    if (!uploadedImage) new customApiError.NotFoundError("Error uploading image");

    const user = await User.findById(req.user.userId).select("-password");
    user.image = uploadedImage.secure_url;
    await user.save();

    return res.status(200).json({ user });
};

const updateUser = async (req, res) => {
    const payload = req.body;
    const user = await User.findByIdAndUpdate({ _id: req.user.userId }, { ...payload }, { new: true, runValidators: true }).select("-password");
    if (!user) throw new customApiError.NotFoundError("User not found.");
    return res.status(200).json({ user });
};

const showCurrentUser = async (req, res) => {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) throw new customApiError.NotFoundError("User not found.");

    res.status(200).json({ user });
};

module.exports = {
    showCurrentUser,
    updateUser,
    AddUserImage,
};
