const express = require('express')
const router = express.Router()
const {getGeoLocations , storeGeoLocation , detailGeoLocation , updateGeoLocation , deleteGeoLocation} = require('../controllers/geolocation_controller')

router.get('/' , getGeoLocations)
router.post('/store' , storeGeoLocation)
router.get('/detail/:id' , detailGeoLocation)
router.put('/update/:id' , updateGeoLocation)
router.delete('/delete/:id' , deleteGeoLocation)

module.exports = router