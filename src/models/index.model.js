'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const users = require('./user.model');
const drivers = require('./driver.model');
const DataCollection = require('./lib/collection.model');
const mealModel = require('./meal.model');
const orderModel = require('./order.model');
const restModel = require('./restaurant.model');

const DATABASE_URL =
  process.env.NODE_ENV === 'test' ? 'sqlite::memory' : process.env.DATABASE_URL;

const DATABASE_CONFIG =
  process.env.NODE_ENV === 'production'
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {};

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);

const userTable = users(sequelize, DataTypes);

const driverTable = drivers(sequelize, DataTypes);
const driverCollection = new DataCollection(driverTable);

const orderTable = orderModel(sequelize, DataTypes);
const orderCollection = new DataCollection(orderTable);

const mealTable = mealModel(sequelize, DataTypes);
const mealsCollection = new DataCollection(mealTable);

const restTable = restModel(sequelize, DataTypes);
const restCollection = new DataCollection(restTable);

////////////relations/////////////////////////////////////

userTable.hasMany(orderTable); // user many orders
orderTable.belongsTo(userTable); // order one user

module.exports = {
  db: sequelize,
  users: userTable,
  driverTable: driverTable,
  driverCollection: driverCollection,
  orderTable: orderTable,
  orderCollection: orderCollection,
  mealTable: mealTable,
  mealsCollection: mealsCollection,
  restCollection: restCollection,
  restTable: restTable,
};
