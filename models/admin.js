"use strict";

module.exports = function(sequelize, DataTypes) {
  var Admin = sequelize.define("Admin", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is empty' }
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is empty' }
      }
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      uniq: true,
      validate: {
        isLowercase: { msg: 'Email must be lowercase' },
        notEmpty: { msg: 'Email is empty' },
        isEmail: { msg: 'Email is invalid' }
      }
    },

    permission: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Admin;
};
