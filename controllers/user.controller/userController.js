const User = require("../../models/user.model/user");
const utils = require("../../utils");
const customApiError = require("../../errors");



const AddUserImage = async (req, res, next) => {};

const updateUser = async (req, res) => {

        const userId = req.params.userId;
        const payload = req.body
        const user = await User.findByIdAndUpdate({_id: userId},{...payload},{new: true})
        if (!user) throw new customApiError.NotFoundError("User not found.");
        return res.status(200).send(user)
  
    
};
// I don't understand what you mean by showCurrentUser
const showCurrentUser = async (req, res) => {};

module.exports = {
    showCurrentUser,
    updateUser,
    AddUserImage,
};
