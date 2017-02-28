app.controller('ItemController', function ($scope, ItemService, CommonService) {
    init();
    function init() {
        getitems();
        dataitem();

        $('#make').autocomplete({
            lookup: CommonService.makesarray(),
            onSelect: function (item) {
                $scope.edititem.make = item.value;
            }
        });

        $('#type').autocomplete({
            lookup: CommonService.typeitemarray(),
            onSelect: function (item) {
                $scope.edititem.type = item.value;
            }
        });
    }

    function dataitem() {
        $scope.edititem = {
            id: 0,
            state: 1
        };
        $scope.selecteditemtype = null;
    };

    function getitems() {
        var response = ItemService.getitems();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else { $scope.items = res.data; }
        });
    }

    $scope.saveitem = function () {
        if ($scope.edititem.id == 0) {
            var response = ItemService.saveitem($scope.edititem);
            response.then(function (res) {
                if (!res.isSuccess) {
                    toastr.error(res.message);
                }
                else {
                    getitems();
                    dataitem();
                    toastr.success(res.message);
                }
            });
        } else {
            var response = ItemService.updateitem($scope.edititem);
            response.then(function (res) {
                if (!res.isSuccess) {
                    toastr.error(res.message);
                }
                else {
                    getitems();
                    dataitem();
                    toastr.success(res.message);
                }
            });
        }
    };

    $scope.deleteitem = function () {
        var response = ItemService.deleteitem($scope.edititem);
        response.then(function (res) {
            if (!res.isSuccess) { toastr.error(res.message); }
            else {
                $("#modaldeleteitem").modal("hide");
                dataitem();
                getitems();
                toastr.success(res.message);
            }
        })
    };

    $scope.selecteditem = function (item, option) {
        $scope.itemselected = item;
        $scope.edititem = angular.copy($scope.itemselected);
        $scope.edititem.state = 2;
        $("#make").val($scope.edititem.make);

        if ($scope.listitemtype) {
            for (var i = 0; i < $scope.listitemtype.length; i++) {
                if ($scope.listitemtype[i].id == $scope.edititem.iditemtype) {
                    $scope.selecteditemtype = $scope.listitemtype[i];
                }
            }
        }
    };

    $scope.validatecontrols = function () {
        return $scope.edititem == null || $scope.edititem.name == null
            || $scope.edititem.make == null || $scope.edititem.model == null
            || $scope.edititem.unitprice == null || $scope.edititem.wholesaleprice == null
            || $scope.edititem.cost == null || $scope.edititem.serialnumber == null
            || $scope.edititem.barcode == null || $scope.edititem.type == null
            || $scope.edititem.minstock == null;
    };

    $scope.newitem = function () {
        dataitem();
    };
});