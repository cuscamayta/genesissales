var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');

router.post('/create', common.isAuthenticate, function (request, response) {
    return models.sequelize.transaction(function (t) {
        return models.Inventorytransaction.create({
            dateregister: request.body.dateregister,
            total: request.body.total,
            code: request.body.code,
            typeprice: request.body.typeprice,
            type: request.body.type,
            status: 1,
            idwarehouse: request.body.idwarehouse,
            iduser: request.body.iduser,
            idoffice: request.body.idoffice,
            readonly: 0
        }, { transaction: t }).then(function (res) {
            for (var i = 0; i < request.body.details.length; i++) {
                var quantityDet = request.body.details[i].quantity;
                if (request.body.type == 0) {
                    quantityDet = (request.body.details[i].quantity * - 1);
                }
                return models.Inventorydetail.create({
                    price: request.body.details[i].price,
                    discount: 0,
                    cost: request.body.details[i].cost,
                    quantity: quantityDet,
                    iditem: request.body.details[i].iditem,
                    idinventory: res.id
                }), { transaction: t };
            }
        });
    }).then(function (res) {
        response.send(common.response(null, "Se guardo correctamente"));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});


router.post('/update', common.isAuthenticate, function (request, response) {
    return models.sequelize.transaction(function (t) {
        return models.Inventorytransaction.update({
            dateregister: request.body.dateregister,
            total: request.body.total,
            code: request.body.code,
            typeprice: request.body.typeprice,
            type: request.body.type,
            status: 1,
            idwarehouse: request.body.idwarehouse,
            iduser: request.body.iduser,
            idoffice: request.body.idoffice
        }, { where: { id: request.body.id, readonly: 0 } }, { transaction: t }).then(function (res) {
            for (var i = 0; i < request.body.details.length; i++) {
                if (request.body.details[i].state == 1) {
                    var quantityDet = request.body.details[i].quantity;
                    if (request.body.type == 0) {
                        quantityDet = (request.body.details[i].quantity * - 1);
                    }
                    return models.Inventorydetail.create({
                        price: request.body.details[i].price,
                        discount: 0,
                        cost: request.body.details[i].cost,
                        quantity: quantityDet,
                        iditem: request.body.details[i].iditem,
                        idinventory: request.body.id
                    }), { transaction: t };
                }
                if (request.body.details[i].state == 0) {
                    return models.Inventorydetail.destroy({
                        where: { id: request.body.details[i].id }
                    }), { transaction: t };
                }
            }
        });
    }).then(function (res) {
        response.send(common.response(null, "Se guardo correctamente"));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.get('/', common.isAuthenticate, function (request, response) {
    models.Inventorytransaction.findAll({
        include: [{ model: models.Inventorydetail, include: [models.Item] }, { model: models.Warehouse }, { model: models.User }],
        where: { status: 1 }
    }).then(function (res) {
        response.send(common.response(res));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/forid', common.isAuthenticate, function (request, response) {
    models.Inventorytransaction.findOne({
        include: [{ model: models.Inventorydetail, include: [models.Item] }],
        where: { id: request.body.id, status: 1 }
    }).then(function (res) {
        response.send(common.response(res));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/forselect', common.isAuthenticate, function (request, response) {
    models.Inventorytransaction.findAll({
        include: [{ model: models.Bus, include: [models.Bustype] }, { model: models.Ticket, where: { status: 1 }, required: false }], where: { idtravel: request.body.id },
        where: { status: 1 },
        order: 'dateregister DESC'
    }).then(function (res) {
        response.send(common.response(res));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/destroy', common.isAuthenticate, function (request, response) {
    return models.sequelize.transaction(function (t) {
        return models.Inventorydetail.update({ status: 0 },
            {
                where: { idinventory: request.body.id }
            }, { transaction: t }).then(function (res) {
                return models.Inventorytransaction.destroy({
                    where: { id: request.body.id }
                }), { transaction: t };
            });
    }).then(function (res) {
        response.send(common.response(null, "Se elimino correctamente"));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

module.exports = router;