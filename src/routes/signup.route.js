'use strict';
const express = require('express');
require('dotenv').config();
const { users, drivers, owners } = require('../models/index.model');
const bcrypt = require('bcrypt');
const signUpRouter = express.Router();

signUpRouter.post('/signup', async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const obj = {
      username: req.body.username,
      password: hashedPass,
      role: req.body.role,
      location: req.body.location,
      phone: req.body.location,
      email: req.body.email,
    };
    const userRecord = await users.create(obj);

    res.status(201).json(userRecord);
  } catch (e) {
    res.status(404).end();
  }
});
signUpRouter.post('/signup/driver', async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const obj = {
      username: req.body.username,
      password: hashedPass,
      role: req.body.role,
      location: req.body.location,
      phone: req.body.location,
      email: req.body.email,
      car_number: req.body.car_number,
    };
    const driverRecord = await drivers.create(obj);

    res.status(201).json(driverRecord);
  } catch (e) {
    res.status(404).end();
  }
});

signUpRouter.post('/signup/owner', async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const obj = {
      username: req.body.username,
      password: hashedPass,
      role: req.body.role,
      phone: req.body.location,
      email: req.body.email,
    };
    const ownerRecord = await owners.create(obj);

    res.status(201).json(ownerRecord);
  } catch (e) {
    res.status(404).end();
  }
});

module.exports = signUpRouter;
