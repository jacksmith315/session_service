const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserPortal = sequelize.define('UserPortal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  portalId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Portals',
      key: 'id'
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'owner'),
    defaultValue: 'user'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    defaultValue: 'pending'
  },
  lastAccess: {
    type: DataTypes.DATE
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
});

module.exports = UserPortal;