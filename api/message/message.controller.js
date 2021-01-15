const messageService = require('./message.service')

async function getMessage(req, res) {
    const message = await messageService.getById(req.params.id)
    res.send(message)
}

async function getMessages(req, res) {
    const messages = await messageService.body(req.body)
    res.send(messages)
}
async function addMessage(req, res) {
    console.log(req.body)
    const message = await messageService.add(req.body)
    res.send(message)
}

async function deleteMessage(req, res) {
    await messageService.remove(req.params.id)
    res.end()
}

async function updateMessage(req, res) {
    const message = req.body;
    await messageService.update(message)
    res.send(message)
}

module.exports = {
    getMessage,
    getMessages,
    addMessage,
    deleteMessage,
    updateMessage
}