'use strict';

const express = require('express');
const bearer = require('../middleware/bearer.middleware');
const role = require('../middleware/role.middleware');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
const { restTable, mealTable } = require('../models/index.model');
const searchRouter = express.Router();

searchRouter.get('/search', bearer, role(['user']), search);

async function search(req, res) {
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
    // let meal = await mealTable.findAll({
    //   where: {
    //     location: { city: req.user.location['city'] },
    //     name: {
    //       [Op.like]: `%${req.body.meal}%`,
    //     },
    //   },
    // });
  } else {
    res.status(200).send('There are no meals match this name');
  }
}

module.exports = searchRouter;
