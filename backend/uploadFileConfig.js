const multer = require('multer');
const fs = require("fs");
const path = require("path");


const ProfileImageFolder = "profileImages";
const EventImageFolder = "eventImages";

const uploadProfileDir = path.join(__dirname, ProfileImageFolder);
const uploadEventImageDir = path.join(__dirname, EventImageFolder);

if (!fs.existsSync(uploadProfileDir)) {
  fs.mkdirSync(uploadProfileDir, { recursive: true });
}

if (!fs.existsSync(uploadEventImageDir)) {
  fs.mkdirSync(uploadEventImageDir, { recursive: true });
}


const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadProfileDir); 
  },
  filename: (req, file, cb) => {
    const uniqueProfileName = Date.now() + "-" + file.originalname;
    cb(null, uniqueProfileName);
  },
});

const eventImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadEventImageDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const uploadProfileImage = multer({ storage: profileImageStorage });
const uploadEventImage = multer({ storage: eventImageStorage });

module.exports = {
  ProfileImageFolder,
  EventImageFolder,
  uploadProfileImage,
  uploadEventImage,
};
