module.exports = {

	data: [
		{ idestado: 1, nombre: "recogido"},
		{ idestado: 2, nombre: "listo para recogida" },
		{ idestado: 3, nombre: "pendiente"}
	],

	async create () {
		await _database.zunpc.model.estado.bulkCreate(this.data);
	},
};