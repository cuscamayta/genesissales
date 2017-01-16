app.service('TransferService', function ($http, $q) {

    init();

    function init() {
    }

    this.savetransfer = function (transfer) {
        var defer = $q.defer();
        $http.post('/transfers/create', transfer).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.gettransfers = function () {
        var defer = $q.defer();
        $http.get('/transfers?' + new Date().getMilliseconds).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.invalidatetransfer = function (transfer) {
        var defer = $q.defer();
        $http.post('/transfers/invalidate', transfer).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
});