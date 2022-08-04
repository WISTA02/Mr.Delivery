'use strict';

const express = require('express');
const bearer = require('../../middleware/bearer.middleware');
const role = require('../../middleware/role.middleware');
const router = express.Router();

const { mealsCollection, restTable } = require('../../models/index.model');

router.get('/meal', bearer, handleGetAll);
router.get('/meal/:id', bearer, role(['admin']), handleGetOne);
router.post('/meal/:id', bearer, role(['admin']), handleCreate);
router.put('/meal/:id', bearer, role(['admin']), handleUpdate);
router.delete('/meal/:id', bearer, role(['admin']), handleDelete);

async function handleGetAll(req, res) {
  try {
    let allRecords = await mealsCollection.read();
    res.status(200).json(allRecords);
  }
  catch {
    res.status(404).send('not found any meals')
  }
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  try {
    let theRecord = await mealsCollection.read(id);
    res.status(200).json(theRecord);
  }
  catch {
    res.status(404).send('not found this meal')
  }
}

async function handleCreate(req, res) {
  try {
    let obj = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      restaurant_id: req.params.id,
    };
    let newRecord = await mealsCollection.create(obj);
    res.status(201).json(newRecord);
  }
  catch {
    res.status(500).send('Invalid Input');
  }
}

async function handleUpdate(req, res) {
  try {
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
  catch {
    res.status(500).send('Invalid Input');
  }

}

async function handleDelete(req, res) {
  try {
    let id = req.params.id;
    let deletedRecord = await mealsCollection.delete(id);
    res.status(204).json(deletedRecord);
  }
  catch {
    res.status(404).send('not found this meal')
  }

}

module.exports = router;
