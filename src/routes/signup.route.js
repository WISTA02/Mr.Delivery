'use strict';
const express = require('express');
require('dotenv').config();
const { users } = require('../auth/models/index');
const bcrypt = require('bcrypt');
const signUpRouter = express.Router();

signUpRouter.post('/signup', async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const obj = {
      username: req.body.username,
      password: hashedPass,
      role: req.body.role,
    };
    const userRecord = await users.create(obj);

    res.status(201).json(userRecord);
  } catch (e) {
    res.status(404).end();
  }
});

module.exports = signUpRouter;
