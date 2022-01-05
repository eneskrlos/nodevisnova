const { Op } = require("sequelize");
module.exports = {

	checkUserAndPass (user, pass) {
		return _database.zunpc.model.user.findOne({
			include: [
				{
					model: _database.zunpc.model.role,
					include: [
						{
							as: "permissions",
							model: _database.zunpc.model.permission
						}
					]
				}
			],
			where: {
				user,
				pass
			}
		});
	},
	checkUserAndEmail (_user, _correo) {
		return _database.zunpc.model.user.findOne({
			where: {
				[Op.or]: [
					{
						user: {
							[Op.like]: '%'+_user+'%'
						  }
					},
					{
						correo: {
							[Op.like]: '%'+_correo+'%'
						  }
					}
				]
			}
		});
	},
	adicionarUsuario(user){
		return _database.zunpc.model.user.create(user);
	},
	checkUser(id,pass){
		return _database.zunpc.model.user.findOne({
			where: {
				id,
				pass
			}
		});
	},
	updateUser(user){
		return _database.zunpc.model.user.update(user,{
			where: {
				id: user.id
			}
		});
	},
	checkEmail(correo){
		return _database.zunpc.model.user.findOne({
			where: {
				correo
			}
		});
	},
	getUser(user, correo){
		return _database.zunpc.model.user.findOne({
			where: {
				user,
				correo
			}
		});
	},
	saveTokenActivation(newactivetoken){
		return _database.zunpc.model.token.create(newactivetoken);
	},
	existeToken(token){
		return _database.zunpc.model.token.findOne({
			where: {
				token
			}
		});
	},
	actualizarEstadoToken(token){
		return _database.zunpc.model.token.update(token,{
			where: {
				id_token: token.id_token
			}
		});
	},
	eliminarTokenUsuario(id_token){
		return _database.zunpc.model.token.destroy({
			where: {
				id_token: id_token
			}
		});
	},
	verifyCodigoCuenta(codigo){
		return _database.zunpc.model.codigocuenta.findOne({
			where:{
				codigo
			}
		});
	},
	addCodigoCuenta(cc){
		return _database.zunpc.model.codigocuenta.create(cc);
	},
	getUserById(id){
		return _database.zunpc.model.user.findOne({
			where: {
				id
			}
		});
	},
	eliminarCodigoCuenta(id_codigo){
		return _database.zunpc.model.codigocuenta.destroy({
			where: {
				id_codigo: id_codigo
			}
		});
	},
	infoUser(user){
		return _database.zunpc.model.user.findOne({
			include: [
				{
					model: _database.zunpc.model.libretadireccion,
				}
			],
			where: {
				id:user.id
			}
		});
	}
};