'use strict';
module.exports = (sequelize, DataTypes) => {
  var chat = sequelize.define('users', {
    userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    //socialId: { type: DataTypes.BIGINT },
    email: { type: DataTypes.STRING(20)},
    password: { type: DataTypes.STRING(20)},
    userName: { type: DataTypes.STRING(191)},
    //mobileNumber: { type: DataTypes.STRING(20)},
    profilePicture: { type: DataTypes.STRING(50)},
    api_token: { type: DataTypes.STRING(256)},
    //remember_token: { type: DataTypes.STRING(256)},
    device_type: { type: DataTypes.STRING(20)},
    device_token: { type: DataTypes.STRING(256)},
    status: { type: DataTypes.ENUM('Active','Inactive'), allowNull: false, defaultValue: 'Active' },
    created_at: { type: DataTypes.DATE, allowNull: false },
    //updated_at: { type: DataTypes.DATE, allowNull: false },
  }, {
    tableName: 'user',
    timestamps: false,
  });
  return chat;
};