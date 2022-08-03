'use strict';

const express = require('express');
const bearer = require('../../middleware/bearer.middleware');
const role = require('../../middleware/role.middleware');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
const { restTable, mealTable } = require('../../models/index.model');
const searchRouter = express.Router();

searchRouter.get('/search', bearer, role(['user']), searchRestaurant);
searchRouter.get('/search-meal', bearer, role(['user']), searchMeal);

async function searchRestaurant(req, res) {
  try {
    if (req.body.query) {
      let restaurant = await restTable.findAll({
        where: {
          location: { city: req.user.location['city'] },
          name: {
            [Op.like]: `%${req.body.query.toLowerCase()}%`,
          },
        },
      });
      if (restaurant.length == 0) res.status(200).send('No Rest was found');
      else {
        res.status(200).json(restaurant);
      }
    } else {
      res.status(200).send('Enter some text in the search bar');
    }
  } catch (error) {
    res.status(404).send('not found any rstaurant');
  }

}
async function searchMeal(req, res) {

  //  let meal = await mealTable.findAll({
  //   where: {
  //     location: { city: req.user.location['city'] },
  //     name: {
  //       [Op.like]: `%${req.body.meal}%`,
  //     },
  //   },
  // });
  // res.status(200).json(meal);
}

module.exports = searchRouter;
