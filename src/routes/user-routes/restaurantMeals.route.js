'use strict';

const express = require('express');
const bearer = require('../../middleware/bearer.middleware');
const role = require('../../middleware/role.middleware');
const { mealTable, restTable } = require('../../models/index.model');
const restaurantMealRouter = express.Router();

restaurantMealRouter.get('/rest', bearer, role(['user']), handleGetAllUser);
restaurantMealRouter.get(
  '/rest-meal/:id',
  bearer,
  role(['user']),
  handleGetAll
);

async function handleGetAllUser(req, res) {
  let userLocation = req.user.location['city'];
  console.log(userLocation);
  let restaurants = await restTable.findAll({
    where: { location: { city: userLocation } },
  });
  res.status(200).json(restaurants);
}
async function handleGetAll(req, res) {
  let restId = req.params.id;
  let meals = await mealTable.findAll({ where: { restaurant_id: restId } });
  res.status(200).json(meals);
}

module.exports = restaurantMealRouter;
