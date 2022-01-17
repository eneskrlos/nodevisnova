module.exports = {

	data: [
		{ idventa: 1, iduser: 1, fecha: '2022-01-01 11:50:17', idProd: 1, precio: 3.24, idestado: 1},
		{ idventa: 2, iduser: 1, fecha: '2022-01-03 11:52:01', idProd: 2, precio: 2.5, idestado: 1},
		{ idventa: 3, iduser: 1, fecha: '2022-01-03 11:53:03', idProd: 4, precio: 3, idestado: 1},
		{ idventa: 4, iduser: 1, fecha: '2022-01-04 20:59:54', idProd: 1, precio: 3.24, idestado: 1},
		{ idventa: 5, iduser: 1, fecha: '2022-01-04 21:00:44', idProd: 1, precio: 3.24, idestado: 1},
		{ idventa: 6, iduser: 1, fecha: '2022-01-05 21:01:17', idProd: 2, precio: 2.5, idestado: 1},
	],
	async create () {
		await _database.zunpc.model.venta.bulkCreate(this.data);
	},
};