const messageService = require('../message/message.service')
const GET_USER_MESSAGES = "GET_USER_MESSAGES";
const USER_MESSAGES = "USER_MESSAGES";
const USER_NEW_MESSAGE = "USER_NEW_MESSAGE";

module.exports = connectSockets

function connectSockets(io) {
    io.on('connection', socket => {
        socket.on(GET_USER_MESSAGES, async userId => {
            let userInboxMsgs = await messageService.query({ userId });
            socket.emit(USER_MESSAGES, userInboxMsgs)
        })
        socket.on("ADD_MESSAGE", message => {
            messageService.add(message);
            io.to(socket.myTopic).emit(USER_NEW_MESSAGE, message)
        })
        socket.on("REMOVE_MESSAGE", message => {
                messageService.remove(message);
            })
            //will be used for chat
        socket.on('MSG_TOPIC', topic => {
            if (socket.myTopic) {
                socket.leave(socket.myTopic)
            }
            socket.join(topic)
            socket.myTopic = topic;
        })
    })
}