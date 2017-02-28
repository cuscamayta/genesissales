app.service('CashboxService', function ($http, $q) {

    init();

    function init() {
    }

    this.savecashbox = function (cashbox) {
        var defer = $q.defer();
        $http.post('/cashboxes/create', cashbox).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.updatecashbox = function (cashbox) {
        var defer = $q.defer();
        $http.post('/cashboxes/update', cashbox).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getcashboxes = function () {
        var defer = $q.defer();
        $http.get('/cashboxes?' + new Date().getMilliseconds).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getcashboxesforselect = function () {
        var defer = $q.defer();
        $http.get('/cashboxes/forselect').success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.deletecashbox = function (cashbox) {
        var defer = $q.defer();
        $http.post('/cashboxes/destroy', cashbox).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
});