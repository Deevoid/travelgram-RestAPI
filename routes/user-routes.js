const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/userControllers");

router.get("/", userControllers.getUser);

router.get("/:uid", userControllers.getUserById);

router.post("/signup", userControllers.signup);

router.post("/login", userControllers.login);

module.exports = router;
