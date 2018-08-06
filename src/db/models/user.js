'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {msg: "must be a vaild email"}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  User.associate = function(models) {

    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });

  };
  return User;
};