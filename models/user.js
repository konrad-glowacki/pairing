"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is empty' }
      }
    },

    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Surname is empty' }
      }
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUnique: function(value, next) {
          User.find({ where: { email: value, groupId: this.getDataValue('GroupId') }})
            .done(function(error, user) {
              if (error) {
                return next(error);
              }

              if (user) {
                return next('Email already in registered');
              }

              next();
            });
        },
        isLowercase: { msg: 'Email must be lowercase' },
        notEmpty: { msg: 'Email is empty' },
        isEmail: { msg: 'Email is invalid' }
      }
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
