'use strict';

const express = require('express');
const { restCollection } = require('../auth/models/index');
const restaurantRouter = express.Router();
const bearer = require('../auth/middleware/bearer');
const role = require('../auth/middleware/role');

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
  let resturants = await restCollection.read();
  res.status(200).json(resturants);
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
      type: req.body.type,
      order_path: req.body.order_path,
      rating: req.body.rating,
      delivery_fee: req.body.delivery_fee,
      location: req.body.location,
    };

    let user_Id = req.user.id;
    newResturant.userId = user_Id;
    let newRecored = await restCollection.create(newResturant);
    res.status(201).json(newRecored);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
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
