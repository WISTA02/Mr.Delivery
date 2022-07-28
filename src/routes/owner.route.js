'use strict';

const express = require('express');
const bearer = require('../auth/middleware/bearer');
const role = require('../auth/middleware/role');

const {
  orderCollection,
  mealTable,
  restTable,
  orderTable,
} = require('../auth/models/index');

const ownerRouter = express.Router();
ownerRouter.get('/order/owner', bearer, role(['owner']), handleGetAll);
ownerRouter.get('/order/history', bearer, role(['owner']), handleGetOne);
ownerRouter.put('/order/owner', bearer, role(['owner']), handleUpdate);

async function handleGetAll(req, res) {
  console.log('******************************************************');
  let ownerRest = await restTable.findOne({
    where: { owner: req.user.id },
  });
  let ownerRestId = ownerRest.id;
  let notAcceptedOrders = await orderTable.findAll({
    where: {
      status: 'Restaurant-is-accepting',
      resturantId: ownerRestId,
    },
  });
  let allOrders = notAcceptedOrders;

  res.status(200).send('gg');
}

async function handleGetOne(req, res) {
  const orderId = parseInt(req.params.id);

  let order = await orderCollection.read(orderId);
  res.status(200).json(order);
}

async function handleCreate(req, res) {
  let restId;
  let mealForDelivery = await mealTable.findOne({
    where: { id: req.body.all_items[0]['meal-id'] },
  });
  let restForDelivery = await restTable.findOne({
    where: { id: mealForDelivery.id },
  });
  let deliveryFee = restForDelivery.delivery_fee;
  let totalPrice = deliveryFee;
  console.log(deliveryFee);
  for (const element of req.body.all_items) {
    let mealId = element['meal-id'];
    let quantity = element['quantity'];
    let meal = await mealTable.findOne({ where: { id: mealId } });
    restId = meal.resturantId;
    let mealPrice = meal.price;
    let currentPrice = mealPrice * quantity;
    totalPrice += currentPrice;
  }
  let newOrder = {
    all_items: req.body.all_items,
    status: req.body.status,
    total_price: totalPrice,
    driver_ID: req.body.driver_ID,
    userId: req.user.id,
    resturantId: restId,
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

module.exports = ownerRouter;
