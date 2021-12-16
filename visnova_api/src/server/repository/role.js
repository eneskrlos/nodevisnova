module.exports = {

	list () {
		return _database.zunpc.model.role.findAll({
			include: [{
				as: "permissions",
				model: _database.zunpc.model.permission
			}],
			where: {
				show: true,
				deleted: 0
			}
		});
	},

	getByName (name) {
		return _database.zunpc.model.role.findOne({
			where: {
				name,
				deleted: 0
			}
		})
	},

	getById (id) {
		return _database.zunpc.model.role.findOne({
			where: {
				id,
				show: true,
				deleted: 0
			}
		})
	},

	create (role) {
		return _database.zunpc.model.role.create(role);
	},

	update (role) {
		return _database.zunpc.model.role.update(role,{
			where: {
				id: role.id
			}
		});
	},

	delete (id) {
		return _database.zunpc.model.role.update(
			{
				deleted: true
			},
			{
				where: {
					id
				}
			});
	}
};