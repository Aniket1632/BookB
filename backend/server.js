import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

import constant from './config/index.js';
import { Server } from 'socket.io';
import { firstAppointment,firstLogin } from './socket/socketReward.js'

import { SocketConnection } from './socket/connection.js';
const server = http.Server(app);

// DATABASE CONNECTION
connectDB();

// SOCKET CONNECTION 


// SERVER LISTEN
const PORT = constant.PORT || 9191;
server.listen(PORT, console.log(`Server Running in ${constant.NODE_ENV} mode on PORT ${PORT}`));
const io = new Server(server, {
  allowEIO3: true,
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
io.use(async (socket, next) => {
  try {
    const id = socket.handshake.query.id;
    const timezone = socket.handshake.query.timezone;
    socket.userId = id;
    socket.timezone = timezone;
    next();
  } catch (err) { }
});
export let onlineUsers = [];
io.on('connection', (socket) => {
  const user = { user: socket.handshake.query.user, stylist: socket.handshake.query.stylist, socketId: socket.id, role: socket.handshake.query.role, salon: socket.handshake.query.salon }
  onlineUsers = onlineUsers.filter(user => user.userId !== user.userId);
  onlineUsers.push(user);
  console.log(onlineUsers);
  io.emit('online-users', { onlineUsers });
  io.emit('connection', {});
  socket.on('test-message', () => {
    console.log('myEvent triggered');
  });

  socket.on('first-appointment-booked', async (socket) => {
    try {
      const {user } = socket
      let rewardData = await firstAppointment(user);
      if (rewardData) {
        io.emit('first-appointment-reward', rewardData);
      }
    } catch (error) {
      console.error('Error handling appointment event:', error);
    }
  });

  socket.on('first-login', async (socket) => {
    try {
        const { user } = socket ;
        const data = await firstLogin(user);
        if(data){
          io.to(socket.id).emit('firstLogin',data);
        }

    } catch (error) {
      console.error(error);
    }
  })




});
app.set('server-socket', io);
// SocketConnection(io)