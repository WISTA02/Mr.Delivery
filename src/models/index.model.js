'use strict';

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const users = require('./user.js');
const owners = require('./owner');
const drivers = require('./driver');
const DataCollection = require('./lib/data-collection');
const mealModel = require('./meal');
const orderModel = require('./order');
const restModel = require('./resturant');

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
const ownerTable = owners(sequelize, DataTypes);
const driverTable = drivers(sequelize, DataTypes);

const orderTable = orderModel(sequelize, DataTypes);
const orderCollection = new DataCollection(orderTable);
//
const mealTable = mealModel(sequelize, DataTypes);
const mealsCollection = new DataCollection(mealTable);

const restTable = restModel(sequelize, DataTypes);
const restCollection = new DataCollection(restTable);

////////////relations/////////////////////////////////////

restTable.hasMany(mealTable, { foreignKey: 'restaurentId', sourceKey: 'id' });
mealTable.belongsTo(restTable, { foreignKey: 'restaurentId', targetKey: 'id' });

ownerTable.hasMany(restTable); // owner many rests
restTable.belongsTo(ownerTable); // rest one owner

userTable.hasMany(orderTable); // user many orders
orderTable.belongsTo(userTable); // order one user

driverTable.hasMany(orderTable); // driver many orders
orderTable.belongsTo(driverTable); // order one driver

restTable.hasMany(orderTable, { foreignKey: 'restaurentId', sourceKey: 'id' });
orderTable.belongsTo(restTable, {
  foreignKey: 'restaurentId',
  targetKey: 'id',
});

// sequelize.dropAllSchemas;
console.log('*********************************', sequelize.showAllSchemas());
// sequelize.sync({alter:true}).then(()=>{}).catch((e)=>console.log(e))
module.exports = {
  db: sequelize,
  users: userTable,
  drivers: driverTable,
  owners: ownerTable,
  orderTable: orderTable,
  orderCollection: orderCollection,
  mealTable: mealTable,
  mealsCollection: mealsCollection,
  restCollection: restCollection,
  restTable: restTable,
};
