"use strict";

module.exports = function (sequelize, DataTypes) {
  var Costcenter = sequelize.define("Costcenter", {
    title: { type: DataTypes.STRING, allowNull: false, unique: true }
  },
    {
      classMethods: {
        associate: function (models) {
          Costcenter.hasMany(models.Sale, { foreignKey: "idoffice", allowNull: false });
        }
      }
    }
  );
  return Costcenter;
};