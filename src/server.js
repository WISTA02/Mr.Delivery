'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');

// Esoteric Resources

const searchRouter = require('./routes/search.route');
const ownerRouter = require('./routes/owner.route');
const locationRouter = require('./routes/location.route');
const errorHandler = require('./middleware/error-handlers/500');
const notFound = require('./middleware/error-handlers/404');
const signInRouter = require('./routes/signin.route');
const signUpRouter = require('./routes/signup.route');
const getUsersRouter = require('./routes/user.router');
const restaurantRouter = require('./routes/restaurant.route');
const orderRouter = require('./routes/order.route');
const mealRouter = require('./routes/meal.route');
const restaurantMealRouter = require('./routes/restaurantMeals.route');
const driverRouter = require('./routes/driver.route');
const driverInfoRouter = require('./routes/driverInformation.route');
const ratingRouter = require('./routes/rating.route');

// Prepare the express app
const app = express();
app.get('/', (req, res) => {
  res.send('Home');
});

//Routes
app.use(cors());
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
