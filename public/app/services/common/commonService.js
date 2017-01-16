app.service('CommonService', function ($http, $q) {

    init();

    function init() {
    }

    function makes() {
        var make = {
            Samsung: "Samsung", Apple: "Apple", Toshiba: "Toshiba",
            HP: "HP", DELL: "DELL"
        };
        return make;
    }

    this.makesarray = function () {
        var makesArray = $.map(makes(), function (value, key) {
            return { value: value, data: key };
        });
        return makesArray;
    };

    function colors() {
        var color = {
            Blanco: "Blanco", Negro: "Negro", Azul: "Azul", Amarillo: "Amarillo", Verde: "Verde",
            Rojo: "Rojo", Gris: "Gris", Plateado: "Plateado", Celeste: "Celeste", Lila: "Lila"
        };
        return color;
    }

    this.colorsarray = function () {
        var colorsArray = $.map(colors(), function (value, key) {
            return { value: value, data: key };
        });
        return colorsArray;
    };

    function cities() {
        var color = {
            SantaCruz: "Santa Cruz", LaPaz: "La Paz", Beni: "Beni", Cochabamba: "Cochabamba",
            Tarija: "Tarija", Oruro: "Oruro", Potosi: "Potosi", Pando: "Pando", Chuquisaca: "Chuquisaca"
        };
        return color;
    }

    this.cityarray = function () {
        var cityarray = $.map(cities(), function (value, key) {
            return { value: value, data: key };
        });
        return cityarray;
    };

    function typeitem() {
        var color = {
            Celular: "Celular", Electrodomestico: "Electrodomestico", Repuesto: "Repuesto",
            Portatil: "Portatil", Computadora: "Computadora"
        };
        return color;
    }

    this.typeitemarray = function () {
        var typeitemarray = $.map(typeitem(), function (value, key) {
            return { value: value, data: key };
        });
        return typeitemarray;
    };
});