const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Game = require('./game');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const game = new Game();
const TICK_RATE = 1000 / 15; // 15 FPS for snake movement (classic feel)

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_game', (name) => {
    game.addPlayer(socket.id, name);
    socket.emit('init', { id: socket.id, width: 800, height: 600, gridSize: 20 });
  });

  socket.on('input', (direction) => {
    game.handleInput(socket.id, direction);
  });

  socket.on('respawn', () => {
    game.respawnPlayer(socket.id);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    game.removePlayer(socket.id);
  });
});

setInterval(() => {
  game.update();
  io.emit('game_state', game.getState());
}, TICK_RATE);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
