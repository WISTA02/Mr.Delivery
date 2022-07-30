'use strict';

const drivers = (sequelize, DataTypes) => {
  const model = sequelize.define(
    'driverInformation',
    {
      car_number: { type: DataTypes.INTEGER },

      status_counter: { type: DataTypes.INTEGER, defaultValue: 0 },
    },

    { timestamps: false }
  );
  return model;
};

module.exports = drivers;
