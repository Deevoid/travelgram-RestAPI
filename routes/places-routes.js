const express = require("express");
const router = express.Router();

const placeControllers = require("../controllers/placeControllers");

router.get("/", placeControllers.getPlaces);

router.get("/:pid", placeControllers.getPlaceById);

router.get("/user/:uid", placeControllers.getPlaceByUserId);

router.post("/", placeControllers.createPlace);

router.patch("/:pid", placeControllers.updatePlace);

router.delete("/:pid", placeControllers.deletePlace);

module.exports = router;
