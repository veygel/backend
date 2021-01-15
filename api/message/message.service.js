const dbService = require("../../services/db.service");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
    query,
    remove,
    add
};
async function query(filterBy = {}) {
    const collection = await dbService.getCollection("message");
    try {
        let messages;
        const criteria = { to: filterBy.userId };
        messages = await collection.find(criteria).toArray();
        return messages;
    } catch (err) {
        console.log("ERROR: cannot find messages");
        throw err;
    }
}

async function remove(message) {
    console.log(message._id);
    const collection = await dbService.getCollection("message");
    try {
        await collection.deleteOne({ _id: ObjectId(message._id) });
    } catch (err) {
        console.log(`ERROR: cannot remove message ${message}`);
        throw err;
    }
}

async function add(message) {
    const collection = await dbService.getCollection("message");
    try {
        await collection.insertOne(message);
        return message;
    } catch (err) {
        console.log(`ERROR: cannot insert message`);
        throw err;
    }
}