exports.Permission = {

	listAll (req, res) {
		_database.zunpc.repository.permission.list().then(data => {
			_useful.log('permission.js').info('Listó los permisos',req.user.nick,JSON.stringify(data));
			return res.send(data);
		}).catch(error => {
			_useful.log('permission.js').error('No se pudo listar los permisos',req.user.nick,error);
			return res.sendStatus(500).send("Oops. Something went wrong");
		})
	},

	listAllactive (req, res) {
		_database.zunpc.repository.permission.listactive().then(data => {
			_useful.log('permission.js').info('Listó los permisos',req.user.nick,JSON.stringify(data));
			return res.send(data);
		}).catch(error => {
			_useful.log('permission.js').error('No se pudo listar los permisos',req.user.nick,error);
			return res.sendStatus(500).send("Oops. Something went wrong");
		})
	},

	list (req, res) {
		_database.zunpc.repository.permission.getById(req.params.id).then(data => {
			_useful.log('permission.js').info('Listó un permiso',req.user.nick,JSON.stringify(data));
			return res.send(data);
		}).catch(error => {
			_useful.log('permission.js').error('No se pudo listar el permiso',req.user.nick,error);
			return res.sendStatus(500).send("Oops. Something went wrong");
		});
	},

	new (req, res) {
		_database.zunpc.repository.permission.create(req.body).then(data => {
			_useful.log('permission.js').info('Creó un permiso',req.user.nick,JSON.stringify(data));
			return res.send(data);
		}).catch(error => {
			_useful.log('permission.js').error('No se pudo crear el permiso',req.user.nick,error);
			return res.sendStatus(500).send("Oops. Something went wrong");
		});
	},

	edit (req, res) {
		_database.zunpc.repository.permission.update(req.body).then(data => {
			_useful.log('permission.js').info('Editó un permiso', req.user.nick, JSON.stringify(data));
			return res.send(data);
		}).catch(error => {
			_useful.log('permission.js').error('No se pudo editar el permiso', req.user.nick, error);
			return res.sendStatus(500).send("Oops. Something went wrong");
		});
	},

	remove (req, res) {
		_database.zunpc.repository.permission.delete(req.params.id).then(data => {
			_useful.log('permission.js').info('Eliminó un permiso', req.user.nick, JSON.stringify(req.params.id));
			return res.send("OK");
		}).catch(error => {
			_useful.log('permission.js').error('No se pudo eliminar el permiso', req.user.nick, error);
			return res.sendStatus(500).send("Oops. Something went wrong");
		});
	}

};