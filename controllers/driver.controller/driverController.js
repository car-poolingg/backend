const User = require("../../models/user.model/user");
const utils = require("../../utils");
const customApiError = require("../../errors");

const AddUserImage = async (req, res) => {};

const updateUser = async (req, res) => {
    const payload = req.body;
    const user = await User.findByIdAndUpdate({ _id: req.driver.driverId }, { ...payload }, { new: true, runValidators: true }).select("-password");
    if (!user) throw new customApiError.NotFoundError("User not found.");
    return res.status(200).json({ user });
};

const showCurrentUser = async (req, res) => {
    const user = await User.findById(req.driver.driverId).select("-password");
    if (!user) throw new customApiError.NotFoundError("User not found.");

    res.status(200).json({ user });
};

module.exports = {
    showCurrentUser,
    updateUser,
    AddUserImage,
};
