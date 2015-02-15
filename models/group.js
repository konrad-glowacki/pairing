"use strict";

module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define("Group", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    description: {
      type: DataTypes.TEXT
    }
  }, {
    classMethods: {
      associate: function(models) {
        Group.hasMany(models.User)
      }
    }
  });

  return Group;
};
