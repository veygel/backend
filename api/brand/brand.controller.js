const brandService = require('./brand.service')

async function getBrand(req, res) {
    const brand = await brandService.getById(req.params.id)
    res.send(brand)
}

async function getBrands(req, res) {
    const brands = await brandService.query(req.body)
    res.send(brands)
}

async function addBrand(req, res) {
    console.log('is it?', req.body)
    const brand = await brandService.add(req.body)
    res.send(brand)
}

async function deleteBrand(req, res) {
    await brandService.remove(req.params.id)
    res.end()
}

async function updateBrand(req, res) {
    const brand = req.body;
    await brandService.update(brand)
    res.send(brand)
}

module.exports = {
    getBrand,
    getBrands,
    deleteBrand,
    updateBrand,
    addBrand
}