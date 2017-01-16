'use strict';

module.exports = function (app) {
	app.use('/settings', require('./server/routes/settings'));	
	app.use('/permits', require('./server/routes/permits'));
	app.use('/useroffices', require('./server/routes/useroffices'));
	app.use('/userwarehouses', require('./server/routes/userwarehouses'));
 	app.use('/users', require('./server/routes/users'));
	app.use('/roles', require('./server/routes/roles'));
	app.use('/modules', require('./server/routes/modules'));
	app.use('/pages', require('./server/routes/pages'));
	app.use('/orderbooks', require('./server/routes/orderbooks'));
	app.use('/salesbooks', require('./server/routes/salesbooks'));
	app.use('/invoices', require('./server/routes/invoices'));
	app.use('/offices', require('./server/routes/offices'));
	app.use('/sales', require('./server/routes/sales'));
	app.use('/warehouses', require('./server/routes/warehouses'));
	app.use('/inventorytransactions', require('./server/routes/inventorytransactions'));
	app.use('/transfers', require('./server/routes/transfers'));
	app.use('/items', require('./server/routes/items'));
	app.use('/security', require('./server/routes/security'));
};