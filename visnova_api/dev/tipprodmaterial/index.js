module.exports = {

	data: [
		{ idPk: 1, idFk: 0, nombre: "Acabado"},
		{ idPk: 2, idFk: 1, nombre: "Pintura" },
		{ idPk: 3, idFk: 2, nombre: "Vinil"},
		{ idPk: 4, idFk: 2, nombre: "Aceite"},
		{ idPk: 5, idFk: 2, nombre: "Agua"},
		{ idPk: 6, idFk: 2, nombre: "Esmalte"},
		{ idPk: 7, idFk: 0, nombre: "A"},
		{ idPk: 8, idFk: 0, nombre: "B"},
		{ idPk: 9, idFk: 0, nombre: "C"},
		{ idPk: 10, idFk: 0, nombre: "D"},
		{ idPk: 11, idFk: 7, nombre: "A1"},
		{ idPk: 12, idFk: 8, nombre: "B1"},
		{ idPk: 13, idFk: 9, nombre: "C1"},
		{ idPk: 14, idFk: 10, nombre: "D1"},
		{ idPk: 15, idFk: 11, nombre: "A1.1"},
		{ idPk: 16, idFk: 11, nombre: "A1.2"},
		{ idPk: 17, idFk: 12, nombre: "B1.1"},
		{ idPk: 18, idFk: 12, nombre: "B1.2"},
		{ idPk: 19, idFk: 12, nombre: "B1.3"},
		{ idPk: 20, idFk: 13, nombre: "C1.1"},
	],
	async create () {
		await _database.zunpc.model.tipprodmaterial.bulkCreate(this.data);
	}
};
