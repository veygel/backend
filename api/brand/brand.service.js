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
    const collection = await dbService.getCollection('brand')
    try {
        let brands = await collection.find(criteria).toArray();
        brands.forEach(brand => delete brand.password);
        return brands
    } catch (err) {
        console.log('ERROR: cannot find brands')
        throw err;
    }
}

async function getById(brandId) {
    const collection = await dbService.getCollection('brand')
    try {
        let brand = await collection.findOne({ "_id": ObjectId(brandId) })
        delete brand.password;
        return brand;
    } catch (err) {
        console.log(`ERROR: while finding brand ${brandId}`)
        throw err;
    }
}

async function remove(brandId) {
    const collection = await dbService.getCollection('brand')
    try {
        await collection.deleteOne({ "_id": ObjectId(brandId) })
    } catch (err) {
        console.log(`ERROR: cannot remove brand ${brandId}`)
        throw err;
    }
}

async function update(brand) {
    const collection = await dbService.getCollection('brand')
    brand._id = ObjectId(brand._id);
    try {
        await collection.replaceOne({ "_id": brand._id }, { $set: brand })
        return brand
    } catch (err) {
        console.log(`ERROR: cannot update brand ${brand._id}`)
        throw err;
    }
}

async function add(brand) {
    const collection = await dbService.getCollection('brand')
    try {
        await collection.insertOne(brand);
        return brand;
    } catch (err) {
        console.log(`ERROR: cannot insert brand`)
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.txt) {
        criteria.name = filterBy.txt
    }
    return criteria;
}