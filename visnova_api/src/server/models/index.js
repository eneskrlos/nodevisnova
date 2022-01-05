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
		/* let file = require('../../../dev/file');
		let category = require('../../../dev/category');
		let event = require('../../../dev/event');
		let news = require('../../../dev/news');
		let service = require('../../../dev/service');
		let menu = require('../../../dev/menu');
		let feedback = require('../../../dev/feedback');
		let parameter = require('../../../dev/parameter');
		let portal = require('../../../dev/portal');
		let translation = require('../../../dev/translation');
		let notification = require('../../../dev/notification');
		let money = require('../../../dev/money');
		let restorant = require('../../../dev/restorant');
		let range = require('../../../dev/range');
		let entity = require('../../../dev/entity'); */

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

		// /**Categories*/
		// await category.create();

		// /**Event*/
		// await event.create();

		// /**News*/
		// await news.create();

		// /**Service*/
		// await  service.create();

		// /**Menu*/
		// //await menu.create();

		// /**FeedBack*/
		// await feedback.create();

		// /**Parameter*/
		// await parameter.create();

		// /**Portal*/
		// await portal.create();

		// /**Translations*/
		// await translation.create();

		// /**Notifications*/
		// await notification.create();

		// /**Money*/
		// await money.create();

		// /**Restorant*/
		// await restorant.create();

		// /**Range*/
		// await range.create();

	}
};
