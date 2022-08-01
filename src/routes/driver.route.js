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
driverRouter.get('/order/driver-history', bearer, role(['driver']), handleGetHistory);


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
    let nextStatus;
    let order = await orderTable.findOne({ where: { id: orderId } });
    let orderStatus = order.status;
    if (orderStatus === 'Restaurant-is-preparing') {
    }
    switch (orderStatus) {
      case 'Restaurant-is-preparing':
        let addDriverId = await order.update({ driver_id: req.user.id });
        nextStatus = 'Driver-accepted';
        break;
      case 'Driver-accepted':
        nextStatus = 'Out-for-delivery';
        break;
      case 'Out-for-delivery':
        nextStatus = 'Delivered';
        break;
      default:
        break;
    }
    let updateStatus = await order.update({ status: nextStatus });

    res.status(201).json(updateStatus);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

async function handleGetHistory(req, res) {
  let driver = await users.findOne({
    where: { id: req.user.id },
  });

  let driverId = driver.id;
  let orders = await orderTable.findAll({
    where: {
      status: 'Delivered',
      driver_id: driverId,
    },
  });

  res.status(200).json(orders);
}

module.exports = driverRouter;
