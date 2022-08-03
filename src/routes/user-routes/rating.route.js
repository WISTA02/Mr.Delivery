'use strict';

const express = require('express');
const bearer = require('../../middleware/bearer.middleware');
const role = require('../../middleware/role.middleware');
const ratingRouter = express.Router();
const { orderTable, restTable } = require('../../models/index.model');

ratingRouter.get('/rating', bearer, role(['user']), getUserOrders);
ratingRouter.put('/rating/:id', bearer, role(['user']), ratingHandler);

async function getUserOrders(req, res) {
  let unratedOrders = await orderTable.findAll({
    where: { userId: req.user.id, rated: false, status: 'Delivered' },
  });
  res.status(200).json(unratedOrders);
}

async function ratingHandler(req, res) {
  try {
    if (req.body.restRate) {
      const orderId = parseInt(req.params.id);
      let order = await orderTable.findOne({
        where: { id: orderId, userId: req.user.id },
      });

      //check if the  user has this order

      if (order) {
        let rest = await restTable.findOne({
          where: { id: order.restaurant_id },
        });
        if (rest.rating == 0) {
          rest.rating = req.body.restRate;
          let updated = await restTable.update(
            { rating: req.body.restRate, count: 1 },
            { where: { id: rest.id } }
          );
          let updatedRes = await restTable.findOne({ where: { id: rest.id } });
          let updatedOrder = await orderTable.update(
            { rated: true },
            { where: { id: order.id } }
          );
          let x = await orderTable.findOne({ where: { id: order.id } });
          res.status(201).json(updatedRes);
        }
        //check if it rated befor only one rating for every order
        else if (!order.rated) {
          console.log(rest);
          let count = rest.count;
          let sum = count * rest.rating;

          sum += req.body.restRate;
          console.log(sum);
          count += 1;
          let avg = sum / count;
          rest.rating = avg;

          let updated = await restTable.update(
            { rating: avg, count: count },
            { where: { id: rest.id } }
          );
          let updatedOrder = await orderTable.update(
            { rated: true },
            { where: { id: order.id } }
          );
          res.status(201).json(rest);
        } else {
          res.status(500).send('rated before');
        }
      } else {
        res.status(500).send(`There is no order  with ID=${orderId} for u`);
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }


}

module.exports = ratingRouter;
