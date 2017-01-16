"use strict";
var moment = require("moment");
var common = require('../routes/common');

module.exports = function (sequelize, DataTypes) {
    var Transfer = sequelize.define("Transfer", {
        dateregister: {
            type: DataTypes.DATE, allowNull: false,
            set: function (val) {
                this.setDataValue('dateregister', common.formatDate(val));
            },
            get: function (val) {
                var date = this.getDataValue('dateregister');
                return moment(date).format("DD/MM/YYYY");
            }
        },
        detail: { type: DataTypes.STRING, allowNull: true },
        total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        typeprice: { type: DataTypes.INTEGER(4), allowNull: false },
        code: { type: DataTypes.STRING(8), allowNull: false },
        status: { type: DataTypes.INTEGER(4), allowNull: false }
    },
        {
            classMethods: {
                associate: function (models) {
                    Transfer.belongsTo(models.Inventorytransaction, { foreignKey: "idinventoryinput", allowNull: false });
                    Transfer.belongsTo(models.Inventorytransaction, { foreignKey: "idinventoryoutput", allowNull: false });
                    Transfer.belongsTo(models.Warehouse, { foreignKey: "idwarehouseinput", allowNull: false });
                    Transfer.belongsTo(models.Warehouse, { foreignKey: "idwarehouseoutput", allowNull: false });
                    Transfer.belongsTo(models.User, { foreignKey: "iduser", allowNull: false });
                    Transfer.belongsTo(models.Office, { foreignKey: "idoffice", allowNull: false });
                }
            }
        }
    );
    return Transfer;
};