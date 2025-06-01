const express = require("express");

const {
  leaderBoard,
  topCapsule,
} = require("../controllers/feature_controller");
const router = express.Router();

router.get("/leaderboard", leaderBoard);
router.get("/topbycapsule", topCapsule);
module.exports = router;
