'use strict';
const express = require('express');
const signInRouter = express.Router();
const basicAuth = require('../middleware/basic.middleware');

signInRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
  };
  res.status(200).json(user);
});
signInRouter.post('/signin/driver', basicAuth, (req, res, next) => {
  const driver = {
    user: req.user,
  };
  res.status(200).json(driver);
});
signInRouter.post('/signin/owner', basicAuth, (req, res, next) => {
  const owner = {
    user: req.user,
  };
  res.status(200).json(owner);
});

module.exports = signInRouter;
