'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
const users = (sequelize, DataTypes) => {
  const model = sequelize.define(
    'users',
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
        type: DataTypes.ENUM('admin', 'user', 'driver', 'owner'),
        defaultValue: 'user',
      },

      email: { type: DataTypes.STRING, allowNull: false, unique: true },

      phone: { type: DataTypes.STRING },

      location: { type: DataTypes.JSONB },

      profits: { type: DataTypes.FLOAT(6), defaultValue: 0 },

      approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { timestamps: false }
  );

  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username: username } });

    const approved = user.approved;

    const valid = await bcrypt.compare(password, user.password);

    if (valid && approved) {
      let newToken = jwt.sign({ username: user.username }, process.env.SECRET);
      // console.log('********', newToken);
      user.token = newToken;
      return user;
    }
    throw new Error('Invalid User or not yet approved');
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

module.exports = users;
