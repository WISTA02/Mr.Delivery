'use strict';

const express = require('express');
const bearer = require('../middleware/bearer.middleware');
const role = require('../middleware/role.middleware');
const { Sequelize, DataTypes } = require('sequelize');
const Op = Sequelize.Op;
const { restTable, mealTable } = require('../models/index.model');

const searchRouter = express.Router();
searchRouter.get('/search', bearer, search);

async function search(req, res) {
  if (req.body.resturant) {
    let rest = await restTable.findAll({
      // where: { location: { city: userLocation } },

      where: {
        location: { city: req.user.location['city'] },
        name: {
          [Op.like]: `%${req.body.resturant}%`,
        },
      },
    });
    if (rest.length > 0) res.status(200).json(rest);
    else res.status(500).send('There are no restaurants match this name');
    // res.write(JSON.stringify("error"));
  } else {
    if (req.body.meal) {
      console.log('elseeeeeeeeee');
      let meal = await mealTable.findAll({
        where: {
          location: { city: req.user.location['city'] },
          name: {
            [Op.like]: `%${req.body.meal}%`,
          },
        },
      });
      if (meal.length > 0) res.status(200).json(meal);
      else res.status(500).send('There are no meals match this name');
    }
  }
}

module.exports = searchRouter;
