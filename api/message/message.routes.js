const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getMessage, addMessage, getMessages, deleteMessage, updateMessage } = require('./message.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getMessages)
router.get('/:id', getMessage)
router.post('/', addMessage);
router.put('/:id', requireAuth, updateMessage)
    // router.delete('/:id', requireAuth, deleteMessage)
router.delete('/:id', deleteMessage)

module.exports = router