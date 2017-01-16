var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');

router.get('/', common.isAuthenticate, function (request, response) {
    models.Sale.findAll({
        include: [{ model: models.Warehouse }, { model: models.Office }]
    }).then(function (res) {
        response.send(common.response(res));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/dailycash', common.isAuthenticate, function (request, response) {

    models.Sale.findAll({
        include: [{ model: models.User }],
        where: { dateregister: common.formatDate(request.body.dateregister), iduser: request.body.iduser, status: 1 },
        order: 'idschedule ASC'
    }).then(function (res) {
        response.send(common.response(res));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

function createsalesbook(request, codecontrol, numberinvoice, numberorder, typeorder, idorderbook) {
    return {
        type: typeorder,
        numberorder: numberorder,
        numbercontrol: codecontrol,
        numberid: request.body.numbernitinvoice,
        fullname: request.body.nameinvoice,
        numberinvoice: numberinvoice,
        dateregister: request.body.dateregister,
        amountinvoice: request.body.amountinvoice,
        amountinvoiceice: 0,
        amountinvoiceexento: 0,
        amountinvoicenet: (request.body.amountinvoice - (request.body.amountinvoice * 0.13)),
        amountoftax: (request.body.amountinvoice * 0.13),
        status: 1,
        idoffice: request.body.idoffice,
        idorderbook: idorderbook
    };
}

function createsale(request, salebook, inventory) {
    return {
        dateregister: request.body.dateregister,
        arrival: request.body.arrival,
        departure: request.body.departure,
        total: request.body.amountinvoice,
        detail: request.body.detail,
        status: 1,
        idinventory: inventory.id,
        idoffice: request.body.idoffice,
        idsalesbook: salebook.id,
        idwarehouse: request.body.idwarehouse,
        iduser: request.body.iduser
    };
}

function createdetailsales(request, index, inventorydetail, sale) {
    return {
        price: request.body.details[index].price,
        quantity: request.body.details[index].quantity,
        status: 1,
        idinventorydetail: inventorydetail.id,
        iditem: request.body.details[index].iditem,
        idsale: sale.id
    };
}

function createinventory(request) {
    return {
        dateregister: request.body.dateregister,
        total: request.body.total,
        code: request.body.dateregister,
        typeprice: request.body.typeprice,
        type: 0,
        status: 1,
        idwarehouse: request.body.idwarehouse,
        iduser: request.body.iduser,
        idoffice: request.body.idoffice,
        readonly: 1
    };
}

function createdetailinventory(request, index, inventory) {
    return {
        price: request.body.details[index].price,
        cost: request.body.details[index].cost,
        quantity: request.body.details[index].quantity,
        iditem: request.body.details[index].iditem,
        idinventory: inventory.id
    };
}

function getcodecontrol(request, numberorder, numberinvoice, numbernit, controlkey) {
    var dateinvoice = request.body.dateregister.split("/")[2] + request.body.dateregister.split("/")[1] + request.body.dateregister.split("/")[0];

    return invoice.generateControlCode(
        numberorder, numberinvoice, numbernit, dateinvoice, request.body.amountinvoice, controlkey
    );
}

function getdatesinvoice(orderbook, request) {
    return {
        deadline: orderbook.deadline.split("/")[2] + "/" + orderbook.deadline.split("/")[1] + "/" + orderbook.deadline.split("/")[0],
        datecurrent: request.body.dateregister.split("/")[2] + "/" + request.body.dateregister.split("/")[1] + "/" + request.body.dateregister.split("/")[0]
    }
}

router.post('/create', common.isAuthenticate, function (request, response) {
    var numberinvoice = 0;
    return models.sequelize.transaction(function (t) {

        return models.Setting.findOne({ transaction: t }).then(function (setting) {
            if (setting) {
                return models.Orderbook.findOne({ where: { idoffice: request.body.idoffice, status: 2, type: 1 } }, { transaction: t }).then(function (orderbook) {
                    if (orderbook) {
                        var datesInvoice = getdatesinvoice(orderbook, request);
                        if (moment(datesInvoice.datecurrent).isAfter(datesInvoice.deadline)) {
                            throw new Error("Libro de ordenes vencido");
                        } else {
                            return models.Salesbook.max('numberinvoice', { where: { numberorder: orderbook.numberorder } }, { transaction: t }).then(function (nroinvoice) {
                                if (!nroinvoice) nroinvoice = 0
                                numberinvoice = (nroinvoice + 1), controlcode = getcodecontrol(request, orderbook.numberorder, numberinvoice, setting.numberid, orderbook.controlkey);

                                return models.Salesbook.create(createsalesbook(request, controlcode, numberinvoice, orderbook.numberorder, orderbook.type, orderbook.id), { transaction: t }).then(function (salebook) {

                                    return models.Salesbook.max('numberinvoice', { where: { numberorder: orderbook.numberorder } }, { transaction: t }).then(function (nroinvoice) {

                                        return models.Inventorytransaction.create(createinventory(request), { transaction: t }).then(function (inventory) {

                                            return models.Sale.create(createsale(request, salebook, inventory), { transaction: t }).then(function (sale) {

                                                var inventorydetailpromises = [];

                                                for (var index = 0; index < request.body.details.length; index++) {
                                                    var inventorydetailpromise = models.Inventorydetail.create(createdetailinventory(request, index, inventory), { transaction: t });
                                                    inventorydetailpromises.push(inventorydetailpromise);
                                                }

                                                return Promise.all(inventorydetailpromises).then(function (invdetails) {
                                                    var salesdetailpromises = [];
                                                    for (var index = 0; index < invdetails.length; index++) {

                                                        var salesdetailpromise = models.Salesdetail.create(createdetailsales(request, index, invdetails[index].dataValues, sale), { transaction: t });
                                                        salesdetailpromises.push(salesdetailpromise, { transaction: t });
                                                    }
                                                    return Promise.all(salesdetailpromises);
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        }
                    } else {
                        throw new Error("No existe libro de orden");
                    }
                });
            } else {
                throw new Error("No existe configuración de la empresa");
            }
        });

    }).then(function () {
        response.send(common.response(numberinvoice, "Se guardo correctamente"));
    }).catch(function (err) {
        response.send(common.response(err.name, err.message, false));
    });
});

router.post('/invalidate', common.isAuthenticate, function (request, response) {

    return models.sequelize.transaction(function (t) {
        var nro = request.body.id;
        return models.Salesbook.update({ status: 0 }, { where: { id: request.body.id } }, { transaction: t }).then(function (salebook) {
            return models.Sale.findOne({ where: { idsalesbook: request.body.id } }, { transaction: t }).then(function (sale) {
                return models.Sale.update({ status: 0 }, { where: { idsalesbook: request.body.id } }, { transaction: t }).then(function () {
                    return models.Salesdetail.update({ status: 0 }, { where: { idsale: sale.id } }, { transaction: t }).then(function () {
                        return models.Ticket.update({ status: 0 }, { where: { idsale: sale.id } }, { transaction: t }).then(function () {
                        });
                    });
                });
            });
        });

    }).then(function (result) {
        response.send(common.response(null, "Se anulo correctamente"));
    }).catch(function (err) {
        response.send(common.response(err.name, err.message, false));
    });
});

module.exports = router;