const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('offer')
    
    try {
        let offers = await collection.find(criteria).toArray();
        console.log('OFFER', offers);
        
        return offers
    } catch (err) {
        console.log('ERROR: cannot find offers')
        throw err;
    }
}

async function getById(offerId) {
    const collection = await dbService.getCollection('offer')
    try {
        let offer = await collection.findOne({ "_id": ObjectId(offerId) })
        return offer;
    } catch (err) {
        console.log(`ERROR: while finding offer ${offerId}`)
        throw err;
    }
}

async function remove(offerId) {
    const collection = await dbService.getCollection('offer')
    try {
        await collection.deleteOne({ "_id": ObjectId(offerId) })
    } catch (err) {
        console.log(`ERROR: cannot remove offer ${offerId}`)
        throw err;
    }
}

async function update(offer) {
    const collection = await dbService.getCollection('offer')
    offer._id = ObjectId(offer._id);
    try {
        await collection.replaceOne({ "_id": offer._id }, { $set: offer })
        return offer
    } catch (err) {
        console.log(`ERROR: cannot update offer ${offer._id}`)
        throw err;
    }
}

async function add(offer) {
    const collection = await dbService.getCollection('offer')
    try {
        await collection.insertOne(offer);
        return offer;
    } catch (err) {
        console.log(`ERROR: cannot insert offer`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    
    var criteria = {};
    if (filterBy && filterBy.id) {
        criteria = {"miniInfluencer.id" : filterBy.id}
    }
    return criteria;
}