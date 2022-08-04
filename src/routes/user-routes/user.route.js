'use strict';
const express = require('express');
const getUsersRouter = express.Router();
const { users, orderTable } = require('../../models/index.model');
const bearer = require('../../middleware/bearer.middleware');
const role = require('../../middleware/role.middleware');

getUsersRouter.get('/user-history', bearer, role(['user']), handleGetHistory);
getUsersRouter.get('/users', bearer, role(['admin']), getAllUsers);

async function handleGetHistory(req, res) {
  try {
    let user = await users.findOne({
      where: { id: req.user.id },
    });

    let orders = await orderTable.findAll({
      where: {
        userId: user.id,
      },
    });

    res.status(200).json(orders);
  } catch {
    res.status(403).send('Error, check the body');
  }
}

async function getAllUsers(req, res) {
  try {
    const userRecords = await users.findAll();
    res.status(200).json(userRecords);
  } catch {
    res.status(403).send('Check if you are an Admin');
  }
}

module.exports = getUsersRouter;
