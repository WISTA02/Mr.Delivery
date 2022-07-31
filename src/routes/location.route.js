'use strict';
const express = require('express');
const bearer = require('../middleware/bearer.middleware');
const role = require('../middleware/role.middleware');

const { users } = require('../models/index.model');

const locationRouter = express.Router();
locationRouter.put(
  '/location',
  bearer,
  role(['user', 'driver']),
  updateLocation
);

async function updateLocation(req, res) {
  let location = req.body.location;
  let updated = await users.update(
    { location: location },
    { where: { id: req.user.id } }
  );
  let user = await users.findOne({ where: { id: req.user.id } });
  res.status(200).json(user);
}

module.exports = locationRouter;
