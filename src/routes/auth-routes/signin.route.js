'use strict';
const express = require('express');
const signInRouter = express.Router();
const basicAuth = require('../../middleware/basic.middleware');

signInRouter.post('/signin', basicAuth, (req, res) => {
  try {
    const user = {
      user: req.user,
    };
    res.status(200).json(user);
  } catch (e){
    res.status(500).send(e);
  }
});
module.exports = signInRouter;
