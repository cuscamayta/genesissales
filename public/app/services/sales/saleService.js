app.service('SaleService', function ($http, $q) {

    init();

    function init() {
    }

    this.getsales = function () {
        var defer = $q.defer();
        $http.post('/sales').success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getdailycash = function (filters) {
        var defer = $q.defer();
        $http.post('/sales/dailycash', filters).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getdailybus = function (filters) {
        var defer = $q.defer();
        $http.post('/sales/dailybus', filters).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getcountuser = function () {
        var defer = $q.defer();
        $http.post('/sales/countuser').success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getcountpassenger = function () {
        var defer = $q.defer();
        $http.post('/sales/countpassenger').success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getcountpassengercurrent = function (filters) {
        var defer = $q.defer();
        $http.post('/sales/countpassengercuerrent', filters).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.savesale = function (orderbook) {
        var defer = $q.defer();
        $http.post('/sales/create', orderbook).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.invalidatesale = function (sale) {
        var defer = $q.defer();
        $http.post('/sales/invalidate', sale).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getinvoice = function (filters) {
        var defer = $q.defer();
        $http.post('/sales/invoice', filters).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
});