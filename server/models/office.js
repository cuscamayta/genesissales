"use strict";

module.exports = function (sequelize, DataTypes) {
  var Office = sequelize.define("Office", {
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    address: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: true },
    detail: { type: DataTypes.STRING, allowNull: true }
  },
    {
      classMethods: {
        associate: function (models) {
          Office.hasMany(models.Useroffice, { foreignKey: "idoffice", allowNull: false });
          Office.hasMany(models.Orderbook, { foreignKey: "idoffice", allowNull: false });
          Office.hasMany(models.Sale, { foreignKey: "idoffice", allowNull: false });
          Office.hasMany(models.Salesbook, { foreignKey: "idoffice", allowNull: false });
          Office.hasMany(models.Transfer, { foreignKey: "idoffice", allowNull: false });
          Office.hasMany(models.Inventorytransaction, { foreignKey: "idoffice", allowNull: false });
          Office.hasMany(models.Cashbox, { foreignKey: "idoffice", allowNull: false });
          Office.hasMany(models.Cashtransaction, { foreignKey: "idoffice", allowNull: false });
        }
      }
    }
  );
  return Office;
};