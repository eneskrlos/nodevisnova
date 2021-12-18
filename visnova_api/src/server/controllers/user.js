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
	}

};