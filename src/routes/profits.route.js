'use strict';

const express = require('express');
const bearer = require('../middleware/bearer.middleware');
const { orderTable, restTable, users } = require('../models/index.model');
const role = require('../middleware/role.middleware');
const profitsRouter = express.Router();

profitsRouter.get('/profits-owner', bearer, role(["owner"]), handleGetProfitOwner);
profitsRouter.get('/profits-app', bearer, role(["admin"]), handleGetProfitApp);
profitsRouter.get('/profits-driver', bearer, role(["driver"]), handleGetProfitDriver);

async function handleGetProfitOwner(req, res) {
    let restaurant = await restTable.findOne({ where: { owner_id: req.user.id } });
    res.status(200).json(restaurant);
}
async function handleGetProfitApp(req, res) {
    let app = await users.findOne({ where: { role: "admin" } });
    res.status(200).json(app);
}
async function handleGetProfitDriver(req, res) {
    let driver = await users.findOne({ where: { id: req.user.id } });
    res.status(200).json(driver);
}

module.exports = profitsRouter;