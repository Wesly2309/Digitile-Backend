const express = require('express')
const { getCapsules, createCapsule, detailCapsule, updateCapsule, deleteCapsule } = require('../controllers/capsule_controller')
const router = express.Router()

router.get('/' , getCapsules)
router.post('/store' , createCapsule)
router.get('/detail/:id' , detailCapsule)
router.put('/update/:id' , updateCapsule)
router.delete('/delete/:id', deleteCapsule)
module.exports = router 