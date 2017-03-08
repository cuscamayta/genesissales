"use strict";
var moment = require("moment");
var common = require('../routes/common');

module.exports = function (sequelize, DataTypes) {
    var Cashtransaction = sequelize.define("Cashtransaction", {
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
        total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        code: { type: DataTypes.STRING(20), allowNull: false },
        comment: { type: DataTypes.STRING(100), allowNull: false },
        currency: { type: DataTypes.INTEGER(4), allowNull: false }, //moneda 1:Bs 2:Usd
        rate: { type: DataTypes.DECIMAL(10, 2), allowNull: false }, //Tipo de cambio
        type: { type: DataTypes.INTEGER(4), allowNull: false }, //0: Egreso 1: Ingreso
        origin: { type: DataTypes.INTEGER(4), allowNull: false }, //origen: 1 Venta
        number: { type: DataTypes.INTEGER(11), allowNull: false }, //nro de transaccion origin
        accounting: { type: DataTypes.INTEGER(11), allowNull: false }, //nro transaccion contable
        status: { type: DataTypes.INTEGER(4), allowNull: false },
        readonly: { type: DataTypes.INTEGER(4), allowNull: false }
    },
        {
            classMethods: {
                associate: function (models) {
                    Cashtransaction.belongsTo(models.User, { foreignKey: "iduser", allowNull: false });
                    Cashtransaction.belongsTo(models.Office, { foreignKey: "idoffice", allowNull: false });
                    Cashtransaction.belongsTo(models.Cashbox, { foreignKey: "idcashbox", allowNull: false });
                }
            }
        }
    );
    return Cashtransaction;
};