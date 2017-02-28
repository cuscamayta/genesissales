"use strict";

module.exports = function (sequelize, DataTypes) {
    var Salesdetail = sequelize.define("Salesdetail", {
        price: { type: DataTypes.DECIMAL, allowNull: false },
        discount: { type: DataTypes.DECIMAL, allowNull: false },
        quantity: { type: DataTypes.DECIMAL(10, 4), allowNull: false },
        status: { type: DataTypes.INTEGER(4), allowNull: false }
    },
        {
            classMethods: {
                associate: function (models) {
                    Salesdetail.belongsTo(models.Inventorydetail, { foreignKey: "idinventorydetail", allowNull: false });
                    Salesdetail.belongsTo(models.Sale, { foreignKey: "idsale", allowNull: false });
                    Salesdetail.belongsTo(models.Item, { foreignKey: "iditem", allowNull: false });
                }
            }
        }
    );
    return Salesdetail;
};