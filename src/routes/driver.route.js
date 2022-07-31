const express = require('express');
const bearer = require('../middleware/bearer.middleware');
const role = require('../middleware/role.middleware');
const {
  orderTable,
  restTable,
  users,
  driverTable,
} = require('../models/index.model');
const driverRouter = express.Router();

driverRouter.get('/driver', bearer, role(['driver']), getAllOrder);
driverRouter.put('/driver/:id', bearer, role(['driver']), updateStatus);

async function getAllOrder(req, res) {
  let orders = await orderTable.findAll({
    where: {
      status: 'Restaurant-is-preparing',
    },
  });
  res.status(200).json(orders);
}

async function updateStatus(req, res) {
  try {
    let orderId = req.params.id;
    const statusArr = ['Driver-accepted', 'Out-for-delivery', 'Delivered'];
    const driver = await driverTable.findOne({
      where: { driver_id: req.user.id },
    });
    const counter = driver.status_counter;
    let order = await orderTable.findOne({ where: { id: orderId } });
    let driverUpdating = await order.update({
      status: statusArr[counter],
    });
    const updateCounter = await driver.update({
      status_counter: counter + 1,
    });
    if (updateCounter.status_counter == 3) {
      const resetCounter = await driver.update({ status_counter: 0 });
    }
    res.status(201).json(driverUpdating);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

module.exports = driverRouter;
