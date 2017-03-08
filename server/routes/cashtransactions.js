var models = require('./../models');
var express = require('express');
var router = express.Router();
var common = require('./common');

router.post('/create', common.isAuthenticate, function (request, response) {
    models.Cashtransaction.create({
        name: request.body.name,
        model: request.body.model,
        make: request.body.make,
        unitprice: request.body.unitprice,
        wholesaleprice: request.body.wholesaleprice,
        cost: request.body.cost,
        serialnumber: request.body.serialnumber,
        barcode: request.body.barcode,
        type: request.body.type,
        detail: request.body.detail
    }).then(function (res) {
        response.send(common.response(res, "Se guardo correctamente"));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/update', common.isAuthenticate, function (request, response) {
    models.Cashtransaction.update({
        name: request.body.name,
        model: request.body.model,
        make: request.body.make,
        unitprice: request.body.unitprice,
        wholesaleprice: request.body.wholesaleprice,
        cost: request.body.cost,
        serialnumber: request.body.serialnumber,
        barcode: request.body.barcode,
        type: request.body.type,
        detail: request.body.detail
    }, {
            where: { id: request.body.id }
        }).then(function (res) {
            response.send(common.response(res, "Se guardo correctamente"));
        }).catch(function (err) {
            response.send(common.response(err.code, err.message, false));
        });
});

router.get('/', common.isAuthenticate, function (request, response) {
    models.Cashtransaction.findAll().then(function (res) {
        response.send(common.response(res));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/forid', common.isAuthenticate, function (request, response) {
    models.Cashtransaction.findOne({
        where: { id: request.body.id }
    }).then(function (res) {
        response.send(common.response(res));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.get('/forselect', common.isAuthenticate, function (request, response) {
    models.Cashtransaction.findAll({
        attributes: ["id", "name"]
    }).then(function (res) {
        response.send(common.response(res));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

router.post('/destroy', common.isAuthenticate, function (request, response) {
    models.Cashtransaction.destroy({
        where: { id: request.body.id }
    }).then(function () {
        response.send(common.response("", "Se elimino correctamente"));
    }).catch(function (err) {
        response.send(common.response(err.code, err.message, false));
    });
});

module.exports = router;