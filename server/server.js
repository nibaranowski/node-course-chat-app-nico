const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// app.get('/', authenticate, (req, res) => {
//     console.log('hello world');
// });

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    // socket.emit('newEmail', { //email IN
    //     from: "mike@example.com",
    //     text: "hey what is going on",
    //     createdAt: 123
    // });

    socket.emit('newMessage', { //message IN
        from: "mike",
        text: "hey what is going on",
        createdAt: 123
    });


    // socket.on('createEmail', (newEmail) => { //email OUT
    //     console.log('createEmail', newEmail);
    // });

    socket.on('createMessage', (newMessage) => { //message OUT
        console.log('createMessage', newMessage);
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected')
    })
});


server.listen(port, () => {
    console.log(`Started on port ${port}`);
})

module.exports={app};
