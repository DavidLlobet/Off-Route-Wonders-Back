const express = require("express");
const auth = require("../middlewares/auth");

const {
  getAllPlaces,
  getPlacesByCountry,
  getPlaceById,
  createPlace,
  updatePlaceById,
  deletePlaceById,
  getPlacesByAuthor,
} = require("../controllers/placesControllers");
const uploadFirebase = require("../middlewares/firebase");
const upload = require("../middlewares/uploadLocal");

const router = express.Router();

router.get("/", getAllPlaces);
router.get("/country/:id", getPlacesByCountry);
router.get("/my-profile", auth, getPlacesByAuthor);
router.get("/:id", getPlaceById);
router.post(
  "/create",
  auth,
  upload.array("images"),
  uploadFirebase,
  createPlace
);
router.put("/update/:id", auth, updatePlaceById);
router.delete("/delete/:id", auth, deletePlaceById);

module.exports = router;
