'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const searchRouter = require('./routes/searchRouter');
const ownerRouter = require('./routes/ownerRouter');
const locationRouter = require('./routes/locationRouter');
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const signInRouter = require('./routes/signInRouter');
const signUpRouter = require('./routes/signUpRouter');
const secretRouter = require('./routes/secretRouter');
const getUsersRouter = require('./routes/allUsersRouter');
const restaurantRouter = require('./routes/restaurantRouter');
const orderRouter = require('./routes/orderRouter');
const mealRouter = require('./routes/mealRouter');
const restaurantMealRouter = require('./routes/restaurantMealsRouter');

const driverRouter = require('./routes/driver');

// Prepare the express app
const app = express();
app.get('/', (req, res) => {
  res.send('Home');
});

// App Level MW
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(signUpRouter);
app.use(signInRouter);
app.use(ownerRouter);
app.use(secretRouter);
app.use(locationRouter);
app.use(restaurantMealRouter);
app.use(searchRouter);
app.use(getUsersRouter);
app.use(mealRouter);
app.use(restaurantRouter);
app.use(orderRouter);
// Routes
app.use(driverRouter);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  startup: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
