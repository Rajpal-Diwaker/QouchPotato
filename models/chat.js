'use strict';
module.exports = (sequelize, DataTypes) => {
  var chat = sequelize.define('chat', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sender_id: { type: DataTypes.INTEGER },
    receiver_id: { type: DataTypes.INTEGER },
    message: { type: DataTypes.TEXT },
    //media: { type: DataTypes.STRING(100)},
    //media_type: { type: DataTypes.ENUM('image','video') },
    //sender_type: { type: DataTypes.ENUM('user','admin') },
    //receiver_type: { type: DataTypes.ENUM('user','admin') },
    //read_status: { type: DataTypes.ENUM('read','unread'), allowNull: false, defaultValue: 'unread' },
    status: { type: DataTypes.ENUM('Active','Inactive'), allowNull: false, defaultValue: 'Active' },
    date_added: { type: DataTypes.DATE, allowNull: false },
  }, {
    tableName: 'chat',
    timestamps: false,
  });
  return chat;
};