'use strict';

const mealModel = (sequelize, DataTypes) =>
  sequelize.define(
    'meal',
    {
      name: { type: DataTypes.STRING, required: true },

      description: { type: DataTypes.STRING, required: true },

      price: { type: DataTypes.FLOAT(6) },

      restaurant_id: { type: DataTypes.INTEGER },

      image: { type: DataTypes.JSONB },

      flag: { type: DataTypes.ARRAY(DataTypes.STRING) },
    },
    { timestamps: false }
  );

module.exports = mealModel;
