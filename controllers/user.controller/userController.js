const User = require("../../models/user.model/user");
const utils = require("../../utils");
const customApiError = require("../../errors");


const AddUserImage = async (req, res) => {
    const cloudinary = utils.cloudinary;
    const fileStr = req.body.data; // Base64-encoded image data from the client
  
    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(fileStr, {
    upload_preset: 'YOUR_UPLOAD_PRESET' 
    });

    if(!uploadedImage) throw new customApiError.NotFoundError('Error uploading image');
    return res.status(200).send(uploadedImage)
    
    
}

const updateUser = async (req, res) => {

        const userId = req.params.userId;
        const payload = req.body
        const user = await User.findByIdAndUpdate({_id: userId},{...payload},{new: true})
        if (!user) throw new customApiError.NotFoundError("User not found.");
        return res.status(200).send(user)
  
    
};

const showCurrentUser = async (req, res) => {
    const user = await User.findById(req.user)
    if (!user) throw new customApiError.NotFoundError("User not found.");

    res.status(200).json({
        
    })
};

module.exports = {
    showCurrentUser,
    updateUser,
    AddUserImage,
};
