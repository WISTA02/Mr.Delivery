'use strict';

const orderDetailsModel = (sequelize, DataTypes) =>
  sequelize.define(
    'orders',
    {
      all_items: { type: DataTypes.ARRAY(DataTypes.JSONB) },

      status: {
        type: DataTypes.ENUM(
          'New-order',
          'Restaurant-is-preparing',
          'Driver-accepted',
          'Out-for-delivery',
          'Delivered',
          'Cancelled'
        ),
        defaultValue: 'New-order',
      },
      total_price: { type: DataTypes.FLOAT(6) },

      rated: { type: DataTypes.BOOLEAN, defaultValue: false },

      restaurant_id: { type: DataTypes.INTEGER },

      restaurant_name: { type: DataTypes.STRING },

      restaurant_location: { type: DataTypes.JSONB },

      driver_id: { type: DataTypes.INTEGER },

      rated: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    { timestamps: false }
  );

module.exports = orderDetailsModel;
