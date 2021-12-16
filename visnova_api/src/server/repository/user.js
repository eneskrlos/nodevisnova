const Op = require('sequelize').Op;
module.exports = {

	list (buscar) {
		return _database.zunpc.model.user.findAll({
			attributes: ['id', 'name', 'user', 'correo','roleId', 'activate'],
			include: [{
				model: _database.zunpc.model.role
				},
			],
			where: {
				[Op.or]: [
					{
						name: {
							[Op.like]: '%'+buscar+'%'
						}
					},
					{
						user: {
							[Op.like]: '%'+buscar+'%'
						}
					},
					{
						correo: {
							[Op.like]: '%'+buscar+'%'
						}
					}
				]
			}
		});
	},

	getByUser (user) {
		return _database.zunpc.model.user.findOne({
			attributes: ['id', 'name', 'user', 'correo','roleId', 'activate'],
			where: {
				user
			}
		})
	},

	getallbyUser (user) {
		return _database.zunpc.model.user.findOne({
			attributes: ['id', 'name', 'user', 'correo','roleId', 'activate'],
			where: {
				user
			}
		});
	},

	getById (id) {
		return _database.zunpc.model.user.findOne({
			where: {
				id,
				show: true
			}
		})
	},

	getByRolId (roleId) {
		return _database.zunpc.model.user.findAll({
			where: {
				roleId
			}
		})
	},

	getByPermission (permissionId) {
		return _database.zunpc.model.user.findAll({
			include: [{
				attributes: [],
				model: _database.zunpc.model.role,
				required: true,
				include: [{
					attributes: [],
					as: 'permissions',
					model: _database.zunpc.model.permission,
					required: true,
					where: {
						id: permissionId
					}
				}]
			}]
		})
	},


	create (user) {
		return _database.zunpc.model.user.create(user);
	},

	update (user) {
		return _database.zunpc.model.user.update({
			name: user.name,
			user: user.user,
			roleId: user.roleId,
			activate: user.activate
		},{
			where: {
				id: user.id
			}
		});
	},

	resetPassword (pass, id) {
		return _database.zunpc.model.user.update({
			pass
		},{
			where: {
				id
			}
		});
	},

	delete (id) {
		return _database.zunpc.model.user.destroy({
			where: {
				id
			}
		});
	}
};