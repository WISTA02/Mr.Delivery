'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

// Esoteric Resources
const editUserRouter = require('./routes/user.router');
const searchRouter = require('./routes/user-routes/search.route');
const ownerRouter = require('./routes/owner-routes/owner.route');
const locationRouter = require('./routes/user-routes/location.route');
const errorHandler = require('./middleware/error-handlers/500');
const notFound = require('./middleware/error-handlers/404');
const signInRouter = require('./routes/auth-routes/signin.route');
const signUpRouter = require('./routes/auth-routes/signup.route');
const getUsersRouter = require('./routes/user-routes/user.route');
const restaurantRouter = require('./routes/admin-routes/restaurant.route');
const orderRouter = require('./routes/user-routes/order.route');
const mealRouter = require('./routes/admin-routes/meal.route');
const restaurantMealRouter = require('./routes/user-routes/restaurantMeals.route');
const driverRouter = require('./routes/driver-routes/driver.route');
const driverInfoRouter = require('./routes/admin-routes/driverInformation.route');
const profitsRoute = require('./routes/profits.route');
const ratingRouter = require('./routes/user-routes/rating.route');
const socketRouter = require('./routes/socket.route');
// Prepare the express app
const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, //access-control-allow-credentials:true
  })
);

const server = http.createServer(app);
app.get('/', (req, res) => {
  res.send('Home');
});

// connect socket.io with clinet
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, //access-control-allow-credentials:true
  },
});

/*****************socket********************/
io.on('connection', (socket) => {
  console.log(`user connected : ${socket.id}`);
  socket.on('x', (data) => {
    console.log('-------------------------->');
  });
  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`user with id : ${socket.id} joind room : ${data}`);
  });
  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });
  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop_typing', (room) => socket.in(room).emit('stop_typing'));

  socket.on('disconnect', () => {
    console.log('User diconnect', socket.id);
  });
});
/*****************socket********************/

// App Level MW

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(signUpRouter);
app.use(signInRouter);
app.use(locationRouter);
app.use(ownerRouter);
app.use(restaurantMealRouter);
app.use(searchRouter);
app.use(getUsersRouter);
app.use(mealRouter);
app.use(restaurantRouter);
app.use(driverRouter);
app.use(orderRouter);
app.use(driverInfoRouter);
// Routes
app.use(driverRouter);

app.use(profitsRoute);

app.use(ratingRouter);
app.use(editUserRouter);
app.use(socketRouter);
// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  startup: (port) => {
    server.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
