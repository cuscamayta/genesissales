app.controller('TransferController', function ($scope, TransferService, WarehouseService, ItemService, $rootScope) {
    init();
    function init() {
        getwarehouses();
        getitems();
        gettransfers();
        datatransfer();

        $scope.edittransfer.dateregister = moment().format('DD/MM/YYYY');
        $('#dateregister').daterangepicker({
            locale: { format: 'DD/MM/YYYY' },
            singleDatePicker: true,
            showDropdowns: true,
            calender_style: "picker_4"
        }).on('apply.daterangepicker', function (ev, picker) {
            $scope.edittransfer.dateregister = picker.startDate.format('DD/MM/YYYY');
        });
    }

    function datatransfer() {
        $scope.edittransfer = {
            id: 0,
            state: 1,
            details: []
        };
        $scope.selectedwarehouse = null;
        $scope.selecteditem = null;
        $scope.transferdetails = [];

        $scope.editdetail = {
            state: "0"
        }
    };

    function gettransfers() {
        var response = TransferService.gettransfers();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $scope.transfers = res.data;
            }
        });
    }

    function getwarehouses() {
        var response = WarehouseService.getwarehouses();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $scope.listwarehouse = res.data;
            }
        });
    }

    function getitems() {
        var response = ItemService.getitems();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $scope.listitem = res.data;
            }
        });
    }

    $scope.savetransfer = function () {
        $scope.edittransfer;
        $scope.edittransfer.idoffice = $rootScope.idoffice;
        $scope.edittransfer.iduser = $rootScope.currentUser.user.id;
        $scope.edittransfer.typeprice = $scope.selectedtypeprice;
        $scope.edittransfer.idwarehouseinput = $scope.selectedwarehouseinput.id;
        $scope.edittransfer.idwarehouseoutput = $scope.selectedwarehouseoutput.id;
        $scope.edittransfer.total = $scope.sumTotal;
        $scope.edittransfer.details = $scope.transferdetails;
        if ($scope.edittransfer.id == 0) {
            var response = TransferService.savetransfer($scope.edittransfer);
            response.then(function (res) {
                if (!res.isSuccess) { toastr.error(res.message); }
                else {
                    gettransfers();
                    datatransfer();
                    toastr.success(res.message);
                }
            });
        } else {
            var response = TransferService.updatetransfer($scope.edittransfer);
            response.then(function (res) {
                if (!res.isSuccess) { toastr.error(res.message); }
                else {
                    gettransfers();
                    datatransfer();
                    $scope.sumTotal = 0;
                    toastr.success(res.message);
                }
            });
        }
        $("#modaledittransfer").modal("hide");
        datatransfer();
    };

    $scope.deletetransfer = function () {
        var response = TransferService.invalidatetransfer($scope.edittransfer);
        response.then(function (res) {
            if (!res.isSuccess) { toastr.error(res.message); }
            else {
                $("#modaldeletetransfer").modal("hide");
                datatransfer();
                gettransfers();
                toastr.success(res.message);
            }
        });
    };

    $scope.selectedtransfer = function (transfer, option) {
        $scope.transferselected = transfer;
        $scope.edittransfer = angular.copy($scope.transferselected);
        $scope.edittransfer.state = 2;
        $scope.selectedtype = transfer.type;
        $scope.selectedtypeprice = transfer.typeprice;

        if ($scope.listwarehouse) {
            for (var i = 0; i < $scope.listwarehouse.length; i++) {
                if ($scope.listwarehouse[i].id == $scope.edittransfer.idwarehouse) {
                    $scope.selectedwarehouse = $scope.listwarehouse[i];
                }
            }
        }

        if ($scope.transfers) {
            for (var i = 0; i < $scope.transfers.length; i++) {
                if ($scope.transfers[i].id == $scope.edittransfer.id) {
                    $scope.transferdetails = $scope.transfers[i].Transferdetails;
                }

                if ($scope.transferdetails) {
                    for (var j = 0; j < $scope.transferdetails.length; j++) {
                        $scope.transferdetails[j].name = $scope.transferdetails[j].Item.name;
                    }
                }
            }
        }
    };

    $scope.validatecontrols = function () {
        return $scope.edittransfer == null || $scope.edittransfer.dateregister == null
            || $scope.selectedwarehouseinput == null || $scope.selectedwarehouseoutput == null
            || $scope.selectedtypeprice == null || $scope.edittransfer.code == null
            || ($scope.transferdetails != null && $scope.transferdetails.length < 1);
    };

    $scope.validatecontrolsdetail = function () {
        return $scope.editdetail == null || $scope.quantity == null
            || $scope.selecteditem == null || $scope.price == null || $scope.cost == null;
    };

    $scope.newtransfer = function () {
        datatransfer();
    };

    $scope.newtransferdetail = function () {
        $scope.editdetail = {};

        var n = $scope.transferdetails.where(function (item) {
            return item.iditem == $scope.selecteditem.id && item.state == 1;
        });

        if (n.length == 0) {
            $scope.editdetail.iditem = $scope.selecteditem.id;
            $scope.editdetail.name = $scope.selecteditem.name;
            $scope.editdetail.state = 1;
            $scope.editdetail.price = $scope.price;
            $scope.editdetail.cost = $scope.cost;
            $scope.editdetail.quantity = $scope.quantity;
            $scope.transferdetails.push($scope.editdetail);
        }
        getTotal();
    }

    function getTotal() {
        $scope.sumTotal = $scope.transferdetails.where(function (row) { return row.state == 1; }).sum(function (item) {
            return parseInt(item.price * item.quantity);
        });
    }

    $scope.deletetransferdetail = function (item) {
        item.state = 0;
        getTotal();
    };

    $scope.selecteditemchange = function () {
        if ($scope.selectedtypeprice == 0 && $scope.selecteditem != null) {
            $scope.price = $scope.selecteditem.unitprice;
        }
        if ($scope.selectedtypeprice == 1 && $scope.selecteditem != null) {
            $scope.price = $scope.selecteditem.wholesaleprice;
        }
        if ($scope.selecteditem != null) {
            $scope.cost = $scope.selecteditem.cost;
        }
    }
});