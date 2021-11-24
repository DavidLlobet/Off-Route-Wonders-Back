const express = require("express");

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
router.get("/:country", getPlacesByCountry);
router.get("/:id", getPlaceById);
router.post("/create/:id", createPlace);
router.put("/update/:id", updatePlaceById);
router.delete("/delete/:id", deletePlaceById);

module.exports = router;
