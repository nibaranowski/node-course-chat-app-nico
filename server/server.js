const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

// app.get('/', authenticate, (req, res) => {
//     console.log('hello world');
// });

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    //console.log('new user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }

        socket.join(params.room);
        users.removeUser(socket.id); //make sure we don't add user already in the room..
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        callback(); //if no error we don't pass argument set as 'err'


        //socket.join('the room name')
        //socket.leave(params.room);

        // io.emit -> io.to('The Office Fans').newMessageHeight
        // socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit
        // socket.emit
    });

    socket.on('createMessage', (message, callback) => { //message OUT
        var user = users.getUser(socket.id);

        if (user && isRealString(message.text)) { //message is valid
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback();
    });

  socket.on('createLocationMessage', (coords) => {
      var user = users.getUser(socket.id);

      if (user) {
          io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
      }
  });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        console.log('User was disconnected')

        if (user) { //do things only if user was removed
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    })
});


server.listen(port, () => {
    console.log(`Started on port ${port}`);
})

module.exports={app};
