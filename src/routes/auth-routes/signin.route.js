'use strict';
const express = require('express');
const signInRouter = express.Router();
const basicAuth = require('../../middleware/basic.middleware');

signInRouter.post('/signin', basicAuth, (req, res) => {
  const user = {
    user: req.user,
  };
  res.status(200).json(user);
});
module.exports = signInRouter;
