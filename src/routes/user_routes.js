const express = require('express')
const {getUserByToken , getUserById, updateProfile , getAllUsers} = require('../controllers/user_controller')
const tokenMiddleware = require('../utils/middleware')
const upload = require('../utils/upload')
const router = express.Router()

router.get('/user' , getAllUsers )
router.use(tokenMiddleware)
router.get('/', getUserByToken)
router.get('/:id'  , getUserById)
router.patch('/update' ,  upload.single('profile') , updateProfile)

module.exports = router
