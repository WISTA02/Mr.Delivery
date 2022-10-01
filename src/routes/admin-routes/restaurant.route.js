'use strict';

const express = require('express');
const { restCollection } = require('../../models/index.model');
const restaurantRouter = express.Router();
const bearer = require('../../middleware/bearer.middleware');
const role = require('../../middleware/role.middleware');

restaurantRouter.get('/restaurant', bearer, role(['admin']), handleGetAll);
restaurantRouter.get('/restaurant/:id', bearer, role(['admin']), handleGetOne);
restaurantRouter.post('/restaurant', bearer, role(['admin']), handleCreate);
restaurantRouter.put('/restaurant/:id', bearer, role(['admin']), handleUpdate);
restaurantRouter.delete(
  '/restaurant/:id',
  bearer,
  role(['admin']),
  handleDelete
);

async function handleGetAll(req, res) {
  let restaurant = await restCollection.read();
  res.status(200).json(restaurant);
}

async function handleGetOne(req, res) {
  const id = parseInt(req.params.id);
  let recored = await restCollection.read(id);
  res.status(200).json(recored);
}

async function handleCreate(req, res) {
  try {
    let newResturant = {
      name: req.body.name,
      delivery_fee: req.body.delivery_fee,
      location: req.body.location,
      owner_id: req.body.owner_id,
      image: req.body.image,
      category: req.body.category,
    };

    let user_Id = req.user.id;
    newResturant.userId = user_Id;
    let newRecored = await restCollection.create(newResturant);
    res.status(201).json(newRecored);
  } catch {
    res.status(500).send('Invalid input');
  }
}

async function handleUpdate(req, res) {
  let id = parseInt(req.params.id);
  let newRecored = req.body;
  let foundValue = await restCollection.read(id);
  if (foundValue) {
    let updatedRecord = await foundValue.update(newRecored);
    res.status(201).json(updatedRecord);
  }
}

async function handleDelete(req, res) {
  let id = parseInt(req.params.id);
  let deletedRecord = await restCollection.delete(id);
  res.status(204).json(deletedRecord);
}

module.exports = restaurantRouter;
