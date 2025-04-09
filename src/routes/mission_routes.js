const express = require('express');
const { getMission, storeMission } = require('../controllers/mission_controller');
const router = express.Router();

router.get('/', getMission);
router.post('/store', storeMission); 

module.exports = router;
