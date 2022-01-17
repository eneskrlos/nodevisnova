module.exports = {
	initConfigurations () {
		try {

			/**Relation between role and permission*/
			_database.zunpc.model.role.belongsToMany(_database.zunpc.model.permission,{
				as: "permissions",
				through: _database.zunpc.model.role_permission,
				foreignKey: "roleId"
			});
			_database.zunpc.model.permission.belongsToMany(_database.zunpc.model.role,{
				as: "roles",
				through: _database.zunpc.model.role_permission,
				foreignKey: "permissionId"
			});

			// /**Relation between user and role*/
			_database.zunpc.model.role.hasMany(_database.zunpc.model.user);
			_database.zunpc.model.user.belongsTo(_database.zunpc.model.role);

			// /**Relation between libretadireccion and user*/
			_database.zunpc.model.user.hasMany(_database.zunpc.model.libretadireccion);
			_database.zunpc.model.libretadireccion.belongsTo(_database.zunpc.model.user);

			/**Relation between user,favorito and productos*/
			_database.zunpc.model.user.belongsToMany(_database.zunpc.model.producto,{
				as: "productos",
				through: _database.zunpc.model.favorito,
				foreignKey: "userId"
			});
			_database.zunpc.model.producto.belongsToMany(_database.zunpc.model.user,{
				as: "users",
				through: _database.zunpc.model.favorito,
				foreignKey: "prodId"
			});
		}
		catch (error) {
			console.log('\x1b[31m[ERROR]\x1b[0m - %s', 'Don\'t start initConfigurations from DataBase properly. - ' + error.stack);
		}
	},

	async seed () {

		let permission = require('../../../dev/permission');
		let role = require('../../../dev/role');
		let user = require('../../../dev/user');
		let libretadireccion = require('../../../dev/libretadireccion');
		let estado = require('../../../dev/estado');
		let tipprodmaterial = require('../../../dev/tipprodmaterial');
		let producto = require('../../../dev/producto');
		let venta = require('../../../dev/venta');

		/**Permissions*/
		await permission.create();

		/**Entity*/
		//await entity.create();

		/**Roles*/
		await role.create();
		await role.assignPermissions(permission.data);

		
		/**Users*/
		await user.create();
		///await user.assignEntity(entity.data);

		/**libreatdireccion*/
		await libretadireccion.create();

		/**Estado*/
		await estado.create();

		/**tipprodmaterial*/
		await tipprodmaterial.create();

		/**producto*/
		await producto.create();

		/**venta*/
		await venta.create();

		

	}
};
