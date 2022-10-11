'use strict';
const express = require('express');
const getUsersRouter = express.Router();
const bcrypt = require('bcrypt');
const { users, orderTable } = require('../models/index.model');
const bearer = require('../middleware/bearer.middleware');
const role = require('../middleware/role.middleware');

getUsersRouter.get('/user-history', bearer, handleGetHistory);
getUsersRouter.put('/edit-account', bearer, editAccount);
getUsersRouter.delete('/delete-account', bearer, deletAccount);

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
    res.status(404).send('not found any orders');
  }
}
getUsersRouter.get('/users', bearer, role('admin'), async (req, res, next) => {
  const userRecords = await users.findAll();
  res.status(200).json(userRecords);
  let payload = {
    room: 'driver_customer',
    order: 'newOrder',
  };
});

async function editAccount(req, res) {
  try {
    let user = await users.findOne({
      where: { id: req.user.id },
    });
    if (user) {
      const hashedPass = await bcrypt.hash(req.body.password, 10);
      let updateAccount = user.update({
        username: req.body.username,
        password: hashedPass,
        role: req.body.role,
        location: req.body.location,
        phone: req.body.phone,
        email: req.body.email,
      });
      res.status(200).json(updateAccount);
    }
  } catch {
    res.status(500).send('Invalid login');
  }
}

async function deletAccount(req, res) {
  try {
    let user = await users.findOne({
      where: { id: req.user.id },
    });
    if (user) {
      let deleteduser = await users.destroy({
        where: { id: user.id },
      });
      res.status(204).send('deleted Account');
    }
  } catch {
    res.status(500).send('Invalid login');
  }
}

module.exports = getUsersRouter;
