module.exports = {

	data: [
		{ idLD: 1, direccion: 'Direccion del Administrador', municipio: 1, provincia: 1, userId: 1},
		{ idLD: 2, direccion: 'Direccion del Usuario1', municipio: 2, provincia: 1, userId: 2},
		{ idLD: 3, direccion: 'Direccion del Invitado', municipio: 3, provincia: 1, userId: 3}
	],

	async create () {
		await _database.zunpc.model.libretadireccion.bulkCreate(this.data);
	},
};