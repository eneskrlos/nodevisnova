module.exports = {

	data: [
		//PASS: GetAdmin*ZUNPC
		//{ id: 1, name: "GET (Grupo de la Electrónica para el Turismo)", user: "get", pass: 'a61d9bacfae0a434307a466ac06c012a3965b99c284e9ae8ac5bf427e2cf80cb', correo: 'get@dominio.cu', pconfirmado: true, roleId: 1, show: false, activate: true },
		//PASS 12345
		{ id: 1, name: "Administrador", user: "admin", pass: "e59e20e83d9fc5ae04458b622179e25b71d7986d8d92d6d2a298a6e91ac5e4ee", correo: 'admin@visnova.si', pconfirmado: true, roleId: 1, show: true, activate: true },
		//PASS 12345
		{ id: 2, name: "Usuario1", user: "user1", pass: "e59e20e83d9fc5ae04458b622179e25b71d7986d8d92d6d2a298a6e91ac5e4ee", correo: 'usuario1@visnova.si', pconfirmado: true, roleId: 2,show: true, activate: true },
		//PASS 12345
		{ id: 3, name: "Invitado", user: "invitado", pass: "e59e20e83d9fc5ae04458b622179e25b71d7986d8d92d6d2a298a6e91ac5e4ee", correo: 'invitado@visnova.si', pconfirmado: true, roleId: 3, show: false, activate: true }
	],

	async create () {
		await _database.zunpc.model.user.bulkCreate(this.data);
	},

	// async assignEntity (entity) {
	// 	let relations = [];

	// 	// /**Only for GET role*/
	// 	// let ent1 = [1,2];
	// 	// ent1.forEach(gp => {
	// 	// 	relations.push({
	// 	// 		userId: 1,
	// 	// 		entityId: gp
	// 	// 	});
	// 	// });

	// 	/**Only for Guess role*/
	// 	let ent1 = [1,2];
	// 	ent1.forEach(gp => {
	// 		relations.push({
	// 			userId: 1,
	// 			entityId: gp
	// 		});
	// 	});

	// 	/**Only for Guess role*/
	// 	let ent2 = [1,2];
	// 	ent2.forEach(gp => {
	// 		relations.push({
	// 			userId: 2,
	// 			entityId: gp
	// 		});
	// 	});

	// 	/**Only for Invitated role*/
	// 	let ent4 = [1,2];
	// 	ent4.forEach(gp => {
	// 		relations.push({
	// 			userId: 3,
	// 			entityId: gp
	// 		});
	// 	});

	// 	await _database.zunpc.model.user_entity.bulkCreate(relations);
	// }

};