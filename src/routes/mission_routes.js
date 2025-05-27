const express = require("express");
const {
  getMission,
  storeMission,
  getMissionDetails,
  complete,
  getAllMission,
} = require("../controllers/mission_controller");
const tokenMiddleware = require("../utils/middleware");
const router = express.Router();

router.get("/", getMission);
router.post("/store", storeMission);

router.use(tokenMiddleware);
router.get("/detail/:id", getMissionDetails);
router.put("/complete/:id", complete);

module.exports = router;
