app.service('WarehouseService', function ($http, $q) {

    init();

    function init() {
    }

    this.savewarehouse = function (warehouse) {
        var defer = $q.defer();
        $http.post('/warehouses/create', warehouse).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.updatewarehouse = function (warehouse) {
        var defer = $q.defer();
        $http.post('/warehouses/update', warehouse).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getwarehouses = function () {
        var defer = $q.defer();
        $http.get('/warehouses?' + new Date().getMilliseconds).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.deletewarehouse = function (warehouse) {
        var defer = $q.defer();
        $http.post('/warehouses/destroy', warehouse).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
});