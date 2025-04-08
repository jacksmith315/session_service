const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Portal = sequelize.define('Portal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isUrl: true
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
    defaultValue: 'active'
  },
  apiKey: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true
  },
  settings: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
});

module.exports = Portal;