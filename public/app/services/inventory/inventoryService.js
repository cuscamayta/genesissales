app.service('InventoryService', function ($http, $q) {

    init();

    function init() {
    }

    this.saveinventory = function (inventory) {
        var defer = $q.defer();
        $http.post('/inventorytransactions/create', inventory).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.updateinventory = function (inventory) {
        var defer = $q.defer();
        $http.post('/inventorytransactions/update', inventory).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getinventories = function () {
        var defer = $q.defer();
        $http.get('/inventorytransactions?' + new Date().getMilliseconds).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.deleteinventory = function (inventory) {
        var defer = $q.defer();
        $http.post('/inventorytransactions/destroy', inventory).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
});