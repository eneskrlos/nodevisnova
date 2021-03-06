module.exports = {

	data: [
		{ id: 1, name: "Administrador"},
		{ id: 2, name: "Usuario" },
		{ id: 3, name: "Invitado"}
	],

	async create () {
		await _database.zunpc.model.role.bulkCreate(this.data);
	},

	async assignPermissions (permission) {
		let relations = [];

		/**Only for GET role*/
		/* permission.forEach(item => {
			relations.push({
				roleId: 1,
				permissionId: item.id
			});
		}); */

		/**Only for Administrator role*/
		/* permission.forEach(item => {
			relations.push({
				roleId: 1,
				permissionId: item.id
			});
		}); */

		/**Only for Administrator role*/
		let adminPermissions = [1];
		adminPermissions.forEach(gp => {
			relations.push({
				roleId: 1,
				permissionId: gp
			})
		});

		/**Only for Guess role*/
		let guessPermissions = [2];
		guessPermissions.forEach(gp => {
			relations.push({
				roleId: 2,
				permissionId: gp
			})
		});

		/**Only for Host role*/
		let huespedPermissions = [3];
		huespedPermissions.forEach(gp => {
			relations.push({
				roleId: 3,
				permissionId: gp
			})
		});

		await _database.zunpc.model.role_permission.bulkCreate(relations);
	}

};
