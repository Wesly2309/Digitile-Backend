const express = require('express');
const { getMission, storeMission, getMissionDetails, complete , getallMissions } = require('../controllers/mission_controller');
const router = express.Router();

router.get('/missions', getallMissions )
router.get('/', getMission);
router.post('/store', storeMission); 
router.get('/detail/:id', getMissionDetails); 
router.put('/complete/:id' , complete)

module.exports = router;
