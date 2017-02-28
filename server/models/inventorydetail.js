"use strict";

module.exports = function (sequelize, DataTypes) {
    var Inventorydetail = sequelize.define("Inventorydetail", {
        price: { type: DataTypes.DECIMAL, allowNull: false },
        discount: { type: DataTypes.DECIMAL, allowNull: false },
        cost: { type: DataTypes.DECIMAL, allowNull: false },
        quantity: { type: DataTypes.DECIMAL(10, 4), allowNull: false },
    },
        {
            classMethods: {
                associate: function (models) {
                    Inventorydetail.belongsTo(models.Item, { foreignKey: "iditem", allowNull: false });
                    Inventorydetail.belongsTo(models.Inventorytransaction, { foreignKey: "idinventory", allowNull: false });
                    Inventorydetail.hasMany(models.Salesdetail, { foreignKey: "idinventorydetail", allowNull: false });
                }
            }
        }
    );
    return Inventorydetail;
};