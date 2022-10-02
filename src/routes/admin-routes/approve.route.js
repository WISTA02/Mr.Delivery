'use strict';

const express = require('express');
const bearer = require('../../middleware/bearer.middleware');
const role = require('../../middleware/role.middleware');
const approveRouter = express.Router();

const { users } = require('../../models/index.model');

approveRouter.get('/approve', bearer, handleGetAll);
approveRouter.get('/approve/:id', bearer, role(['admin']), handleGetOne);
approveRouter.put('/approve/:id', bearer, role(['admin']), handleUpdate);
approveRouter.delete('/approve/:id', bearer, role(['admin']), handleDelete);

async function handleGetAll(req, res) {
  try {
    let allRecords = await users.findAll({ where: { approved: false } });
    res.status(200).json(allRecords);
  } catch {
    res.status(403).send('No users were found');
  }
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  try {
    let theRecord = await users.findOne({ where: { id: id } });
    res.status(200).json(theRecord);
  } catch {
    res.status(403).send('No users were found');
  }
}

async function handleUpdate(req, res) {
  try {
    let id = req.params.id;
    let found = await users.findOne({ where: { id: id } });
    if (found) {
      let updated = await found.update({ approved: true });
      res.status(201).json(updated);
    }
  } catch (err) {
    console.log(err);
    res.status(400).send('Invalid Input');
  }
}

async function handleDelete(req, res) {
  let id = req.params.id;

  try {
    let found = await users.findOne({ where: { id: id } });

    if (found) {
      let deletedRecord = await found.destroy();
    }
    res.status(204).send({ message: 'done' });
  } catch {
    res.status(400).send('User wasnt found');
  }
}

module.exports = approveRouter;
