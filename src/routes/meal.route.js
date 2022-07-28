'use strict';

const express = require('express');
const bearer = require('../auth/middleware/bearer');
const role = require('../auth/middleware/role');
const router = express.Router();
const { restTable } = require('../auth/models/index');

const { mealsCollection } = require('../auth/models/index');

router.get('/meal', bearer, handleGetAll);
router.get('/meal/:id', bearer, role(['admin']), handleGetOne);
router.post('/meal', bearer, role(['admin']), handleCreate);
router.put('/meal/:id', bearer, role(['admin']), handleUpdate);
router.delete('/meal/:id', bearer, role(['admin']), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await mealsCollection.read();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await mealsCollection.read(id);
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await mealsCollection.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  let id = req.params.id;
  let newRecored = req.body;
  let found = await mealsCollection.read(id);
  if (found) {
    let updated = await found.update(newRecored);
    res.status(201).json(updated);
  } else {
    res.status(404).send('Not found');
  }
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await mealsCollection.delete(id);
  res.status(204).json(deletedRecord);
}

module.exports = router;
