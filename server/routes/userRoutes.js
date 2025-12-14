const express = require("express");
const router = express.Router();
const { getUsers, registeredUser, loginUser } = require("../controllers/userController")

router.get("/", getUsers);

router.post("/register", registeredUser);

router.post("/login", loginUser);

module.exports = router;