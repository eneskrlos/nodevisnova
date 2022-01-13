module.exports = {

	data: [
		{ idLD: 1, direccion: 'Direccion del Administrador', municipio: 'municipio del Administrador', provincia: 'provincincia del Administrador', userId: 1},
		{ idLD: 2, direccion: 'Direccion del Usuario1', municipio: 'municipio del Usuario1', provincia: 'provincincia del Usuario1', userId: 2},
		{ idLD: 3, direccion: 'Direccion del Invitado', municipio: 'municipio del Invitado', provincia: 'provincincia del Invitado', userId: 3}
	],

	async create () {
		await _database.zunpc.model.libretadireccion.bulkCreate(this.data);
	},
};