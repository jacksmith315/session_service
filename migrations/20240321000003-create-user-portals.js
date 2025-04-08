'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserPortals', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      portalId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Portals',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      role: {
        type: Sequelize.ENUM('user', 'admin', 'owner'),
        defaultValue: 'user'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'pending'),
        defaultValue: 'pending'
      },
      lastAccess: {
        type: Sequelize.DATE
      },
      preferences: {
        type: Sequelize.JSON,
        defaultValue: {}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add composite unique constraint
    await queryInterface.addConstraint('UserPortals', {
      fields: ['userId', 'portalId'],
      type: 'unique',
      name: 'unique_user_portal'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserPortals');
  }
};