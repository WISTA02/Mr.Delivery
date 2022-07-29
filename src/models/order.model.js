'use strict';

const sequelize = require('sequelize');

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
      },
      total_price: { type: DataTypes.FLOAT(6) },
    },
    { timestamps: false }
  );

module.exports = orderDetailsModel;
