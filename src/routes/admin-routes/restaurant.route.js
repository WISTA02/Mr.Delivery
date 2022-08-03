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
  try {
    let restaurant = await restCollection.read();
    res.status(200).json(restaurant);
  } catch {
    res.status(404).send('not found any restaurant');
  }

}

async function handleGetOne(req, res) {
  try {
    const id = parseInt(req.params.id);
    let recored = await restCollection.read(id);
    res.status(200).json(recored);
  } catch {
    res.status(404).send('not found this restaurant');
  }

}

async function handleCreate(req, res) {
  try {
    let newResturant = {
      name: req.body.name,
      delivery_fee: req.body.delivery_fee,
      location: req.body.location,
      owner_id: req.body.owner_id,
    };

    let user_Id = req.user.id;
    newResturant.userId = user_Id;
    let newRecored = await restCollection.create(newResturant);
    res.status(201).json(newRecored);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function handleUpdate(req, res) {
  try {
    let id = parseInt(req.params.id);
    let newRecored = req.body;
    let foundValue = await restCollection.read(id);
    if (foundValue) {
      let updatedRecord = await foundValue.update(newRecored);
      res.status(201).json(updatedRecord);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }

}

async function handleDelete(req, res) {
  try {
    let id = parseInt(req.params.id);
    let deletedRecord = await restCollection.delete(id);
    res.status(204).json(deletedRecord);
  } catch (error) {
    res.status(500).send(error.message);
  }

}

module.exports = restaurantRouter;
