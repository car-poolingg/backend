const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "leksyking",
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
});

const uploadImage = async (file, userId) => {
    const result = await cloudinary.uploader.upload(file, {
        public_id: `car-poolingg/${userId}/photo`,
        folder: "car-poolingg",
        transformation: [{ gravity: "face", height: 400, width: 400, crop: "fill" }],
    });

    return result;
};

module.exports = uploadImage;
