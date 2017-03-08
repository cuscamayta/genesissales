"use strict";

module.exports = function (sequelize, DataTypes) {
  var Cashbox = sequelize.define("Cashbox", {
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    account: { type: DataTypes.STRING(20), allowNull: false },
    cashier: { type: DataTypes.STRING(100), allowNull: false }
  },
    {
      classMethods: {
        associate: function (models) {
          Cashbox.belongsTo(models.Office, { foreignKey: "idoffice", allowNull: false });
          Cashbox.hasMany(models.Cashtransaction, { foreignKey: "idcashbox", allowNull: false });
        }
      }
    }
  );
  return Cashbox;
};