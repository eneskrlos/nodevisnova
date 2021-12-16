module.exports = {

	data: [
		{ id: 1, name: "Permiso Admin ", show: 1 },
		{ id: 2, name: "Permiso usuario", show: 1 },
		{ id: 3, name: "Permiso invitado", show: 1 },
		
	],

	async create () {
		await _database.zunpc.model.permission.bulkCreate(this.data);
	}

};
