"use strict";

module.exports = function (sequelize, DataTypes) {
  var Account = sequelize.define("Account", {
    title: { type: DataTypes.STRING, allowNull: false, unique: true }
  },
    {
      classMethods: {
        associate: function (models) {
          Account.hasMany(models.Sale, { foreignKey: "idoffice", allowNull: false });
        }
      }
    }
  );
  return Account;
};