'use strict';

const express = require('express');
const bearer = require('../middleware/bearer.middleware');
const role = require('../middleware/role.middleware');

const {
  orderCollection,
  mealTable,
  restTable,
  orderTable,
} = require('../models/index.model');

const ownerRouter = express.Router();
ownerRouter.get('/owner', bearer, role(['owner']), handleGetAll);
ownerRouter.get('/owner-history', bearer, role(['owner']), handleGetOne);
ownerRouter.put('/order/owner/:id', bearer, role(['owner']), handleUpdate);

async function handleGetAll(req, res) {
  let restaurant = await restTable.findOne({
    where: { owner_id: req.user.id },
  });
  let restaurantId = restaurant.id;
  let notAcceptedOrders = await orderTable.findAll({
    where: {
      status: 'New-order',
      restaurant_id: restaurantId,
    },
  });

  res.status(200).json(notAcceptedOrders);
}

async function handleGetOne(req, res) {
  const orderId = parseInt(req.params.id);

  let order = await orderCollection.read(orderId);
  res.status(200).json(order);
}

async function handleUpdate(req, res) {
  const orderId = parseInt(req.params.id);
  const updatedOrder = { status: 'Restaurant-is-preparing' };
  let order = await orderCollection.read(orderId);

  if (order) {
    let updated = await order.update(updatedOrder);
    res.status(201).json(updated);
  } else {
    res.status(404);
  }
}

module.exports = ownerRouter;
