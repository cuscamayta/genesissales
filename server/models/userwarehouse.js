"use strict";

module.exports = function (sequelize, DataTypes) {
    var Userwarehouse = sequelize.define("Userwarehouse", {
    }, {
            classMethods: {
                associate: function (models) {
                    Userwarehouse.belongsTo(models.User, { foreignKey: "iduser", primaryKey: true, allowNull: false });
                    Userwarehouse.belongsTo(models.Warehouse, { foreignKey: "idwarehouse", primaryKey: true, allowNull: false });
                }
            }
        }
    );
    return Userwarehouse;
};