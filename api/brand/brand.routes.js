const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getBrand, addBrand, getBrands, deleteBrand, updateBrand } = require('./brand.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getBrands)
router.get('/:id', getBrand)
router.post('/', addBrand);
router.put('/:id', requireAuth, updateBrand)
router.delete('/:id', requireAuth, deleteBrand)

module.exports = router