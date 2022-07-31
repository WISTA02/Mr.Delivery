'use strict';

const drivers = (sequelize, DataTypes) => {
  const model = sequelize.define(
    'driverInformations',
    {
      car_number: { type: DataTypes.INTEGER },

      status_counter: { type: DataTypes.INTEGER, defaultValue: 0 },

      driver_id: { type: DataTypes.INTEGER },
    },

    { timestamps: false }
  );
  return model;
};

module.exports = drivers;
