app.controller('CashboxController', function ($scope, CashboxService, $rootScope) {
    init();
    function init() {
        getcashiers();
        getcashboxes();
        datacashbox();
    }

    function datacashbox() {
        $scope.editcashbox = {
            id: 0,
            state: 1
        };
        $scope.selectedcashier = null;
    };

    function getcashboxes() {
        var response = CashboxService.getcashboxes();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else { $scope.cashboxes = res.data; }
        });
    }

    function getcashiers() {
        $scope.listcashier = [];
        var obj = {};
        obj.id = "Cajero responsable";
        obj.title = "Cajero responsable";
        $scope.listcashier.push(obj);
    }

    $scope.savecashbox = function () {
        $scope.editcashbox;
        $scope.editcashbox.iduser = $rootScope.currentUser.user.id;
        $scope.editcashbox.idoffice = $rootScope.idoffice;
        $scope.editcashbox.cashier = $scope.selectedcashier.id;
        if ($scope.editcashbox.id == 0) {
            var response = CashboxService.savecashbox($scope.editcashbox);
            response.then(function (res) {
                if (!res.isSuccess) {
                    toastr.error(res.message);
                }
                else {
                    getcashboxes();
                    datacashbox();
                    toastr.success(res.message);
                }
            });
        } else {
            var response = CashboxService.updatecashbox($scope.editcashbox);
            response.then(function (res) {
                if (!res.isSuccess) {
                    toastr.error(res.message);
                }
                else {
                    getcashboxes();
                    datacashbox();
                    toastr.success(res.message);
                }
            });
        }
    };

    $scope.deletecashbox = function () {
        var response = CashboxService.deletecashbox($scope.editcashbox);
        response.then(function (res) {
            if (!res.isSuccess) { toastr.error(res.message); }
            else {
                $("#modaldeletecashbox").modal("hide");
                datacashbox();
                getcashboxes();
                toastr.success(res.message);
            }
        })
    };

    $scope.selectedcashbox = function (cashbox, option) {
        $scope.cashboxeselected = cashbox;
        $scope.editcashbox = angular.copy($scope.cashboxeselected);
        $scope.editcashbox.state = 2;

        if ($scope.listcashier) {
            for (var i = 0; i < $scope.listcashier.length; i++) {
                if ($scope.listcashier[i].id == $scope.editcashbox.cashier) {
                    $scope.selectedcashier = $scope.listcashier[i];
                }
            }
        }
    };

    $scope.validatecontrols = function () {
        return $scope.editcashbox == null || $scope.editcashbox.title == null
            || $scope.editcashbox.account == null || $scope.selectedcashier == null;
    };

    $scope.newcashbox = function () {
        datacashbox();
    };
});