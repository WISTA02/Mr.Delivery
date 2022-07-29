'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const drivers = (sequelize, DataTypes) => {
  const model = sequelize.define(
    'drivers',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.VIRTUAL,
      },
      role: {
        type: DataTypes.ENUM('admin', 'user', 'driver', 'resturant_owner'),
        defaultValue: 'driver',
      },

      email: { type: DataTypes.STRING },

      phone: { type: DataTypes.INTEGER },

      car_number: { type: DataTypes.INTEGER },

      location: { type: DataTypes.JSONB },

      status_counter: { type: DataTypes.INTEGER, defaultValue: 0 },

      profits: { type: DataTypes.FLOAT(8), defaultValue: 0 },
    },

    { timestamps: false }
  );

  model.beforeCreate = async function (password) {
    let hashedPass = await bcrypt.hash(password, 50);

    return hashedPass;
  };

  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username: username } });

    const valid = await bcrypt.compare(password, user.password);

    if (valid) {
      let newToken = jwt.sign({ username: user.username }, process.env.SECRET);
      // console.log('********', newToken);
      user.token = newToken;
      return user;
    }
    throw new Error('Invalid User');
  };

  model.authenticateBearer = async function (token) {
    try {
      const parsedToken = jwt.verify(token, SECRET);
      const user = this.findOne({ where: { username: parsedToken.username } });
      if (user) {
        return user;
      }
      throw new Error('User Not Found');
    } catch (e) {
      throw new Error(e.message);
    }
  };
  return model;
};

module.exports = drivers;
