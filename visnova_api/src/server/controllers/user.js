const { editDireccionofUser } = require("../repository/user");

exports.User = {

	listAll (req, res) {
		const ident = req.user.user;
		let { body } = req;
		let { buscar } = body;
		if (req.user.user === 'admin') {
			_database.zunpc.repository.user.list(buscar).then(response => {
				_useful.log('user.js').info('Listó los usuarios',req.user.user, JSON.stringify(response));
				return res.send({
					code:200,
					message:'Se ha listado los usuarios',
					data: response,
					servererror: '',
				});
			}).catch(error => {
				_useful.log('user.js').error('No se pudo listar los usuarios','req.user.user',error);
				return res.send({
					code:500,
					message:'No se pudo lisar los usuarios:.' + error,
					data: null,
					servererror: '',
				});
			})
		}else{
			_useful.log('user.js').error('No se pudo listar los usuarios','req.user.user','Usted no tiene acceso');
			return res.send({
				code:500,
				message:'No se pudo lisar los usuarios: Usted no tiene acceso.',
				data: null,
				servererror: '',
			});
		} 
	},

	list (req, res) {
		try {
			_database.zunpc.repository.user.getById(req.params.id).then(response => {
				_useful.log('user.js').info('Listó un usuario',req.user.user,JSON.stringify(response));
				return res.send({
					code:200,
					message:'Se ha obtenido el usuario correctamente',
					data: response,
					servererror: '',
				});
			}).catch(error => {
				_useful.log('user.js').error('No se pudo obtener el usuario',req.user.user,error);
				return res.send({
					code:500,
					message:'No se pudo obtener el usuario',
					data: null,
					servererror: '',
				});
			});
		} catch (error) {
			_useful.log('user.js').error('No se pudo obtener el usuario','req.user.user',error);
			return res.send({
				code:500,
				message:'No se pudo obtener el usuario',
				data: null,
				servererror: '',
			});
		}
		
	},

	async desactivarUsuario(req,res){
		const ident = req.user.user;
		let id = req.params.id;
		if(id == undefined || !id || id.toString() == "")
			return res.send({
				code:500,
				message:'Compruebe que esta enviando los datos correctos.',
				data: null,
				servererror: '',
			});
		
		try {
			let user = await _database.zunpc.repository.user.getById(id);
			if(!user){
				return res.send({
					code:500,
					message:'Usuario no encontrado',
					data: null,
					servererror: '',
				});
			}
			let desactivado = await _database.zunpc.repository.user.desactivarUser(user);
			_useful.log('user.js').info('Se ha desactivado el usuario: ' + user.name ,req.user.user,JSON.stringify(desactivado));
			var listuser = await _database.zunpc.repository.user.list("");
			return res.send({
				code:200,
				message:'Se ha desactivado el usuario correctamente',
				data: listuser,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error('Ha ocuirrido un error al desactivar usuario',ident,error);
			return res.send({
				code:500,
				message:'Ha ocuirrido un error al desactivar usuario',
				data: null,
				servererror: '',
			});
		}
	},

	getByUser (req, res) {
		let { user } = req;
		_database.zunpc.repository.user.getallbyUser(user.user).then(response => {
			_useful.log('user.js').info('Listó un usuario',req.user.user,JSON.stringify(response));
			return res.send(response.entities);
		}).catch(error => {
			_useful.log('user.js').error('No se pudo listar el usuario',req.user.user,error);
			return res.sendStatus(500);
		});
	},

	async saveUsuario(req, res){
		const ident = req.user.user;
		let { body } = req;
		let { id } = body;
		if (!id || id.toString() == "" || id == undefined) {
			return res.send({
				code:500,
				message:'Compruebe que esta enviando los datos correctos. ',
				data: null,
				servererror: '',
			});
		}
		try {
			let user = await  _database.zunpc.repository.user.getById(id);
			if(!user){
				return res.send({
					code:500,
					message:'Usuario no encontrado',
					data: null,
					servererror: '',
				});
			}
			let userget = {};
			userget.id = user.id;
			userget.name = user.name;
			userget.user = user.user;
			userget.pass = user.pass;
			userget.correo = user.correo;
			userget.pconfirmado = user.pconfirmado;
			userget.telefono = user.telefono;
			userget.roleId = user.roleId;
			userget.show = user.show;
			userget.activate = (user.activate == false)? true: false;
			let salvado  = await _database.zunpc.repository.user.salvarUsuario(userget);
			_useful.log('user.js').info('Se ha salvado el usuario: ' + user.name ,req.user.user,JSON.stringify(salvado));
			var listuser = await _database.zunpc.repository.user.list("");
			return res.send({
				code:200,
				message:'Se ha salvado el usuario correctamente',
				data: listuser,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error('Ha ocuirrido un error al salvar usuario',ident,error);
			return res.send({
				code:500,
				message:'Ha ocuirrido un error al salvar usuario',
				data: null,
				servererror: '',
			});
		}
	},

	async new (req, res) {
		let { body } = req;
		let { name, user, pass, roleId, entitySelect } = body;
		if ( !name || !user || !pass || !roleId ) return res.sendStatus(400);

		body.pass = _useful.encrypt(pass);

		try {
			let dbUser = await _database.zunpc.repository.user.getByUser(user);
			_useful.log('user.js').info('Listó un usuario',req.user.nick,JSON.stringify(dbUser));

			if ( dbUser && dbUser.user === user ) return res.sendStatus(400);

			let newUser = await _database.zunpc.repository.user.create(body);
			_useful.log('user.js').info('Creó un usuario', req.user.nick, JSON.stringify(newUser));

			await _database.zunpc.repository.user_entity.createByUser(newUser.id, entitySelect);
			_useful.log('role.js').info('Se asignó las entidades al usuario', req.user.nick, JSON.stringify(newUser));
			return res.send(newUser);
		}
		catch (error) {
			_useful.log('user.js').error('No se pudo crear el usuario',req.user.nick,error);
			return res.sendStatus(500);
		}
	},

	async edit (req, res) {
		let { body } = req;
		let { id, name, user, roleId, entitySelect } = body;
		if ( !id || !name || !user || !roleId ) return res.sendStatus(400);

		try{
			let dbUser = await _database.zunpc.repository.user.getByUser(user);
			_useful.log('user.js').info('Listó un usuario',req.user.nick,JSON.stringify(dbUser));

			if ( dbUser && dbUser.user === user && dbUser.id !== id ) return res.sendStatus(400);

			let newUser = await _database.zunpc.repository.user.update(body);
			_useful.log('user.js').info('Editó un usuario',req.user.nick,JSON.stringify(newUser));

			await _database.zunpc.repository.user_entity.deleteByUser(id);
			_useful.log('role.js').info('se eliminó las entidades del usuario', req.user.nick, JSON.stringify(newUser));

			await _database.zunpc.repository.user_entity.createByUser(id, entitySelect);
			_useful.log('role.js').info('Se asignó las entidades al usuario', req.user.nick, JSON.stringify(newUser));

			return res.send("OK");
		}
		catch (error) {
			_useful.log('user.js').error('No se pudo editar el usuario',req.user.nick,error);
			return res.sendStatus(500);
		}
	},

	resetPassword (req, res) {
		let { pass, id } = req.body;

		if (pass && id) {
			pass = _useful.encrypt(pass);
		}
		else {
			return res.sendStatus(400);
		}

		try {
			let user = _database.zunpc.repository.user.resetPassword(pass, id);
			_useful.log('user.js').info(`Reseteó la constraseña al usuario con ID ${id}`,req.user.nick,JSON.stringify(user));
			return res.send();
		}
		catch (error) {
			_useful.log('user.js').error(`No se pudo resetear la contraseña al usuario con ID ${id}`,req.user.nick,error);
			return res.sendStatus(500);
		}
	},

	async remove (req, res) {
		let { id } = req.params;
		if ( id ) {
			id = parseInt(id);
			if ( id ===1 || id === 2 || id === 3 ) return res.sendStatus(400);
		}
		else {
			return res.sendStatus(400);
		}

		try {
			await _database.zunpc.repository.user.delete(id);
			_useful.log('user.js').info('Eliminó un usuario',req.user.nick,JSON.stringify(id));
			return res.send('OK');
		}
		catch (error) {
			_useful.log('user.js').error('No se pudo eliminar el usuario',req.user.nick,error);
			return res.sendStatus(500);
		}
	},

	async listaddressbyidUser(req, res){
		let user = req.user;
		let { body } = req;
		let { id } = body;
		try {
			let listdirecciones = await _database.zunpc.repository.user.listdirecciones(id);
			if(!listdirecciones || listdirecciones.length <= 0){
				_useful.log('user.js').error('Error al listar las direcciones',user.user,error);
				return res.send({
					code:200,
					message:'No existe dirección.',
					data: null,
					servererror: '',
				});
			}
			return res.send({
				code:200,
				message:'Se ha listado las direcciones',
				data: listdirecciones,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error('Error al listar las direcciones',user.user,error);
			return res.send({
				code:500,
				message:'Error al listar las direcciones',
				data: null,
				servererror: '',
			});
		}
	},

	async addDireccion(req, res){
		let user = req.user;
		let { body } = req;
		let { numero, direccion, municipio, provincia, userId } = body;
		try {
			if(numero == undefined || direccion == undefined || municipio == undefined || provincia == undefined || userId == undefined){
				_useful.log('user.js').error('Error al adicionar direccion del usuario: Existen valores indefinidos.',user.user,'Verifique que los datos que esta enviando no esten undefined.');
				return res.send({
					code:500,
					message:'Error al adicionar direccion del usuario: Existen valores indefinidos.',
					data: null,
					servererror: '',
				});
			}

			let adddir = await _database.zunpc.repository.user.addDireccionofUser(body);
			if(!adddir){
				_useful.log('user.js').error('Error al adicionar direccion del usuario.',user.user,);
				return res.send({
					code:500,
					message:'Error al adicionar direccion del usuario..',
					data: null,
					servererror: '',
				});
			}
			_useful.log('user.js').info('Se ha adicionado correctamente la dirección.', req.user.nick, JSON.stringify(adddir));
			let listdirecciones = await _database.zunpc.repository.user.listdirecciones(adddir.dataValues.userId);
			return res.send({
				code:200,
				message:'Se ha adicionado correctamente la dirección.',
				data: listdirecciones,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error('Error al adicionar la dirección',user.user,error);
			return res.send({
				code:500,
				message:'Error al adicionar la dirección',
				data: null,
				servererror: '',
			});
		}
	},
	async editDireccion(req, res){
		let user = req.user;
		let { body } = req;
		let {idLD, numero, direccion, municipio, provincia, userId } = body;
		try {
			if(idLD == undefined || numero == undefined || direccion == undefined || municipio == undefined || provincia == undefined || userId == undefined){
				_useful.log('user.js').error('Error al editar direccion del usuario: Existen valores indefinidos.',user.user,'Verifique que los datos que esta enviando no esten undefined.');
				return res.send({
					code:500,
					message:'Error al editar direccion del usuario: Existen valores indefinidos.',
					data: null,
					servererror: '',
				});
			}
			let editdir = await _database.zunpc.repository.user.editDireccionofUser(body);
			if(!editdir){
				_useful.log('user.js').error('Error al editar dirección del usuario.',user.user,);
				return res.send({
					code:500,
					message:'Error al editar dirección del usuario..',
					data: null,
					servererror: '',
				});
			}
			_useful.log('user.js').info('Se ha editado correctamente la dirección.', user.user, JSON.stringify(editdir));
			let listdirecciones = await _database.zunpc.repository.user.listdirecciones(userId);
			return res.send({
				code:200,
				message:'Se ha editado correctamente la dirección.',
				data: listdirecciones,
				servererror: '',
			});

		} catch (error) {
			_useful.log('user.js').error('Error al editar las dirección',user,error);
			return res.send({
				code:500,
				message:'Error al editar las dirección',
				data: null,
				servererror: '',
			});
		}
	},
	async deleteDireccion(req, res){
		let user = req.user;
		let { idLD } = req.params;
		try {
			if( idLD == undefined ){
				_useful.log('user.js').error('Error al eliminar la direccion del usuario: Existen valores indefinidos.',user.user,'Verifique que los datos que esta enviando no esten undefined.');
				return res.send({
					code:500,
					message:'Error al eliminar la direccion del usuario: Existen valores indefinidos.',
					data: null,
					servererror: '',
				});
			}
			let dir = await _database.zunpc.repository.user.obtenerDireccionByIdLD(idLD);
			if(!dir){
				return res.send({
					code:500,
					message:'Error al eliminar la direccion del usuario: Direccion no encontrada.',
					data: null,
					servererror: '',
				});
			}
			let deletedir = await _database.zunpc.repository.user.removeDireccionofUser(idLD);
			if(!deletedir){
				_useful.log('user.js').error('Error al eliminar la dirección del usuario.',user.user,);
				return res.send({
					code:500,
					message:'Error al eliminar la dirección del usuario.',
					data: null,
					servererror: '',
				});
			}
			_useful.log('user.js').info('Se ha eliminado correctamente la dirección.', user.user, JSON.stringify(deletedir));
			let listdirecciones = await _database.zunpc.repository.user.listdirecciones(dir.userId);
			return res.send({
				code:200,
				message:'Se ha eliminado correctamente la dirección.',
				data: listdirecciones,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error('Error al eliminar la dirección',user.user,error);
			return res.send({
				code:500,
				message:'Error al eliminar la dirección',
				data: null,
				servererror: '',
			});
		}
	},
	async getSimilares(req, res){
		let user = req.user;
		let { body } = req;
		let { id } = body;
		try {
			let tresultimos = await _database.zunpc.repository.user.obtenerTresUltimosProd(id);
			let listasimilares = [];
			if(!tresultimos || tresultimos.length <= 0){
				listasimilares = await _database.zunpc.repository.user.obtenerProductos();
			}else{
				let tp1 = tresultimos[0].tipoProd;
				let tp2 = tresultimos[1].tipoProd;
				let tp3 = tresultimos[2].tipoProd;
				listasimilares = await _database.zunpc.repository.user.obtenerProductosSimilares(tp1,tp2,tp3);
			}
			return res.send({
				code:200,
				message:'ok.',
				data: listasimilares,
				servererror: '',
			});
		} catch (error) {
			_useful.log('user.js').error('Error al obtener los productos',user.user,error);
			return res.send({
				code:500,
				message:'Error al obtener los productos',
				data: null,
				servererror: '',
			});
		}
	}


};