app.controller('HomeController', function ($scope, $location, $rootScope, $timeout, $localStorage) {

    init();

    function init() {

    }


    function getcountpassenger() {
        var response = SaleService.getcountpassenger();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $scope.countpassenger = res.data;
            }
        });
    }

    function getcountpassengercurrent() {
        $scope.filters = {};
        $scope.filters.currentdate = moment();
        var response = SaleService.getcountpassengercurrent($scope.filters);
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $scope.countpassengercurrent = res.data;
            }
        });
    }

    function getcountuser() {
        var response = SaleService.getcountuser();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $scope.countuser = res.data;
            }
        });
    }

    $rootScope.logout = function (e) {
        e.preventDefault();
        $timeout($enableSideBar, 500);
        $rootScope.currentUser = null;
        $localStorage.currentUser = null;
        $location.path('/login');
    };    
});