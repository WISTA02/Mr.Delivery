'use strict';
const express = require('express');
require('dotenv').config();
const { users, driverTable } = require('../../models/index.model');
const bcrypt = require('bcrypt');
const signUpRouter = express.Router();

signUpRouter.post('/signup', async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const userData = {
      username: req.body.username,
      password: hashedPass,
      role: req.body.role,
      location: req.body.location,
      phone: req.body.phone,
      email: req.body.email,
    };

    const userRecord = await users.create(userData);
    if (req.body.role === 'driver') {
      const driverData = {
        car_number: req.body.car_number,
        driver_id: userRecord.id,
      };
      const driverRecord = await driverTable.create(driverData);
    }
    res.status(201).json(userRecord);
  } catch {
    res.status(404).end();
  }
});

module.exports = signUpRouter;
