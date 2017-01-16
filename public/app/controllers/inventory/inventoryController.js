app.controller('InventoryController', function ($scope, InventoryService, WarehouseService, ItemService, $rootScope) {
    init();
    function init() {
        getwarehouses();
        getitems();
        getinventories();
        datainventory();

        $scope.editinventory.dateregister = moment().format('DD/MM/YYYY');
        $('#dateregister').daterangepicker({
            locale: { format: 'DD/MM/YYYY' },
            singleDatePicker: true,
            showDropdowns: true,
            calender_style: "picker_4"
        }).on('apply.daterangepicker', function (ev, picker) {
            $scope.editinventory.dateregister = picker.startDate.format('DD/MM/YYYY');
        });
    }

    function datainventory() {
        $scope.editinventory = {
            id: 0,
            state: 1,
            details: []
        };
        $scope.selectedwarehouse = null;
        $scope.selecteditem = null;
        $scope.inventorydetails = [];

        $scope.editdetail = {
            state: "0"
        }
    };

    function getinventories() {
        var response = InventoryService.getinventories();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $scope.inventories = res.data;
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

    $scope.saveinventory = function () {
        $scope.editinventory;
        $scope.editinventory.idoffice = $rootScope.idoffice;
        $scope.editinventory.iduser = $rootScope.currentUser.user.id;
        $scope.editinventory.type = $scope.selectedtype;
        $scope.editinventory.typeprice = $scope.selectedtypeprice;
        $scope.editinventory.idwarehouse = $scope.selectedwarehouse.id;
        $scope.editinventory.total = $scope.sumTotal;
        $scope.editinventory.details = $scope.inventorydetails;
        if ($scope.editinventory.id == 0) {
            var response = InventoryService.saveinventory($scope.editinventory);
            response.then(function (res) {
                if (!res.isSuccess) { toastr.error(res.message); }
                else {
                    getinventories();
                    datainventory();
                    toastr.success(res.message);
                }
            });
        } else {
            var response = InventoryService.updateinventory($scope.editinventory);
            response.then(function (res) {
                if (!res.isSuccess) { toastr.error(res.message); }
                else {
                    getinventories();
                    datainventory();
                    $scope.sumTotal = 0;
                    toastr.success(res.message);
                }
            });
        }
        $("#modaleditinventory").modal("hide");
        datainventory();
    };

    $scope.deleteinventory = function () {
        var response = InventoryService.deleteinventory($scope.editinventory);
        response.then(function (res) {
            if (!res.isSuccess) { toastr.error(res.message); }
            else {
                $("#modaldeleteinventory").modal("hide");
                datainventory();
                getinventories();
                toastr.success(res.message);
            }
        });
    };

    $scope.selectedinventory = function (inventory, option) {
        $scope.inventorieselected = inventory;
        $scope.editinventory = angular.copy($scope.inventorieselected);
        $scope.editinventory.state = 2;
        $scope.selectedtype = inventory.type;
        $scope.selectedtypeprice = inventory.typeprice;

        if ($scope.listwarehouse) {
            for (var i = 0; i < $scope.listwarehouse.length; i++) {
                if ($scope.listwarehouse[i].id == $scope.editinventory.idwarehouse) {
                    $scope.selectedwarehouse = $scope.listwarehouse[i];
                }
            }
        }

        if ($scope.inventories) {
            for (var i = 0; i < $scope.inventories.length; i++) {
                if ($scope.inventories[i].id == $scope.editinventory.id) {
                    $scope.inventorydetails = $scope.inventories[i].Inventorydetails;
                }

                if ($scope.inventorydetails) {
                    for (var j = 0; j < $scope.inventorydetails.length; j++) {
                        $scope.inventorydetails[j].name = $scope.inventorydetails[j].Item.name;
                    }
                }
            }
            getTotal();
        }
    };

    function getTotal() {
        $scope.sumTotal = $scope.inventorydetails.where(function (row) { return row.state == 1; }).sum(function (item) {
            return parseInt(item.price * item.quantity);
        });
    }

    $scope.validatecontrols = function () {
        return $scope.editinventory == null || $scope.editinventory.dateregister == null
            || $scope.selectedwarehouse == null || $scope.selectedtype == null
            || $scope.selectedtypeprice == null || $scope.editinventory.code == null
            || ($scope.inventorydetails != null && $scope.inventorydetails.length < 1);
    };

    $scope.validatecontrolsdetail = function () {
        return $scope.editdetail == null || $scope.quantity == null
            || $scope.selecteditem == null || $scope.price == null || $scope.cost == null;
    };

    $scope.newinventory = function () {
        datainventory();
    };

    $scope.newinventorydetail = function () {
        $scope.editdetail = {};

        var n = $scope.inventorydetails.where(function (item) {
            return item.iditem == $scope.selecteditem.id;
        });

        if (n.length == 0) {
            $scope.editdetail.iditem = $scope.selecteditem.id;
            $scope.editdetail.name = $scope.selecteditem.name;
            $scope.editdetail.state = 1;
            $scope.editdetail.price = $scope.price;
            $scope.editdetail.cost = $scope.cost;
            $scope.editdetail.quantity = $scope.quantity;
            $scope.inventorydetails.push($scope.editdetail);
        }
        getTotal();
    }

    $scope.deleteinventorydetail = function (item) {
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