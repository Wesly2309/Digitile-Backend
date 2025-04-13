const express = require('express')
const {getUserByToken , getUserById, updateProfile, deleteUser} = require('../controllers/user_controller')
const router = express.Router()


router.get('/', getUserByToken)
router.get('/:id'  , getUserById)
router.put('/update' , updateProfile)
router.delete('/delete/:id' , deleteUser)

module.exports = router