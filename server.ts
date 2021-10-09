import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { passport } from './core/passport';

import { createRoomValidations } from './validations/createRoomValidations';
import { registerValidations } from './validations/register';
import { RoomCtrl } from './controllers/RoomController';
import { UserCtrl } from './controllers/UserController';

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://mongodb0.example.com:27017';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: CLIENT_URL,
  }),
);

app.use(passport.initialize());

io.on('connection', (socket: Socket) => {
  console.log('socket connected', socket.id);
});

app.post('/auth/signup', registerValidations, UserCtrl.create);
app.post('/auth/signin', passport.authenticate('local'), UserCtrl.login);
app.get(
  '/auth/me',
  passport.authenticate('jwt', { session: false }),
  UserCtrl.getMe,
);

app.post(
  '/room',
  passport.authenticate('jwt'),
  createRoomValidations,
  RoomCtrl.create,
);
app.get('/room', RoomCtrl.index);
app.get('/room/:id', RoomCtrl.show);
app.post('/room/:id', passport.authenticate('jwt'), RoomCtrl.sendMessage);

(async function () {
  try {
    await mongoose.connect(MONGODB_URI);
    httpServer
      .listen(PORT, (): void => console.log(`Server started at port:${PORT}`))
      .on('error', (e): void => console.log(e));
  } catch (error) {
    console.log(error);
  }
})();
