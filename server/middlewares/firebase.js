const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "off-route-wonders.appspot.com",
});

const uploadFirebase = (req, res, next) => {
  const bucket = admin.storage().bucket();
  try {
    req.body.images = [];
    req.files.map(async (image) => {
      await bucket.upload(image.path);
      await bucket.file(image.filename).makePublic();
      const fileURL = bucket.file(image.filename).publicUrl();
      req.body.images.push(fileURL);
      next();
    });
  } catch (error) {
    error.code = 400;
    error.message = "Cannot upload the images";
    next(error);
  }
};
module.exports = uploadFirebase;
