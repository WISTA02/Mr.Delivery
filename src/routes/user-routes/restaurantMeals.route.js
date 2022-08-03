'use strict';

const express = require('express');
const bearer = require('../../middleware/bearer.middleware');
const role = require('../../middleware/role.middleware');
const { mealTable, restTable } = require('../../models/index.model');
const restaurantMealRouter = express.Router();

restaurantMealRouter.get('/rest', bearer, role(['user']), getAllRest);
restaurantMealRouter.get(
  '/rest-meal/:id',
  bearer,
  role(['user']),
  getAllMeals
);

async function getAllRest(req, res) {
  try {
    let userLocation = req.user.location['city'];
    console.log(userLocation);
    let restaurants = await restTable.findAll({
      where: { location: { city: userLocation } },
    });
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(404).send('not found any restaurant');
  }

}
async function getAllMeals(req, res) {
  try {
    let restId = req.params.id;
    let meals = await mealTable.findAll({ where: { restaurant_id: restId } });
    res.status(200).json(meals);
  } catch (error) {
    res.status(404).send('not found any meals');
  }

}

module.exports = restaurantMealRouter;
