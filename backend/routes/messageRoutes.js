const express = require('express')
const {protected} = require('../middlewares/authMiddleware')
const { sendMessage, fetchMessages } = require('../controllers/messageController')
const router = express.Router()

router.post('/', protected, sendMessage)
router.get('/:chatId', protected, fetchMessages)

module.exports = router