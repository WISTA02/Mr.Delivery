'use strict';

const express = require('express');

const bearer = require('../middleware/bearer.middleware');

const {
  orderCollection,
  mealTable,
  restTable,
  orderTable,
} = require('../models/index.model');

const role = require('../middleware/role.middleware');
const orderRouter = express.Router();
orderRouter.get('/order', bearer, role(['owner']), handleGetAll);
orderRouter.get('/order/:id', bearer, role(), handleGetOne);
orderRouter.post('/order/:id', bearer, role(['user']), handleCreate);
orderRouter.put('/order/:id', bearer, role(['owner', 'driver']), handleUpdate);
orderRouter.delete('/order/:id', bearer, role(), handleDelete);

async function handleGetAll(req, res) {
  let allOrders;
  if (req.user.role === 'admin') {
    allOrders = await orderCollection.read();
  } else if (req.user.role === 'owner') {
    let ownerRest = await restTable.findOne({
      where: { owner: req.user.id },
    });
    let ownerRestId = ownerRest.id;
    let notAcceptedOrders = await orderTable.findAll({
      where: {
        status: 'Restaurant-is-accepting',
        restaurant_id: ownerRestId,
      },
    });
    allOrders = notAcceptedOrders;
  } else {
    allOrders = await orderTable.findAll({
      where: { restaurant_id: ownerId },
    });
  }
  res.status(200).json(allOrders);
}

async function handleGetOne(req, res) {
  const orderId = parseInt(req.params.id);

  let order = await orderCollection.read(orderId);
  res.status(200).json(order);
}

async function handleCreate(req, res) {
  let mealForDelivery = await mealTable.findOne({
    where: { id: req.body.all_items[0]['meal_id'] },
  });

  let restForDelivery = await restTable.findOne({
    where: { id: req.params.id },
  });
  let deliveryFee = restForDelivery['delivery_fee'];
  let totalPrice = deliveryFee;
  for (const element of req.body.all_items) {
    let mealId = element['meal_id'];
    let quantity = element['quantity'];
    let meal = await mealTable.findOne({ where: { id: mealId } });
    let mealPrice = meal['price'];
    let currentPrice = mealPrice * quantity;
    totalPrice += currentPrice;
  }
  let newOrder = {
    all_items: req.body.all_items,
    total_price: totalPrice,
    userId: req.user.id,
    restaurant_id: req.params.id,
  };
  let order = await orderCollection.create(newOrder);
  res.status(201).json(order);
}

async function handleUpdate(req, res) {
  const orderId = parseInt(req.params.id);
  const updatedOrder = req.body.status;
  let order = await orderCollection.read(orderId);

  if (order) {
    let updated = await order.update(updatedOrder);
    res.status(201).json(updated);
  } else {
    res.status(404);
  }
}

async function handleDelete(req, res) {
  let orderId = parseInt(req.params.id);
  let order = await orderCollection.delete(orderId);
  res.status(204).json(order);
}

module.exports = orderRouter;
