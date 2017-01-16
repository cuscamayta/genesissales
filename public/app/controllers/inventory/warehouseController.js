app.controller('WarehouseController', function ($scope, WarehouseService, CommonService) {
    init();
    function init() {
        getwarehouses();
        datawarehouse();

        $('#city').autocomplete({
            lookup: CommonService.cityarray(),
            onSelect: function (item) {
                $scope.editwarehouse.city = item.value;
            }
        });
    }

    function datawarehouse() {
        $scope.editwarehouse = {
            id: 0,
            state: 1
        };
    };

    function getwarehouses() {
        var response = WarehouseService.getwarehouses();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else { $scope.warehouses = res.data; }
        });
    }

    $scope.savewarehouse = function () {
        $scope.editwarehouse;
        if ($scope.editwarehouse.id == 0) {
            var response = WarehouseService.savewarehouse($scope.editwarehouse);
            response.then(function (res) {
                if (!res.isSuccess) {
                    toastr.error(res.message);
                }
                else {
                    getwarehouses();
                    datawarehouse();
                    toastr.success(res.message);
                }
            });
        } else {
            var response = WarehouseService.updatewarehouse($scope.editwarehouse);
            response.then(function (res) {
                if (!res.isSuccess) {
                    toastr.error(res.message);
                }
                else {
                    getwarehouses();
                    datawarehouse();
                    toastr.success(res.message);
                }
            });
        }
    };

    $scope.deletewarehouse = function () {
        var response = WarehouseService.deletewarehouse($scope.editwarehouse);
        response.then(function (res) {
            if (!res.isSuccess) { toastr.error(res.message); }
            else {
                $("#modaldeletewarehouse").modal("hide");
                datawarehouse();
                getwarehouses();
                toastr.success(res.message);
            }
        })
    };

    $scope.selectedwarehouse = function (warehouse, option) {
        $scope.warehouseselected = warehouse;
        $scope.editwarehouse = angular.copy($scope.warehouseselected);
        $scope.editwarehouse.state = 2;
    };

    $scope.validatecontrols = function () {
        return $scope.editwarehouse == null || $scope.editwarehouse.address == null
            || $scope.editwarehouse.title == null || $scope.editwarehouse.city == null;
    };

    $scope.newwarehouse = function () {
        datawarehouse();
    };
});