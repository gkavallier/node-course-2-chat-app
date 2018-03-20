const path = require('path');
const http = require('http');  // necessary to work with socket.io
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT  || 3000;
var app = express();
var server = http.createServer(app); // necessary for socket.io
var io = socketIO(server); // necessary for socket.io to get the web socket server


app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat App!'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User has joined.'));


    socket.on('createMessage', (message) => {

        console.log('created message', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});



server.listen(port, () => {
    console.log(`server is up on port ${port}...`);
});