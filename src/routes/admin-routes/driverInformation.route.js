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
  try {
    let allRecords = await driverCollection.read();
    res.status(200).json(allRecords);
  } catch {
    res.status(404).send('not found any data')
  }
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  try {
    let driverRecord = await driverTable.findOne({
      where: { driver_id: id },
    });
    res.status(200).json(driverRecord);
  } catch {
    res.status(404).send('not found any data')
  }


}

async function handleUpdate(req, res) {
  let id = req.params.id;
  let newRecored = req.body;
  try {
    let driverRecord = await driverTable.findOne({
      where: { driver_id: id },
    });
    if (driverRecord) {
      let updated = await driverRecord.update(newRecored);
      res.status(201).json(updated);
    } else {
      res.status(404).send('Not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }


}

async function handleDelete(req, res) {
  let id = req.params.id;
  try {
    let deletedRecord = await driverTable.destroy({
      where: { driver_id: id },
    });
    res.status(204).send('deleted');
  }
  catch {
    res.status(500).send('Invalid Input')
  }

}

module.exports = driverInfoRouter;
