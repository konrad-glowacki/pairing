"use strict";

module.exports = function(sequelize, DataTypes) {
  var UserPairs = sequelize.define("UserPairs", {
      RoundId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'RoundUserPairIndex'
      },

      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'RoundUserPairIndex'
      },

      PairId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: 'RoundUserPairIndex'
      }
    }, {
      validate: {
        checkPairAndUser: function() {
          if (this.UserId === this.PairId) {
            throw new Error('This same User can be in the Pair')
          }
        }
      },

      classMethods: {
        associate: function(models) {
          UserPairs.belongsTo(models.Round),
          UserPairs.belongsTo(models.User)
        }
      }
    }
  );

  return UserPairs;
};
