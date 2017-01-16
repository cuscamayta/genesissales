app.controller('ItemController', function ($scope, ItemService, ItemtypeService, CommonService) {
    init();
    function init() {
        getitemtypes();
        getitemes();
        dataitem();

        $('#make').autocomplete({
            lookup: CommonService.makesarray(),
            onSelect: function (item) {
                $scope.edititem.make = item.value;
            }
        });

        $('#color').autocomplete({
            lookup: CommonService.colorsarray(),
            onSelect: function (item) {
                $scope.edititem.color = item.value;
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

    function getitemes() {
        var response = ItemService.getitemes();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else { $scope.itemes = res.data; }
        });
    }

    function getitemtypes() {
        var response = ItemtypeService.getitemtypes();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else { $scope.listitemtype = res.data; }
        });
    }

    $scope.saveitem = function () {
        $scope.edititem;
        $scope.edititem.iditemtype = $scope.selecteditemtype.id;

        if ($scope.edititem.id == 0) {
            var response = ItemService.saveitem($scope.edititem);
            response.then(function (res) {
                if (!res.isSuccess) {
                    toastr.error(res.message);
                }
                else {
                    getitemes();
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
                    getitemes();
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
                getitemes();
                toastr.success(res.message);
            }
        })
    };

    $scope.selecteditem = function (item, option) {
        $scope.itemeselected = item;
        $scope.edititem = angular.copy($scope.itemeselected);
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
        return $scope.edititem == null || $scope.edititem.numberid == null
            || ($scope.edititem.numberid != null && $scope.edititem.numberid.length < 4)
            || $scope.edititem.numberseats == null || $scope.edititem.numberrows == null
            || $scope.edititem.numberfloors == null || $scope.edititem.numberfloors == null
            || $scope.edititem.model == null || $scope.selecteditemtype == null
            || $scope.edititem.make == null || $scope.edititem.color == null;
    };

    $scope.newitem = function () {
        dataitem();
    };
});