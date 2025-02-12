const express = require('express')
const { login, signup, logout } = require('../controllers/userController')
const {protected} = require('../middlewares/authMiddleware.js')

const router = express.Router()


router.post('/login', login)
router.post('/signup', signup)
router.post('/logout', protected, logout)


module.exports = router