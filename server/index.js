const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:3000/*", 
            "http://localhost:8080", 
            "http://localhost:5000/*",
            "https://planning.hpop.dev", 
            "http://planning.hpop.dev",
            ],
        methods: ["GET", "POST"],
        credentials: false
    }
});

// var corsOptions = {
//     origin: 'http://localhost:5000/*',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }

// app.use(cors());
// app.options('/', cors()) 

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, './dist/index.html'));
//   });

// app.use('/', express.static(path.join(__dirname, 'dist')));

server.listen(3000, () => {
    console.log('Listening on port *: 3000');
});


var connections = 0;
var users = {};
var estimates = {};

var allowedEsimates = ["1", "2", "3", "5", "8", "13", "???", "Pass"];

io.on('connection', (socket) => {
    var addedUser = false;

    //console.log("connected");
    //connections++;
    io.emit('connections', connections);
    //console.log(socket);

    io.emit('allowedEsimates', allowedEsimates);

    socket.on('disconnect', () => {
        //console.log("A user disconnected");
        //io.emit('connections', connections);
        if (addedUser) {
            connections--;
            // echo globally that this client has left
            io.emit('user left', {
                username: socket.username,
                connections: connections
            });

            delete users[socket.id]
            delete estimates[socket.id]
            getUsernames();
        }
    });

    // when the client emits 'add user', this listens and executes
    socket.on('joined', (username) => {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        connections++;
        addedUser = true;

        users[socket.id] = { username: username };

        socket.emit('login', {
            connections: connections
        });

        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            connections: connections
        });
        getUsernames();
    });

    // socket.on('leave', (data) => {
    //     socket.broadcast.emit('leave', (data));
    // });

    getUsernames = () => {
        io.emit('userPool', users);
    };

    socket.on('sendEstimate', (estimate) => {
        estimates[socket.id] = estimate;
        users[socket.id]["voted"] = true;
        io.emit('updateBored', {
            estimates: Object.keys(estimates),
            users: users
        })
    });

    socket.on('showEstimates', () => {
        io.emit('displayEstimates', {
            estimates,
            users,
        });
    });

    socket.on('resetGameRequest', () => {
        estimates = {};
        for (const user in users) {
            if (Object.hasOwnProperty.call(users, user)) {
                users[user]["voted"] = false;
            }
        }
        io.emit('resetGame', {
            estimates: [],
            users: users
        });
    });

    socket.on('echoTaskId', (taskId) => {
        socket.broadcast.emit('updateTaskId', taskId);
    });

});