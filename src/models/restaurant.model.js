'use strict';

const restModel = (sequelize, DataTypes) =>
  sequelize.define(
    'restaurants',
    {
      name: { type: DataTypes.STRING },

      order_path: { type: DataTypes.INTEGER },

      rating: { type: DataTypes.FLOAT(6) },

      delivery_fee: { type: DataTypes.FLOAT(6) },

      location: { type: DataTypes.JSONB },
    },
    { timestamps: false }
  );

module.exports = restModel;
