const express = require('express')
const {getUserByToken , getUserById, updateProfile} = require('../controllers/user_controller')
const tokenMiddleware = require('../utils/middleware')
const router = express.Router()

router.use(tokenMiddleware)
router.get('/', getUserByToken)
router.get('/:id'  , getUserById)
router.put('/update' , updateProfile)

module.exports = router