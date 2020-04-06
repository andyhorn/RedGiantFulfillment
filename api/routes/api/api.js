const express = require("express");
const router = express.Router();

const dockerRoutes = require("./docker");
const authRoutes = require("./auth");

router.get("/", (req, res) => {
  res.send("Connected");
});

router.use("/docker", dockerRoutes);
router.use("/auth", authRoutes);

module.exports = router;
