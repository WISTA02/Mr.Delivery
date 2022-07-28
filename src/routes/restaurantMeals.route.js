'use strict';

'use strict';

const express = require('express');
const bearer = require('../auth/middleware/bearer');
const { mealTable, restTable } = require('../auth/models/index');
const restaurantMealRouter = express.Router();

restaurantMealRouter.get('/rest', bearer, handleGetAllUser);
restaurantMealRouter.get('/rest/:id', bearer, handleGetAll);

async function handleGetAll(req, res) {
  let restId = req.params.id;
  let meals = await mealTable.findAll({ where: { resturantId: restId } });
  res.status(200).json(meals);
}
async function handleGetAllUser(req, res) {
  let userLocation = req.user.location['city'];
  console.log(userLocation);
  let restaurants = await restTable.findAll({
    where: { location: { city: userLocation } },
  });
  res.status(200).json(restaurants);
}
module.exports = restaurantMealRouter;
