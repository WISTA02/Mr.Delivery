'use strict';
const express = require('express');
const socketRouter = express.Router();
const { users, orderTable } = require('../models/index.model');
// const bearer = require('../middleware/bearer.middleware');
// const role = require('../middleware/role.middleware');



socketRouter.get('/getUser',  handleGet);
async function handleGet(req,res){
    const userRecords = await users.findAll();
    res.send(userRecords);

}

module.exports = socketRouter;