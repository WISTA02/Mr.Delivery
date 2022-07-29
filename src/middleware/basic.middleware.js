'use strict';
const { users, drivers, owners } = require('../models/index.model');

const base64 = require('base-64');

module.exports = (index) => async (req, res, next) => {
  let tableArr = [users, drivers, owners];
  let basicHeaderParts = req.headers.authorization.split(' ');
  let encodedString = basicHeaderParts.pop();
  let decodedString = base64.decode(encodedString);
  let [username, password] = decodedString.split(':');
  console.log(password);
  try {
    req.user = await tableArr[index].authenticateBasic(username, password);

    next();
  } catch (e) {
    res.status(403).send('Invalid Login');
  }
};
