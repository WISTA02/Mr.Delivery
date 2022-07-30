// const driverRouter =require ("../models/index");

const express = require('express');
const bearer = require('../middleware/bearer.middleware');
const role = require('../middleware/role.middleware');
const { orderTable, restTable, users } = require('../models/index.model');
const driverRouter = express.Router();

driverRouter.get('/driver', bearer, role('driver'), getAllOrder);
driverRouter.put('/driver/:id', bearer, role('driver'), updateStatues);

async function getAllOrder(req, res) {
  let orders = await orderTable.findAll({
    where: { status: 'Restaurant-is-preparing' },
  });
  res.status(200).json(orders);
}

let deliveryStatusCounter = 0;
async function updateStatues(req, res) {
  let status = ['Driver-accepted', 'Out-for-delivery', 'Delivered'];

  try {
    let orderID = req.params.id;
    let updated = await orderTable.update(
      { driver_ID: req.user.id, status: status[deliveryStatusCounter] },
      { where: { id: orderID } }
    );
    let order = await orderTable.findOne({ where: { id: orderID } });
    // let restLocation =findRest(order.resturantId);
    // let clinetLocation =
    res.status(201).json(order);
    x++;
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}
async function findRest(id) {
  let res = await restTable.findOne({ where: { id: id } });
  return res.location;
}

async function findClient(id) {
  let client = await users.findOne({ where: { id: id } });
  return client.location;
}
module.exports = driverRouter;
