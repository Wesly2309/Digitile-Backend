const express = require('express')
const {getUserByToken , getUserById} = require('../controllers/user_controller')
const router = express.Router()


router.get('/', getUserByToken)
router.get('/:id'  , getUserById)

module.exports = router