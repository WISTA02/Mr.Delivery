'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

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
