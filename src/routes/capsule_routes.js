const express = require('express')
const { getCapsules, createCapsule, detailCapsule, updateCapsule, deleteCapsule } = require('../controllers/capsule_controller')
const upload = require('../utils/upload')
const tokenMiddleware = require('../utils/middleware')
const router = express.Router()

router.use(tokenMiddleware)
router.get('/' , getCapsules)
router.post('/store' , upload.single('image') , createCapsule)
router.get('/detail/:id' , detailCapsule)
router.put('/update/:id' , updateCapsule)
router.delete('/delete/:id', deleteCapsule)
module.exports = router 