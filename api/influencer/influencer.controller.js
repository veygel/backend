const influencerService = require('./influencer.service')

async function getInfluencer(req, res) {
    const influencer = await influencerService.getById(req.params.id)
    res.send(influencer)
}

async function getInfluencers(req, res) {
    const influencers = await influencerService.query(req.query)
    res.send(influencers)
}
async function addInfluencer(req, res) {
    const influencer = await influencerService.add(req.body)
    res.send(influencer)
}

async function deleteInfluencer(req, res) {
    await influencerService.remove(req.params.id)
    res.end()
}

async function updateInfluencer(req, res) {
    const influencer = req.body;
    await influencerService.update(influencer)
    res.send(influencer)
}

module.exports = {
    getInfluencer,
    getInfluencers,
    addInfluencer,
    deleteInfluencer,
    updateInfluencer
}