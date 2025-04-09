const express = require('express')
const {getUserByToken , getUserById, updateProfile} = require('../controllers/user_controller')
const router = express.Router()


router.get('/', getUserByToken)
router.get('/:id'  , getUserById)
router.put('/update' , updateProfile)

module.exports = router