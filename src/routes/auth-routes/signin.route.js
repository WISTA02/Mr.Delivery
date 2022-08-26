'use strict';
const express = require('express');
const signInRouter = express.Router();
const basicAuth = require('../../middleware/basic.middleware');
const cors = require('../../middleware/cors.middleware');

signInRouter.post('/signin', basicAuth, cors, (req, res) => {
  try {
    const user = {
      user: req.user,
    };
    res.status(200).json(user);
  } catch {
    res.status(500).send('Invalid login');
  }
});
module.exports = signInRouter;
