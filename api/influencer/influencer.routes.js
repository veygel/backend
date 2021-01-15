const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getInfluencer, addInfluencer, getInfluencers, deleteInfluencer, updateInfluencer } = require('./influencer.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getInfluencers)
router.get('/:id', getInfluencer)
router.post('/', addInfluencer);
router.put('/:id', requireAuth, updateInfluencer)
    // router.delete('/:id', requireAuth, deleteInfluencer)
router.delete('/:id', deleteInfluencer)

module.exports = router