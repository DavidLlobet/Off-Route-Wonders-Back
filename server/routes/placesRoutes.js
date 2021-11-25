const express = require("express");
const auth = require("../middlewares/auth");

const {
  getAllPlaces,
  getPlacesByCountry,
  getPlaceById,
  createPlace,
  updatePlaceById,
  deletePlaceById,
} = require("../controllers/placesControllers");

const router = express.Router();

router.get("/", getAllPlaces);
router.get("/country/:country", getPlacesByCountry);
router.get("/:id", getPlaceById);
router.post("/create", auth, createPlace);
router.put("/update/:id", auth, updatePlaceById);
router.delete("/delete/:id", auth, deletePlaceById);

module.exports = router;
