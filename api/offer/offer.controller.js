const offerService = require('./offer.service')

async function getOffer(req, res) {
    const offer = await offerService.getById(req.params.id)
    res.send(offer)
}

async function getOffers(req, res) {
    const offers = await offerService.query(req.query)
    res.send(offers)
}
async function addOffer(req, res) {
    const offers = await offerService.query(req.query)
    res.send(offers)
}

async function deleteOffer(req, res) {
    await offerService.remove(req.params.id)
    res.end()
}

async function updateOffer(req, res) {
    const offer = req.body;
    await offerService.update(offer)
    res.send(offer)
}

module.exports = {
    getOffer,
    getOffers,
    addOffer,
    deleteOffer,
    updateOffer
}