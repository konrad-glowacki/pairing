"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    GroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'groupEmailIndex'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'groupEmailIndex'
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.belongsTo(models.Group)
      }
    }
  });

  return User;
};
