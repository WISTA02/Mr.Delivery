'use strict';

const express = require('express');
const bearer = require('../middleware/bearer.middleware');
const role = require('../middleware/role.middleware');
const driverRouter = express.Router();
const driverCollection = require('../models/index.model');

driverRouter.get('/driverinfo', bearer, role(['admin']), handleGetAll);
// driverRouter.get('/driverinfo', bearer, role(['admin']), handleGetOne);
// driverRouter.post('/driverinfo', bearer, role(['admin']), handleCreate);
// driverRouter.put('/driverinfo', bearer, role(['admin']), handleUpdate);
// driverRouter.delete('/driverinfo', bearer, role(['admin']), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await driverCollection.findAll();
  res.status(200).json(allRecords);
}

// async function handleGetOne(req, res) {
//   const id = req.params.id;
//   let theRecord = await mealsCollection.read(id);
//   res.status(200).json(theRecord);
// }

// async function handleCreate(req, res) {
//   let obj = {
//     name: req.body.name,
//     description: req.body.description,
//     price: req.body.price,
//     restaurant_id: req.params.id,
//   };
//   let newRecord = await mealsCollection.create(obj);
//   res.status(201).json(newRecord);
// }

// async function handleUpdate(req, res) {
//   let id = req.params.id;
//   let newRecored = req.body;
//   let found = await mealsCollection.read(id);
//   if (found) {
//     let updated = await found.update(newRecored);
//     res.status(201).json(updated);
//   } else {
//     res.status(404).send('Not found');
//   }
// }

// async function handleDelete(req, res) {
//   let id = req.params.id;
//   let deletedRecord = await mealsCollection.delete(id);
//   res.status(204).json(deletedRecord);
// }

module.exports = driverRouter;
