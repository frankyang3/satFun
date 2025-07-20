const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

const players = {};

io.on('connection', (socket) => {
  console.log('a user connected');
  players[socket.id] = {
    x: 50,
    y: 50,
    id: socket.id,
  };

  socket.emit('currentPlayers', players);
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('move', (player) => {
    players[socket.id] = player;
    socket.broadcast.emit('move', players[socket.id]);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    delete players[socket.id];
    io.emit('disconnect', socket.id);
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
