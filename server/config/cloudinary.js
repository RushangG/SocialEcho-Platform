const cloudinary = require("cloudinary").v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Folder names for different asset types
const FOLDERS = {
  COMMUNITIES: "socialecho/communities/banners",
  USER_AVATARS: "socialecho/user-avatars",
  POST_FILES: "socialecho/post-files",
};

module.exports = {
  cloudinary,
  FOLDERS,
};



