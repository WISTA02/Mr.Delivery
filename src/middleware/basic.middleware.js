'use strict';
const { users } = require('../models/index.model');

const base64 = require('base-64');

module.exports = async (req, res, next) => {
  let basicHeaderParts = req.headers.authorization.split(' ');
  let encodedString = basicHeaderParts.pop();
  let decodedString = base64.decode(encodedString);
  let [username, password] = decodedString.split(':');
  try {
    req.user = await users.authenticateBasic(username, password);

    next();
  } catch (e) {
    res.status(403).send('Invalid Login');
  }
};
