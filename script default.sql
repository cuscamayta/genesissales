use database_productionsale;

select * from database_productionsale.roles;
insert into database_productionsale.roles (title, createdat, updatedat) values('administrador', now(), now());

select * from database_productionsale.users;
insert into database_productionsale.users (username, firstname, lastname, password, token, createdat, updatedat, idrole) values ('admin','administrador', 'de sistema', 'admin',
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwic3RhdGUiOjEsInVzZXJuYW1lIjoiYmxvcGV6diIsInBhc3N3b3JkIjoiSW5uc2ExMjM0IiwiZmlyc3RuYW1lIjoiQnJlbmRhIiwibGFzdG5hbWUiOiJWZWxhc2NvIiwiZW1haWwiOiJicmVuQGdtYWlsLmNvbSIsImlkcm9sZSI6MSwiaWF0IjoxNDc5ODI0NDEzfQ.M8yU-opUkzRCM2LEDHSPqofE7q72Gsed-mcGTkx0FnM', now(), now(), 1);

select * from database_productionsale.offices;
insert into database_productionsale.offices (title, address, phone, city, createdat, updatedat) values('Central', 'avenida test', '0', 'Santa Cruz',now(), now());


select * from database_productionsale.modules;

insert into database_productionsale.modules (title, class, createdat, updatedat) values ('Seguridad', 'fa fa-home', now(), now());
insert into database_productionsale.modules (title, class, createdat, updatedat) values ('Configuración', 'fa fa-edit', now(), now());
insert into database_productionsale.modules (title, class, createdat, updatedat) values ('Administración', 'fa fa-desktop', now(), now());
insert into database_productionsale.modules (title, class, createdat, updatedat) values ('Ventas', 'fa fa-table', now(), now());
insert into database_productionsale.modules (title, class, createdat, updatedat) values ('Inventario', 'fa fa-bar-chart-o', now(), now());
insert into database_productionsale.modules (title, class, createdat, updatedat) values ('Reportes', 'fa fa-clone', now(), now());

select * from database_productionsale.pages;
insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Ajustes', 'setting', now(), now(),1);
insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Rol', 'role', now(), now(),1);
insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Usuario', 'user', now(), now(),1);
insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Permisos', 'permit', now(), now(),1);
insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Sucursales por usuario', 'useroffice', now(), now(),1);
insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Almacenes por usuario', 'userwarehouse', now(), now(),1);

insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Sucursal', 'office', now(), now(),2);
insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Almacen', 'warehouse', now(), now(),2);

insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Dosificación', 'orderbook', now(), now(),3);

insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Ticket', 'ticket', now(), now(),4);
insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Anular factura', 'invalidate', now(), now(),4);

insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Item', 'item', now(), now(),5);
insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Inventario', 'inventory', now(), now(),5);
insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Traspasos', 'transfer', now(), now(),5);

insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Ventas diarias', 'dailysale', now(), now(),6);
insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Arqueo de caja', 'dailycash', now(), now(),6);
insert into database_productionsale.pages (title, path, createdat, updatedat, idmodule) values ('Facturas anuladas', 'voidedinvoice', now(), now(),6);

select * from database_productionsale.useroffices;
insert into database_productionsale.useroffices (createdat, updatedat, idoffice, iduser) values(now(), now(), 1, 1);

select * from database_productionsale.permits;
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 1, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 2, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 3, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 4, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 5, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 6, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 7, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 8, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 9, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 10, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 11, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 12, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 13, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 14, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 15, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 16, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 17, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 18, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 19, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 20, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 21, 1);
insert into database_productionsale.permits (createdat, updatedat, idpage, idrole) values(now(), now(), 22, 1);
