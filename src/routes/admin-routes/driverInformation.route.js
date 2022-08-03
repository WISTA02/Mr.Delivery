'use strict';

const express = require('express');
const bearer = require('../../middleware/bearer.middleware');
const role = require('../../middleware/role.middleware');
const driverInfoRouter = express.Router();
const { driverCollection, driverTable } = require('../../models/index.model');

driverInfoRouter.get('/driverinfo', bearer, role(['admin']), handleGetAll);
driverInfoRouter.get('/driverinfo/:id', bearer, role(['admin']), handleGetOne);
driverInfoRouter.put('/driverinfo/:id', bearer, role(['admin']), handleUpdate);
driverInfoRouter.delete(
  '/driverinfo/:id',
  bearer,
  role(['admin']),
  handleDelete
);

async function handleGetAll(req, res) {
  let allRecords = await driverCollection.read();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let driverRecord = await driverTable.findOne({
    where: { driver_id: id },
  });
  res.status(200).json(driverRecord);
}

async function handleUpdate(req, res) {
  let id = req.params.id;
  let newRecored = req.body;
  let driverRecord = await driverTable.findOne({
    where: { driver_id: id },
  });
  if (driverRecord) {
    let updated = await driverRecord.update(newRecored);
    res.status(201).json(updated);
  } else {
    res.status(404).send('Not found');
  }
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await driverTable.destroy({
    where: { driver_id: id },
  });
  res.status(204);
}

module.exports = driverInfoRouter;
