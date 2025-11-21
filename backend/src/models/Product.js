const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  sku: { type: DataTypes.STRING(80), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  short_description: { type: DataTypes.STRING(512) },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0.00 },
  active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'product', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

module.exports = Product;
