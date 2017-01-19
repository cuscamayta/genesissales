var app = angular.module('genesisApp', ['uitls.paginate', 'ngStorage']);

app.run(function ($localStorage, $rootScope, $location, $timeout) {
    if ($localStorage.currentUser) {
        $rootScope.currentUser = $localStorage.currentUser;
        $rootScope.listMenuPermit = getModulesAndPages($rootScope.currentUser.permits);
        $rootScope.nameoffice = $localStorage.currentUser.nameOffice;
        $rootScope.idoffice = $localStorage.currentUser.idOffice;
        $rootScope.idwarehouse = 1;
        $rootScope.fullnameuser = $localStorage.currentUser.user.firstname + " " + $localStorage.currentUser.user.lastname;
        $rootScope.roleuser = $localStorage.currentUser.user.Role.title;
        $timeout($enableSideBar, 500);
    }
    else
        $location.path('/login');
});

app.config(function ($routeProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'app/partials/home/home.html'
        })
        .when('/setting', {
            controller: 'SettingController',
            templateUrl: 'app/partials/security/setting.html'
        })
        .when('/user', {
            controller: 'UserController',
            templateUrl: 'app/partials/security/user.html'
        })
        .when('/role', {
            controller: 'RoleController',
            templateUrl: 'app/partials/security/role.html'
        })
        .when('/page', {
            controller: 'PageController',
            templateUrl: 'app/partials/security/page.html'
        })
        .when('/module', {
            controller: 'ModuleController',
            templateUrl: 'app/partials/security/module.html'
        })
        .when('/permit', {
            controller: 'PermitController',
            templateUrl: 'app/partials/security/permit.html'
        })
        .when('/useroffice', {
            controller: 'UserofficeController',
            templateUrl: 'app/partials/security/useroffice.html'
        })
        .when('/warehouse', {
            controller: 'WarehouseController',
            templateUrl: 'app/partials/inventory/warehouse.html'
        })
        .when('/item', {
            controller: 'ItemController',
            templateUrl: 'app/partials/inventory/item.html'
        })
        .when('/inventory', {
            controller: 'InventoryController',
            templateUrl: 'app/partials/inventory/inventory.html'
        })
        .when('/transfer', {
            controller: 'TransferController',
            templateUrl: 'app/partials/inventory/transfer.html'
        })
        .when('/office', {
            controller: 'OfficeController',
            templateUrl: 'app/partials/course/office.html'
        })
        .when('/orderbook', {
            controller: 'OrderbookController',
            templateUrl: 'app/partials/sales/orderbook.html'
        })
        .when('/sale', {
            controller: 'SaleController',
            templateUrl: 'app/partials/sales/sale.html'
        })
        .when('/invoice', {
            controller: 'InvoiceController',
            templateUrl: 'app/partials/sales/invoice.html'
        })
        .when('/invalidate', {
            controller: 'InvalidateController',
            templateUrl: 'app/partials/sales/invalidate.html'
        })
        .when('/dailycash', {
            controller: 'DailycashController',
            templateUrl: 'app/partials/report/dailycash.html'
        })
        .when('/dailysale', {
            controller: 'DailysaleController',
            templateUrl: 'app/partials/report/dailysale.html'
        })
        .when('/voidedinvoice', {
            controller: 'VoidedinvoiceController',
            templateUrl: 'app/partials/report/voidedinvoice.html'
        })
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'app/partials/home/login.html'
        })
        .when('/password', {
            controller: 'LoginController',
            templateUrl: 'app/partials/home/password.html'
        })
        .when('/route/:id', {
            controller: 'HomeController',
            templateUrl: '/routepartial'
        })

        .otherwise({
            redirectTo: '/'
        });

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
        return {
            'request': function (config) {
                $(".loader").show();
                config.headers = config.headers || {};
                if ($localStorage.currentUser) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.currentUser.user.token;
                }
                return config;
            },
            'response': function (response) {

                $(".loader").hide();
                return response || $q.when(response);

            },
            'responseError': function (response) {
                $(".loader").hide();
                if (response.status === 401 || response.status === 403) {
                    $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    }]);
});

function getModulesAndPages(permits) {
    if (permits && permits.length > 0) {
        var listpages = permits.select(function (item) {
            item.Page.moduleName = item.Page.Module.title;
            return item.Page;
        });

        var resultPages = listpages.groupBy(function (page) {
            return page.moduleName;
        })
        var listMenuPermit = resultPages.select(function (item) {
            return {
                moduleName: item.key,
                moduleClass: item.first().Module.class,
                pages: item.select(function (page) {
                    return {
                        path: page.path,
                        title: page.title
                    };
                })
            }
        });
        return listMenuPermit;
    } else {
        return listMenuPermit = {};
    }
}