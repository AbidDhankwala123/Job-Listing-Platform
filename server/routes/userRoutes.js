const express = require("express");
const router = express.Router();
const { checkHealth, getUsers, registeredUser, loginUser } = require("../controllers/userController")

router.get("/health", checkHealth);

router.get("/", getUsers);

router.post("/register", registeredUser);

router.post("/login", loginUser);

module.exports = router;