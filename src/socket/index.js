import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let comments = [];

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('newComment', (comment) => {
    comments.push(comment);
    io.emit('newComment', comment);
  });

  socket.on('deleteComment', (commentId) => {
    comments = comments.filter((comment) => comment.id !== commentId);
    io.emit('deleteComment', commentId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3001, () => {
  console.log('Socket.io server listening on port 3001');
});