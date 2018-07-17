var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
    //
    // socket.emit('createEmail', { //email OUT
    //     to: 'jen@example.com',
    //     text: 'hey it is jen.'
    // });

    socket.emit('createMessage', { //message OUT
        from: 'jen',
        text: 'hey it is jen.'
    });
})

socket.on('disconnect', function () {
    console.log('Disconnected from server')
})

// socket.on('newEmail', function (email) { //email IN
//     console.log('New email', email);
// })

socket.on('newMessage', function (message) { //message IN
    console.log('New message', message);
})
