'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

// Esoteric Resources

const searchRouter = require('./routes/search.route');
const ownerRouter = require('./routes/owner.route');
const locationRouter = require('./routes/location.route');
const errorHandler = require('./middleware/error-handlers/500');
const notFound = require('./middleware/error-handlers/404');
const signInRouter = require('./routes/signin.route');
const signUpRouter = require('./routes/signup.route');
// const secretRouter = require('./routes/secretRouter');
const getUsersRouter = require('./routes/user.router');
const restaurantRouter = require('./routes/restaurant.route');
const orderRouter = require('./routes/order.route');
const mealRouter = require('./routes/meal.route');
const restaurantMealRouter = require('./routes/restaurantMeals.route');
const driverRouter = require('./routes/driver.route');
const driverInfoRouter = require('./routes/driverInformation.route');

const profitsRoute = require('./routes/profits.route')

const ratingRouter = require("./routes/rating.route");

const socketRouter=require("./routes/socket.route");
// Prepare the express app
const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  methods:["GET","POST","PUT","DELETE"],
  credentials:true,            //access-control-allow-credentials:true
}));
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('Home');
});

// connect socket.io with clinet
const io=new Server(server,{
  cors:{
      origin: "http://localhost:3000",
      methods:["GET","POST","PUT","DELETE"],
      credentials:true,            //access-control-allow-credentials:true

  }
})

/*****************socket********************/
io.on('connection', (socket) => {
  console.log(`user connected : ${socket.id}`);
  socket.on('join_room', (data) => {
      socket.join(data);
      console.log(`user with id : ${socket.id} joind room : ${data}`);
  })
  socket.on('send_message', (data) => {
      socket.to(data.room).emit('receive_message', data);
  })
  socket.on('typing',(room)=>socket.in(room).emit('typing'))
  socket.on('stop_typing',(room)=>socket.in(room).emit('stop_typing'))


  socket.on('disconnect', () => {
      console.log('User diconnect', socket.id);
  })
})
/*****************socket********************/

// App Level MW

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(signUpRouter);
app.use(signInRouter);
// app.use(secretRouter);
app.use(locationRouter);
app.use(ownerRouter);
app.use(restaurantMealRouter);
app.use(searchRouter);
app.use(getUsersRouter);
app.use(mealRouter);
app.use(restaurantRouter);
app.use(orderRouter);
app.use(driverInfoRouter);
// Routes
app.use(driverRouter);

app.use(profitsRoute);

app.use(ratingRouter);

app.use(socketRouter)
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
