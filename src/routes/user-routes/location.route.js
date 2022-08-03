'use strict';
const express = require('express');
const bearer = require('../../middleware/bearer.middleware');
const role = require('../../middleware/role.middleware');

const { users } = require('../../models/index.model');

const locationRouter = express.Router();
locationRouter.put(
  '/location',
  bearer,
  role(['user', 'driver']),
  updateLocation
);

async function updateLocation(req, res) {
  try {
    let location = req.body.location;
    let updated = await users.update(
      { location: location },
      { where: { id: req.user.id }, returning: true }
    );

    res.status(200).json(updated[1]);
  } catch {
    res.status(403).send('Wrong input');
  }
}

module.exports = locationRouter;
