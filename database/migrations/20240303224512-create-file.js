"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("files", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      chat_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "chats",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      file_path: {
        type: Sequelize.STRING,
      },
      file_name: {
        type: Sequelize.STRING,
      },
      file_type: {
        type: Sequelize.STRING,
      },
      file_size: {
        type: Sequelize.INTEGER,
      },
      duration: {
        type: Sequelize.INTEGER,
      },
      extension: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("files");
  },
};
