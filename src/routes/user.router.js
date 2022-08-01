'use strict';
const express = require('express');
const getUsersRouter = express.Router();
const { users } = require('../models/index.model');
const bearer = require('../middleware/bearer.middleware');
const role = require('../middleware/role.middleware');

getUsersRouter.get('/users', bearer, role('admin'), async (req, res, next) => {
  const userRecords = await users.findAll();
  res.status(200).json(userRecords);
});

module.exports = getUsersRouter;