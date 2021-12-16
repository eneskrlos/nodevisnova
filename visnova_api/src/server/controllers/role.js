exports.Role = {

	listAll (req, res) {
		_database.zunpc.repository.role.list().then(data => {
			_useful.log('role.js').info('Listó los roles',req.user.nick,JSON.stringify(data));
			return res.send(data);
		}).catch(error => {
			_useful.log('role.js').error('No se pudo listar los roles',req.user.nick,error);
			return res.sendStatus(500);
		})
	},

	list (req, res) {
		_database.zunpc.repository.role.getById(req.params.id).then(data => {
			_useful.log('role.js').info('Listó un rol',req.user.nick,JSON.stringify(data));
			return res.send(data);
		}).catch(error => {
			_useful.log('role.js').error('No se pudo listar el rol',req.user.nick,error);
			return res.sendStatus(500);
		});
	},

	async new (req, res) {
		let { body } = req;
		let { name, permissions } = body;
		if ( !name ) {
			_useful.log('role.js').info('Parámetros incorrectos', 'system' );
			return res.sendStatus(400);
		}

		try {
			let dbRole = await _database.zunpc.repository.role.getByName(name);
			_useful.log('role.js').info('Se buscó un rol por nombre', req.user.nick, JSON.stringify(name));

			if(dbRole) return res.sendStatus(400);

			let newRole = await _database.zunpc.repository.role.create(body);
			_useful.log('role.js').info('Creó un rol', req.user.nick, JSON.stringify(newRole));

			await _database.zunpc.repository.role_permission.createByRol(newRole.id, permissions);
			_useful.log('role.js').info('Se asignó los permisos al rol', req.user.nick, JSON.stringify(newRole));

			return res.send(newRole);
		}
		catch (error) {
			_useful.log('role.js').error('No se pudo crear el rol', req.user.nick, error);
			return res.sendStatus(500);
		}

	},

	async edit (req, res) {
		let { body } = req;
		let { id, name, permissions } = body;
		if( !id || !name || id === 1 || id === 2 || id === 3) return res.sendStatus(400);

		try {
			let dbRole = await _database.zunpc.repository.role.getByName(name);
			_useful.log('role.js').info('Se buscó un rol por nombre', req.user.nick, JSON.stringify(name));

			if(dbRole && dbRole.id !== id) return res.sendStatus(400);

			let role = await _database.zunpc.repository.role.update(body);
			_useful.log('role.js').info('Editó un rol', req.user.nick, JSON.stringify(role));

			await _database.zunpc.repository.role_permission.deleteByRol(id);
			_useful.log('role.js').info('se eliminó los permisos del rol', req.user.nick, JSON.stringify(role));

			await _database.zunpc.repository.role_permission.createByRol(id, permissions);
			_useful.log('role.js').info('Se asignó los permisos del rol', req.user.nick, JSON.stringify(role));

			return res.send('OK');
		}
		catch (error) {
			_useful.log('role.js').error('No se pudo editar el rol', req.user.nick, error);
			return res.sendStatus(500);
		}
	},

	async remove (req, res) {
		let { id } = req.params;
		if ( id ) {
			id = parseInt(id);
			if ( id === 1 || id === 2 || id === 3 ) return res.sendStatus(400);
		}
		else {
			return res.sendStatus(400);
		}

		try {
			await _database.zunpc.repository.role.delete(id);
			_useful.log('role.js').info('Eliminó un rol', req.user.nick, JSON.stringify(id));

			await _database.zunpc.repository.role_permission.deleteByRol(id);
			_useful.log('role.js').info('Eliminó la relaciones entre el rol y los permisos', req.user.nick, JSON.stringify(id));

			return res.send('OK');
		}
		catch (error) {
			_useful.log('role.js').error('No se pudo eliminar el rol', req.user.nick, error);
			return res.sendStatus(500);
		}
	}

};