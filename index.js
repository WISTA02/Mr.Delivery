'use strict';

// Start up DB Server
require('dotenv').config();

const { db } = require('./src/auth/models/index');
const server = require('./src/server.js');
db.sync().then(() => {
  // Start the web server
  server.startup(process.env.PORT || 3000);
});
