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
ownerRouter.put('/order/owner/:id', bearer, role(['owner']), handleUpdate);

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

module.exports = ownerRouter;
