const express = require("express");

const tokenMiddleware = require("../utils/middleware");
const { leaderBoard } = require("../controllers/feature_controller");
const router = express.Router();

router.get("/leaderboard", leaderBoard);
router.use(tokenMiddleware);
module.exports = router;
