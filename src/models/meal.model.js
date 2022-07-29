

'use strict';

const mealModel = (sequelize, DataTypes) => sequelize.define('meal', {
    name: { type: DataTypes.STRING, required: true },
    description: { type: DataTypes.STRING, required: true },
    price: { type: DataTypes.FLOAT(11) },
}, { timestamps: false });


module.exports = mealModel;

