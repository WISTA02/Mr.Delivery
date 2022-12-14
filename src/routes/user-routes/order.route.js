'use strict';

const express = require('express');
// const Events = require('events');
// const events = new Events();
require('dotenv').config();
/////////////////////socket.io///////////////////////
// const io = require('socket.io-client');
// let PORT =process.env.PORT;
// let host = `http://localhost:${PORT}`;
// const customerConnection = io.connect(host);
//////////////////////////////////////////////////////
const bearer = require('../../middleware/bearer.middleware');

const {
  orderCollection,
  mealTable,
  restTable,
  orderTable,
} = require('../../models/index.model');

const role = require('../../middleware/role.middleware');
const orderRouter = express.Router();
orderRouter.get('/order', bearer, role(['admin']), handleGetAll);
orderRouter.get('/order/:id', bearer, role(['user']), handleGetOne);
orderRouter.post('/order/:id', bearer, role(['user']), handleCreate);
orderRouter.put('/order/:id', bearer, role(['admin']), handleUpdate);
orderRouter.delete('/order/:id', bearer, role(['admin']), handleDelete);

async function handleGetAll(req, res) {
  try {
    const allOrders = await orderTable.findAll();
    res.status(200).json(allOrders);
  } catch {
    res.stauts(400).send('Error in getting all orders');
  }
}

async function handleGetOne(req, res) {
  const orderId = parseInt(req.params.id);

  let order = await orderCollection.read(orderId);
  res.status(200).json(order);
}

async function handleCreate(req, res) {
  try {
    if (!req.user.location['city']) {
      res.status(403).send('Please add a valid location/ city name');
    } else {
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
        restaurant_name: restForDelivery.name,
        restaurant_location: restForDelivery.location,
      };
      // customerConnection.emit("new_order",newOrder);
      let order = await orderCollection.create(newOrder);
      // customerConnection.emit("new_order",newOrder);
      res.status(201).json(order);
    }
  } catch {
    res.status(403).send('Add a location or check your trash code');
  }
}

async function handleUpdate(req, res) {
  try {
    const orderId = parseInt(req.params.id);
    const updatedOrder = req.body;
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

async function handleDelete(req, res) {
  try {
    let orderId = parseInt(req.params.id);
    let order = await orderCollection.delete(orderId);
    res.status(204).json(order);
  } catch {
    res.status(500).send('Invalid input');
  }
}

module.exports = orderRouter;
