var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');
var moment = require("moment");

function createTransfer(request, idinput, idoutput) {
    return {
        dateregister: request.body.dateregister,
        code: request.body.code,
        total: request.body.total,
        detail: request.body.detail,
        status: 1,
        typeprice: request.body.typeprice,
        idinventoryinput: idinput,
        idinventoryoutput: idoutput,
        idwarehouseinput: request.body.idwarehouseinput,
        idwarehouseoutput: request.body.idwarehouseoutput,
        iduser: request.body.iduser,
        idoffice: request.body.idoffice
    };
}

function createInventoryInput(request) {
    return {
        dateregister: request.body.dateregister,
        total: request.body.total,
        code: request.body.code,
        typeprice: request.body.typeprice,
        type: 1,
        status: 1,
        idwarehouse: request.body.idwarehouseinput,
        iduser: request.body.iduser,
        idoffice: request.body.idoffice,
        readonly: 1
    };
}

function createInventoryOutput(request) {
    return {
        dateregister: request.body.dateregister,
        total: request.body.total,
        code: request.body.code,
        typeprice: request.body.typeprice,
        type: 0,
        status: 1,
        idwarehouse: request.body.idwarehouseoutput,
        iduser: request.body.iduser,
        idoffice: request.body.idoffice,
        readonly: 1
    };
}

function createInventoryDetail(request, index, res) {
    var quantityDet = request.body.details[i].quantity;
    if (res.type == 0) {
        quantityDet = (request.body.details[i].quantity * - 1);
    }
    return {
        price: request.body.details[index].price,
        cost: request.body.details[index].cost,
        quantity: quantityDet,
        discount: 0,
        iditem: request.body.details[index].iditem,
        idinventory: res.id
    };
}

router.post('/create', common.isAuthenticate, function (request, response) {
    return models.sequelize.transaction(function (t) {

        return models.Inventorytransaction.create(createInventoryInput(request), { transaction: t }).then(function (input) {
            return models.Inventorytransaction.create(createInventoryOutput(request), { transaction: t }).then(function (output) {
                return models.Transfer.create(createTransfer(request, input.id, output.id), { transaction: t }).then(function (tranfer) {
                    var promises = []
                    for (var index = 0; index < request.body.details.length; index++) {
                        if (request.body.details[index].state == 1) {
                            var newPromise = models.Inventorydetail.create(createInventoryDetail(request, index, input), { transaction: t });
                            promises.push(newPromise);
                            var newPromise2 = models.Inventorydetail.create(createInventoryDetail(request, index, output), { transaction: t });
                            promises.push(newPromise2);
                        }
                    }
                    return Promise.all(promises);

                });
            });
        });

    }).then(function () {
        response.send(common.response(null, "Se guardo correctamente"));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/invalidate', common.isAuthenticate, function (request, response) {

    return models.sequelize.transaction(function (t) {

        return models.Transfer.update({ status: 0 }, { where: { id: request.body.id } }, { transaction: t }).then(function (transfer) {
            return models.Inventorytransaction.update({ status: 0 }, { where: { id: request.body.idinventoryinput, readonly: 1 } }, { transaction: t }).then(function () {
                return models.Inventorytransaction.update({ status: 0 }, { where: { id: request.body.idinventoryoutput, readonly: 1 } }, { transaction: t }).then(function () {
                    return models.Inventorydetail.destroy({ where: { idinventory: request.body.idinventoryinput } }, { transaction: t }).then(function () {
                        return models.Inventorydetail.destroy({ where: { idinventory: request.body.idinventoryoutput } }, { transaction: t }).then(function () {

                        });
                    });
                });
            });
        });

    }).then(function (result) {
        response.send(common.response(null, "Se anulo correctamente"));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.get('/', common.isAuthenticate, function (request, response) {
    models.Transfer.findAll({
        include: [{ model: models.Warehouse }, { model: models.User }],
        where: { status: 1 }
    }).then(function (res) {
        response.send(common.response(res));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

module.exports = router;