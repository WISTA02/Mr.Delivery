'use strict';

const express = require('express');
const bearer = require('../../middleware/bearer.middleware');
const role = require('../../middleware/role.middleware');

const {
  orderCollection,
  mealTable,
  restTable,
  orderTable,
} = require('../../models/index.model');

const ownerRouter = express.Router();
ownerRouter.get('/owner', bearer, role(['owner']), handleGetAll);
ownerRouter.get('/owner-history', bearer, role(['owner']), handleGetOne);
ownerRouter.put('/order/owner/:id', bearer, role(['owner']), handleUpdate);
ownerRouter.get('/owner-history', bearer, role(['owner']), handleGetHistory);

async function handleGetAll(req, res) {
  try {
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
  } catch {
    res.status(404).send('not found any orders');
  }

}

async function handleGetOne(req, res) {
  try {
    const orderId = parseInt(req.params.id);

    let order = await orderCollection.read(orderId);
    res.status(200).json(order);
  } catch {
    res.status(404).send('not found this order');
  }
}

async function handleUpdate(req, res) {
  try {
    const orderId = parseInt(req.params.id);
    const updatedOrder = { status: 'Restaurant-is-preparing' };
    let order = await orderCollection.read(orderId);

    if (order) {
      let updated = await order.update(updatedOrder);
      res.status(201).json(updated);
    } else {
      res.status(404);
    }
  } catch {
    res.status(500).send('Invalid input');
  }
}

async function handleGetHistory(req, res) {
  try {
    let restaurant = await restTable.findOne({
      where: { owner_id: req.user.id },
    });
    let restaurantId = restaurant.id;
    let orders = await orderTable.findAll({
      where: {
        restaurant_id: restaurantId,
      },
    });

    res.status(200).json(orders);
  } catch {
    res.status(404).send('Not found any orders');
  }

}

module.exports = ownerRouter;
