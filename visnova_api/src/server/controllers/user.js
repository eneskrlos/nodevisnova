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
				_useful.log('user.js').error('No se pudo listar los usuarios','req.user.nick',error);
				return res.send({
					code:500,
					message:'No se pudo lisar los usuarios:.' + error,
					data: null,
					servererror: '',
				});
			})
		}else{
			_useful.log('user.js').error('No se pudo listar los usuarios','req.user.nick','Usted no tiene acceso');
			return res.send({
				code:500,
				message:'No se pudo lisar los usuarios: Usted no tiene acceso.',
				data: null,
				servererror: '',
			});
		} 
	},

	list (req, res) {
		_database.zunpc.repository.user.getById(req.params.id).then(response => {
			_useful.log('user.js').info('Listó un usuario',req.user.user,JSON.stringify(response));
			return res.send(response);
		}).catch(error => {
			_useful.log('user.js').error('No se pudo listar el usuario',req.user.nick,error);
			return res.sendStatus(500);
		});
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