const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getOffer, addOffer, getOffers, deleteOffer, updateOffer } = require('./offer.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getOffers)
router.get('/:id', getOffer)
router.post('/', addOffer);
router.put('/:id', requireAuth, updateOffer)
router.delete('/:id', requireAuth, deleteOffer)

module.exports = router