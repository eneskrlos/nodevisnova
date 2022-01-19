const sequelize = require("../../../node_modules/sequelize/lib/sequelize");
const { Op } = require("sequelize");
const {QueryTypes} = require("sequelize");
module.exports = {

	list (buscar) {
		return _database.zunpc.model.user.findAll({
			attributes: ['id', 'name', 'user', 'correo','roleId','telefono', 'activate'],
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
					},
					{
						telefono: {
							[Op.like]: '%'+buscar+'%'
						}
					}
				]
			}
		});
	},

	getByUser (user) {
		return _database.zunpc.model.user.findOne({
			attributes: ['id', 'name', 'user', 'correo','roleId','telefono', 'activate'],
			where: {
				user
			}
		})
	},

	getallbyUser (user) {
		return _database.zunpc.model.user.findOne({
			attributes: ['id', 'name', 'user', 'correo','roleId','telefono', 'activate'],
			where: {
				user
			}
		});
	},

	getById (id) {
		return _database.zunpc.model.user.findOne({
			where: {
				id
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
	},
	desactivarUser(user){
		return _database.zunpc.model.user.update({
			name: user.name,
			user: user.user,
			roleId: user.roleId,
			activate: false
		},{
			where: {
				id: user.id
			}
		});
	},
	salvarUsuario(userget){
		return _database.zunpc.model.user.update({
			name: userget.name,
			user: userget.user,
			pass: userget.pass,
			correo: userget.correo,
			pconfirmado: userget.pconfirmado,
			telefono: userget.telefono,
			roleId: userget.roleId,
			show: userget.show,
			activate: userget.activate
		},{
			where: {
				id: userget.id
			}
		});
	},
	obtenerDireccionByIdLD(idLD){
		return _database.zunpc.model.libretadireccion.findOne({
			where: {
				idLD
			}
		});
	},
	listdirecciones(id){
		return _database.zunpc.model.libretadireccion.findAll({
			where: {
				userId:id
			}
		});
	},
	addDireccionofUser(dir){
		return _database.zunpc.model.libretadireccion.create(dir);
	},
	editDireccionofUser(dir){
		return _database.zunpc.model.libretadireccion.update({
			numero: dir.numero,
			direccion: dir.direccion,
			municipio: dir.municipio,
			provincia: dir.provincia
		},{
			where: {
				userId: dir.userId,
				idLD : dir.idLD
			}
		});
	},
	removeDireccionofUser(idLD){
		return _database.zunpc.model.libretadireccion.destroy({
			where: {
				idLD
			}
		});
	},
	obtenerTresUltimosProd(id){
		const sz = new sequelize({
            host: _config.Database.zunpc.host,
            port: _config.Database.zunpc.port,
            database: _config.Database.zunpc.database,
            username: _config.Database.zunpc.user,
            password: _config.Database.zunpc.pass,
            dialect: 'mysql',
            logging: (_config.Mode === 'dev') ? console.log : false,
            define: {
                timestamps: false
            }
        });
		let sql = `
		select  u.name, u.user, v.idProd, p.descripcion, p.tipoProd  
		from user u 
		INNER JOIN venta v on u.id = v.iduser 
		INNER JOIN producto p on p.idProd = v.idProd
		where u.id = ${id}
		ORDER BY v.fecha DESC  
		LIMIT 3 
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},
	obtenerProductos(){
		return _database.zunpc.model.producto.findAll();
	},
	obtenerProductosSimilares(Prod1,Prod2,Prod3){
		return _database.zunpc.model.producto.findAll({
			where: {
				[Op.or]: [
					{
						tipoProd: Prod1
					},
					{
						tipoProd: Prod2
					},
					{
						tipoProd: Prod3
					}
				]
			}
		});
	},

	obtenerTodosFavoritos(id){
		const sz = new sequelize({
            host: _config.Database.zunpc.host,
            port: _config.Database.zunpc.port,
            database: _config.Database.zunpc.database,
            username: _config.Database.zunpc.user,
            password: _config.Database.zunpc.pass,
            dialect: 'mysql',
            logging: (_config.Mode === 'dev') ? console.log : false,
            define: {
                timestamps: false
            }
        });
		let sql = `
		SELECT prod.idProd, prod.descripcion, tp.nombre as tipoProd, m.nombre as material, tm.nombre as tipoMaterial,
		prod.precio, prod.activo, prod.fotoprod1, prod.fotoprod2, prod.fotoprod3, prod.cantDisponible, prod.en_promosion,
		prod.tiempoelavoracion, prod.en_oferta,
		(CASE WHEN (prod.idProd in (select f.prodId FROM favorito f WHERE f.userId = ${id} )) THEN 1 ELSE 0 END) as es_favorito
		FROM producto prod 
		LEFT JOIN tipprodmaterial tp on prod.tipoProd = tp.idPk 
		LEFT JOIN tipprodmaterial m on prod.material = m.idPk 
		LEFT JOIN tipprodmaterial tm on prod.tipoMaterial = tm.idPk 
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},

	adicionarFavoritos(favorito){
		return _database.zunpc.model.favorito.create(favorito);
	},

	eliminarFavorito(idProd,id){
		return _database.zunpc.model.favorito.destroy({
			where: {
				prodId: idProd,
				userId: id
			}
		});
	}
};