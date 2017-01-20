app.service('UserwarehouseService', function ($http, $q) {

    init();

    function init() {
    }

    this.saveuserwarehouse = function (userwarehouse) {
        var defer = $q.defer();
        $http.post('/userwarehouses/create', userwarehouse).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.getuserwarehouses = function () {
        var defer = $q.defer();
        $http.get('/userwarehouses?' + new Date().getMilliseconds).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };

    this.deleteuserwarehouse = function (userwarehouse) {
        var defer = $q.defer();
        $http.post('/userwarehouses/destroy', userwarehouse).success(function (response) {
            defer.resolve(response);
        });
        return defer.promise;
    };
});