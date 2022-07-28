// const driverRouter =require ("../models/index");

const express = require('express');
const bearer = require('../auth/middleware/bearer');
const role = require('../auth/middleware/role');

const { orderTable, restTable, users } = require('../auth/models/index');

const driverRouter = express.Router();
driverRouter.get('/driver', bearer, role('driver'), getAllOrder);
driverRouter.put('/driver', bearer, role('driver'), updateStatues);

///////////select *//////////////////
async function getAllOrder(req, res) {
  let orders;
  x = 0;
  console.log(req.user.role);
  orders = await orderTable.findAll({
    where: { status: 'Restaurant-is-preparing' },
  });
  res.status(200).json(orders);
}
let x = 0;
////////////////updateStatues////////////////////
async function updateStatues(req, res) {
  let s;
  if (x == 0) s = 'Driver-accepted';
  if (x == 1) s = 'Out-for-delivery';
  if (x >= 2) s = 'Delivered';

  try {
    let orderID = req.body.id;
    let updated = await orderTable.update(
      { driver_ID: req.user.id, status: s },
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
