'use strict';

const drivers = (sequelize, DataTypes) => {
  const model = sequelize.define(
    'driverInformations',
    {
      car_number: { type: DataTypes.INTEGER },

      driver_id: { type: DataTypes.INTEGER },
    },

    { timestamps: false }
  );
  return model;
};

module.exports = drivers;
