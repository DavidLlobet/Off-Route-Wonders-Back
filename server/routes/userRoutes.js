const express = require("express");

const {
  userLogin,
  userSignUp,
  getUserById,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/login", userLogin);
router.post("/register", userSignUp);
router.get("/:id", getUserById);

module.exports = router;
