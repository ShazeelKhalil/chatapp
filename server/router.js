const express = require("express");
const cors = require("cors");
const router = express.Router();
var corsOptions = {
  origin: "http//:localhost:5000",
  optionsSuccessStatus: 200,
};
router.use(cors(corsOptions));
router.get("/", (req, res) => {
  res.send("server is up and running");
});
module.exports = router;
