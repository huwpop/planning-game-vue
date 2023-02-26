const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: [],
    methods: ['GET', 'POST'],
    credentials: false,
  },
});

app.use('/', express.static(path.join(__dirname, 'dist')));
server.listen(process.env.PORT, () => {
  console.log(`Listening on port *: ${process.env.PORT}`);
});

var connections = 0;
var users = {};
//var estimates = {};

var allowedEsimates = ['1', '2', '3', '5', '8', '???', 'Pass'];

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
        connections: connections,
      });

      delete users[socket.id];
      //delete estimates[socket.id]
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
      connections: connections,
    });

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      connections: connections,
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
    //estimates[socket.id] = estimate;
    if (socket.id in users) {
      users[socket.id]['voted'] = true;
      users[socket.id]['estimate'] = estimate;
      io.emit('updateBored', {
        users: users,
      });
    } else {
      console.log(`ID:${socket.id} not in users list ${users}`);
    }
  });

  socket.on('showEstimates', () => {
    //console.log(estimates);
    //console.log(users);
    io.emit('displayEstimates', {
      displayEstimates: true,
      users,
    });
  });

  socket.on('resetGameRequest', () => {
    for (const user in users) {
      if (Object.hasOwnProperty.call(users, user)) {
        users[user]['voted'] = false;
        users[user]['estimate'] = false;
      }
    }
    io.emit('resetGame', {
      users: users,
      displayEstimates: false,
    });
  });

  socket.on('echoTaskId', (taskId) => {
    socket.broadcast.emit('updateTaskId', taskId);
  });

  socket.on('bootAll', () => {
    users = {};
    io.emit('bootAll');
    socket.removeAllListeners();
  });

  socket.on('showStats', () => {
    var stats = {
      headers: allowedEsimates,
      data: [],
    };
    io.emit('showStats', stats);
  });
});
