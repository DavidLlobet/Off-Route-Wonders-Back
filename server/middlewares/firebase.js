const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "off-route-wonders.appspot.com",
});

const uploadFirebase = async (req, res, next) => {
  const bucket = admin.storage().bucket();
  try {
    req.body.images = [];

    const getImages = req.files.map(async (image) => {
      await bucket.upload(image.path);
      await bucket.file(image.filename).makePublic();
      const fileURL = bucket.file(image.filename).publicUrl();
      return fileURL;
    });
    const images = await Promise.all(getImages);
    req.body.images = images;
    next();
  } catch (error) {
    error.code = 400;
    error.message = "Cannot upload the images";
    next(error);
  }
};
module.exports = uploadFirebase;
