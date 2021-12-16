module.exports = {

	list () {
		return _database.zunpc.model.permission.findAll();
	},

	listactive () {
		return _database.zunpc.model.permission.findAll({
			where: {
				show: 1
			}
		});
	},

	getById (id) {
		return _database.zunpc.model.permission.findOne({
			where: {
				id
			}
		})
	},

	create (permission) {
		return _database.zunpc.model.permission.create(permission);
	},

	update (permission) {
		return _database.zunpc.model.permission.update(permission,{
			where: {
				id: permission.id
			}
		});
	},

	delete (id) {
		return _database.zunpc.model.permission.update(
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