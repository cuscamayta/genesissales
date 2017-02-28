"use strict";

module.exports = function (sequelize, DataTypes) {
    var Item = sequelize.define("Item", {
        name: { type: DataTypes.STRING, allowNull: false },
        model: { type: DataTypes.STRING, allowNull: false },
        make: { type: DataTypes.STRING, allowNull: false },
        unitprice: { type: DataTypes.DECIMAL(10, 4), allowNull: false },
        wholesaleprice: { type: DataTypes.DECIMAL(10, 4), allowNull: false },
        cost: { type: DataTypes.DECIMAL, allowNull: false },
        serialnumber: { type: DataTypes.STRING, allowNull: true },
        barcode: { type: DataTypes.STRING, allowNull: true },
        minstock: { type: DataTypes.DECIMAL(10, 4), allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false },
        detail: { type: DataTypes.STRING, allowNull: true }
    },
        {
            classMethods: {
                associate: function (models) {
                    Item.hasMany(models.Inventorydetail, { foreignKey: "iditem", allowNull: false });
                    Item.hasMany(models.Salesdetail, { foreignKey: "iditem", allowNull: false });
                }
            }
        }
    );
    return Item;
};