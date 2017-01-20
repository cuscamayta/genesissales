app.controller('UserwarehouseController', function ($scope, UserwarehouseService, UserService, WarehouseService) {
    init();
    function init() {
        getusers();
        getwarehouses();
        getuserwarehouses();
        datauserwarehouse();
    }

    function datauserwarehouse() {
        $scope.edituserwarehouse = {
            id: 0,
            state: 1
        };
        $scope.selecteduser = null;
    };

    function getuserwarehouses() {
        var response = UserwarehouseService.getuserwarehouses();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else { $scope.userwarehouses = res.data; }
        });
    }

    function getusers() {
        var response = UserService.getusers();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $scope.listuser = res.data;
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

    $scope.saveuserwarehouse = function () {
        $scope.edituserwarehouse;

        var n = $scope.userwarehouses.where(function (item) {
            return item.iduser == $scope.selecteduser.id && item.idwarehouse == $scope.selectedwarehouse.id;
        });

        if (n.length == 0) {
            $scope.edituserwarehouse.iduser = $scope.selecteduser.id;
            $scope.edituserwarehouse.idwarehouse = $scope.selectedwarehouse.id;
            if ($scope.edituserwarehouse.id == 0) {
                var response = UserwarehouseService.saveuserwarehouse($scope.edituserwarehouse);
                response.then(function (res) {
                    if (!res.isSuccess) { toastr.error(res.message); }
                    else {
                        getuserwarehouses();
                        datauserwarehouse();
                        toastr.success(res.message);
                    }
                });
            }
            datauserwarehouse();
        }
        else {
            toastr.warning("Almacen ya fue asignada al usuario");
        }
    };

    $scope.deleteuserwarehouse = function () {
        var response = UserwarehouseService.deleteuserwarehouse($scope.edituserwarehouse);
        response.then(function (res) {
            if (!res.isSuccess) { toastr.error(res.message); }
            else {
                $("#modaldeleteuserwarehouse").modal("hide");
                datauserwarehouse();
                getuserwarehouses();
                toastr.success(res.message);
            }
        });
    };

    $scope.selecteduserwarehouse = function (userwarehouse, option) {
        $scope.userwarehouseselected = userwarehouse;
        $scope.edituserwarehouse = angular.copy($scope.userwarehouseselected);
        $scope.edituserwarehouse.state = 2;
    };

    $scope.validatecontrols = function () {
        return $scope.edituserwarehouse == null
            || $scope.selecteduser == null || $scope.selectedwarehouse == null;
    };

    $scope.newuserwarehouse = function () {
        datauserwarehouse();
    };
});