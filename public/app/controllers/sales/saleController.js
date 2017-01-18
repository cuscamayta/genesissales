app.controller('SaleController', function ($scope, SaleService, OfficeService, ItemService) {
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
            $scope.detailsale.state = 1;
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
        return $scope.saledetails == null || $scope.headersale == null
            || $scope.headersale.dateregister || $scope.headersale.numbernitinvoice || $scope.headersale.nameinvoice
            || ($scope.saledetails != null && $scope.saledetails.length < 1);
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
                    $scope.datainvoice.date = res.data.invoice.Sales.first().Schedule.dateregister;
                    $scope.datainvoice.arrival = res.data.invoice.Sales.first().Schedule.arrival;
                    $scope.datainvoice.departure = res.data.invoice.Sales.first().Schedule.departure;
                    $scope.detailinvoice = res.data.invoice.Sales.first().Tickets;
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