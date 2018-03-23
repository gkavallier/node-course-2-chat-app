const path = require('path');
const http = require('http');  // necessary to work with socket.io
const express = require('express');
const socketIO = require('socket.io');


const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT  || 3000;
var app = express();
var server = http.createServer(app); // necessary for socket.io
var io = socketIO(server); // necessary for socket.io to get the web socket server
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

 
    socket.on('join', (params,callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }
        socket.join(params.room);
        users.removeUser(socket.id); // if user existed in prev room, remove him first then add to new room
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        // io.emit = emits to everyone connected
        // io.to('roomname').emit = emits to everione in roomname
        // socket.broadcast.emit = emits to everone connected on socket except current user
        // socket.broadcast.to('roomname').emit = emits to everyone in roomname except currentuser
        // socket.emit = emits specifically to one user
        // 
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat App!'));

        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));


        callback();
    });

    socket.on('createMessage', (message, callback) => {
        var user = users.getUser(socket.id);

        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
       
        
       // callback('This is from the server');
        callback();
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // })

    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);

        if (user ) {

            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }

    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left.`));
        }
    });
});



server.listen(port, () => {
    console.log(`server is up on port ${port}...`);
});