'use strict';

const restModel = (sequelize, DataTypes) =>
  sequelize.define(
    'restaurants',
    {
      name: { type: DataTypes.STRING },

      rating: { type: DataTypes.FLOAT(6) },

      delivery_fee: { type: DataTypes.FLOAT(6) },

      location: { type: DataTypes.JSONB },

      profits: { type: DataTypes.FLOAT(6), defaultValue: 0 },

      owner_id: { type: DataTypes.INTEGER },

      rating: { type: DataTypes.FLOAT(6),defaultValue:0.0},

      count: { type: DataTypes.INTEGER },
    },
    
    { timestamps: false }
  );

module.exports = restModel;
