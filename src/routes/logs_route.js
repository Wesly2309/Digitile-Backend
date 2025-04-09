const express = require('express');
const router = express.Router();
const { getLogs, storeLog, getLogDetails } = require('../controllers/logs_controller');

router.get('/', getLogs);
router.post('/store', storeLog); 
router.get('/detail/:id', getLogDetails); 

module.exports = router;
