app.controller('SaleController', function ($scope, SaleService, OfficeService, ItemService, $rootScope) {
    init();
    function init() {
        getitems();
        datasale();

        $scope.headersale.dateregister = moment().format('DD/MM/YYYY');

        $('#dateregister').daterangepicker({
            locale: { format: 'DD/MM/YYYY' },
            singleDatePicker: true,
            showDropdowns: false,
            calender_style: "picker_4",
        }).on('apply.daterangepicker', function (ev, picker) {
            $scope.headersale.dateregister = picker.startDate.format('DD/MM/YYYY');
        });

        $("#invoice-file").hide();
    }

    function datasale() {
        $scope.headersale = {
            id: 0,
            state: 1,
            details: []
        };

        $scope.listsale = [];
        defaultvalue();
    };

    function defaultvalue() {
        $scope.quantityadd = 1;
        $scope.headersale.numbernitinvoice = 0;
        $scope.headersale.nameinvoice = "SIN NOMBRE";
        $scope.sumTotal = 0;
    };

    function getitems() {
        var response = ItemService.getitems();
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $scope.listitem = res.data;
            }
        });
    }

    $scope.savesale = function () {
        $scope.headersale.details = $scope.listsale;
        $scope.headersale.iduser = $rootScope.currentUser.user.id;

        $scope.headersale.idwarehouse = $rootScope.idwarehouse
        $scope.headersale.idoffice = $rootScope.idoffice;
        $scope.headersale.amountinvoice = $scope.sumTotal;

        //TODO
        //flag=0 sin factura            flag=1 con factura
        //type=0 venta al contado       type=1 venta al credito
        //typeprice=0 precio unitario   typeprice=1 mayorista
        $scope.headersale.flag = 0;
        $scope.headersale.type = 0;
        $scope.headersale.typeprice = 0;

        if ($scope.headersale.id == 0) {
            var response = SaleService.savesale($scope.headersale);
            response.then(function (res) {
                debugger;
                if (!res.isSuccess) { toastr.error(res.message); }
                else {
                    toastr.success(res.message);
                    defaultvalue();
                    generateprintinvoice(res.data);
                    $scope.listsale = [];
                }
            });
        }
        $("#modaleditticket").modal("hide");
    };

    $scope.selecteditem = function (item) {
        $scope.detailsale = {};

        var n = $scope.listsale.where(function (row) {
            return row.iditem == item.id;
        });

        if (n.length == 0) {
            $scope.detailsale.price = item.unitprice;
            $scope.detailsale.quantity = $scope.quantityadd;
            $scope.detailsale.name = item.name;
            $scope.detailsale.iditem = item.id;
            $scope.detailsale.cost = item.cost;
            $scope.detailsale.state = 1;
            $scope.detailsale.discount = 0;
            $scope.listsale.push($scope.detailsale);
        }
        getTotal();
    }

    function getTotal() {
        $scope.sumTotal = $scope.listsale.where(function (row) { return row.state == 1; }).sum(function (item) {
            return parseInt(item.price * item.quantity);
        });
    }

    $scope.validatecontrols = function () {
        return $scope.headersale == null || $scope.headersale.dateregister == null
            || $scope.headersale.numbernitinvoice == null || $scope.headersale.nameinvoice == null
            || ($scope.listsale != null && $scope.listsale.length < 1);
    };

    $scope.deletesaledetail = function (item) {
        $scope.listsale.remove(item);
        getTotal();
    };

    function generateprintinvoice(nroinvoiceprint) {
        $scope.filters = {};
        $scope.filters.idoffice = $rootScope.idoffice;
        $scope.filters.numberinvoice = nroinvoiceprint;

        var response = SaleService.getinvoice($scope.filters);
        response.then(function (res) {
            if (!res.isSuccess) {
                toastr.error(res.message);
            }
            else {
                $scope.datainvoice = {};

                if (res.data.invoice) {
                    $scope.datainvoice.titleCompany = res.data.setting.title;
                    $scope.datainvoice.numberidCompany = res.data.setting.numberid;
                    $scope.datainvoice.noteCompany = res.data.setting.note;
                    $scope.datainvoice.titleOffice = res.data.invoice.Office.title;
                    $scope.datainvoice.phoneOffice = res.data.invoice.Office.phone;
                    $scope.datainvoice.addressOffice = res.data.invoice.Office.address;
                    $scope.datainvoice.detailOffice = res.data.invoice.Office.detail;
                    $scope.datainvoice.numberInvoice = res.data.invoice.numberinvoice;
                    $scope.datainvoice.numberorderInvoice = res.data.invoice.numberorder;
                    $scope.datainvoice.dateInvoice = res.data.invoice.dateregister;
                    $scope.datainvoice.nameInvoice = res.data.invoice.fullname;
                    $scope.datainvoice.numbernitInvoice = res.data.invoice.numberid;
                    $scope.datainvoice.codecontrolInvoice = res.data.invoice.numbercontrol;
                    $scope.datainvoice.totalInvoice = res.data.invoice.amountinvoice;
                    $scope.datainvoice.deadlineOrder = res.data.orderbook.deadline;
                    $scope.datainvoice.total = res.data.invoice.Sales.first().total;
                    $scope.datainvoice.deadline = res.data.orderbook.deadline;
                    $scope.detailinvoice = res.data.invoice.Sales.first().Salesdetails;
                    var totalformat = parseFloat(Math.round(res.data.invoice.Sales.first().total * 100) / 100).toFixed(2);
                    $scope.datainvoice.totalliteral = Convertir(totalformat);

                    printcodeqr("qrinvoice", $scope.datainvoice.numberidCompany, $scope.datainvoice.titleCompany,
                        $scope.datainvoice.numberInvoice, $scope.datainvoice.numberorderInvoice, $scope.datainvoice.date,
                        $scope.datainvoice.totalInvoice, $scope.datainvoice.codecontrolInvoice, $scope.datainvoice.deadlineOrder);
                    if (isIE())
                        Print();
                    else
                        setTimeout(function () {
                            window.print();
                        }, 100);
                }
            }
        });
    };

    function isIE() {
        if (navigator.appName == 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/)) || (typeof $.browser !== "undefined" && $.browser.msie == 1)) {
            return true;
        }
        return false;
    }

    function printcodeqr(element, numberid, businessname, numberinvoice,
        numberorder, dateinvoice, amountinvoice, codecontrol, datelimit) {
        $('#qrinvoice').qrcode({
            width: 100,
            height: 100,
            text: numberid + " | " +
            businessname + " | " +
            numberinvoice + " | " +
            numberorder + " | " +
            dateinvoice + " | " +
            amountinvoice + "Bs | " +
            codecontrol + " | " +
            datelimit
        });
    }

});