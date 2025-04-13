const express = require('express');
const { getMission, storeMission, getMissionDetails } = require('../controllers/mission_controller');
const router = express.Router();

router.get('/', getMission);
router.post('/store', storeMission); 
router.get('/detail/:id', getMissionDetails); 

module.exports = router;
