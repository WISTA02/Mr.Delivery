'use strict';
const express = require('express');
const getUsersRouter = express.Router();
const { users, orderTable } = require('../models/index.model');
const bearer = require('../middleware/bearer.middleware');
const role = require('../middleware/role.middleware');

getUsersRouter.get('/user-history', bearer, role(['user']), handleGetHistory);

async function handleGetHistory(req, res) {
  let user = await users.findOne({
    where: { id: req.user.id },
  });

  let orders = await orderTable.findAll({
    where: {
      userId: user.id,
    },
  });

  res.status(200).json(orders);
}
getUsersRouter.get('/users',  async (req, res, next) => {
  const userRecords = await users.findAll();
  res.status(200).json(userRecords);
});

module.exports = getUsersRouter;