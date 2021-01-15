const dbService = require("../../services/db.service");
const mongoDBCriteria = require('./mongoDB.criteria.js')
const ObjectId = require("mongodb").ObjectId;

module.exports = {
    query,
    getById,
    remove,
    update,
    add
};

async function query(filterBy = {}) {

    const collection = await dbService.getCollection("influencer");
    try {
        let influencers;
        if (filterBy.topRated) {
            const topRated = await mongoDBCriteria.getTopRated(filterBy);
            influencers = await collection.find(topRated).limit(+filterBy.topRated).toArray();
        } else {
            const criteria = await mongoDBCriteria.buildCriteria(filterBy);
            influencers = await collection.find(criteria).toArray();
        }

        return influencers;
    } catch (err) {
        console.log("ERROR: cannot find influencers");
        throw err;
    }
}

async function getById(influencerId) {
    const collection = await dbService.getCollection("influencer");
    try {
        let influencer = await collection.findOne({ _id: ObjectId(influencerId) });
        return influencer;
    } catch (err) {
        console.log(`ERROR: while finding influencer ${influencerId}`);
        throw err;
    }
}

async function remove(influencerId) {
    console.log(influencerId);
    const collection = await dbService.getCollection("influencer");
    try {
        await collection.deleteOne({ _id: ObjectId(influencerId) });
    } catch (err) {
        console.log(`ERROR: cannot remove influencer ${influencerId}`);
        throw err;
    }
}

async function update(influencer) {
    influencer.updatedAt = Date.now();
    const collection = await dbService.getCollection("influencer");
    influencer._id = ObjectId(influencer._id);
    try {
        await collection.replaceOne({ _id: influencer._id }, { $set: influencer });
        return influencer;
    } catch (err) {
        console.log(`ERROR: cannot update influencer ${influencer._id}`);
        throw err;
    }
}

async function add(influencer) {
    influencer.createdAt = Date.now();
    influencer = _setSocialInfo(influencer)
    const collection = await dbService.getCollection("influencer");
    try {
        await collection.insertOne(influencer);
        return influencer;
    } catch (err) {
        console.log(`ERROR: cannot insert influencer`);
        throw err;
    }
}

function _randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//fake data insert - for demo purposes only
function _setSocialInfo(influencer) {
    console.log(influencer.socials)
    influencer.socials = influencer.socials.map(social => {
        var currSocial = {
            type: social,
            menFollowers: _randomInt(10000, 10000000),
            womenFollowers: _randomInt(10000, 10000000),
            posts: _randomInt(1000, 1000000),
            stories: _randomInt(1000, 1000000),
            followersAvgAge: _randomInt(16, 50)
        };
        return currSocial;
    });
    return influencer;
}