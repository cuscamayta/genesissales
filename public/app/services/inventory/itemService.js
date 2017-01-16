app.service('ItemService', function ($http, $q) {

    init();

    function init() {
    }

    this.saveitem = function (item) {
        var defer = $q.defer();
        $http.post('/items/create', item).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.updateitem = function (item) {
        var defer = $q.defer();
        $http.post('/items/update', item).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getitems = function () {
        var defer = $q.defer();
        $http.get('/items?' + new Date().getMilliseconds).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.deleteitem = function (item) {
        var defer = $q.defer();
        $http.post('/items/destroy', item).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
});