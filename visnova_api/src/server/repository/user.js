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
		SELECT ld.idLD, ld.direccion, m.idmuni, m.nombre as mun, p.idprov, p.nombre as provincia, m.precioEnvio 
		FROM libretadireccion ld INNER JOIN provincia p on ld.provincia = p.idprov
		INNER JOIN municipio m on ld.municipio = m.idmuni
		WHERE ld.userId = ${id}
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
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
	obtenerProductoByid(idProd){
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
		SELECT tp.idPk
		FROM producto prod LEFT JOIN tipprodmaterial tp on prod.tipoProd = tp.idPk 
		LEFT JOIN tipprodmaterial m on prod.material = m.idPk 
		LEFT JOIN tipprodmaterial tm on prod.tipoMaterial = tm.idPk 
		where prod.idProd  = ${idProd}
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},
	obtenerProductos(){
		return _database.zunpc.model.producto.findAll();
	},
	obtenerProductosSimilares(Prod1,idProd){
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
		prod.tiempoelavoracion, prod.en_oferta
		FROM producto prod LEFT JOIN tipprodmaterial tp on prod.tipoProd = tp.idPk 
		LEFT JOIN tipprodmaterial m on prod.material = m.idPk 
		LEFT JOIN tipprodmaterial tm on prod.tipoMaterial = tm.idPk 
		where tp.idPk = ${Prod1} and prod.idProd <> ${idProd}
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
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
		prod.tiempoelavoracion, prod.en_oferta
		FROM producto prod 
		LEFT JOIN tipprodmaterial tp on prod.tipoProd = tp.idPk 
		LEFT JOIN tipprodmaterial m on prod.material = m.idPk 
		LEFT JOIN tipprodmaterial tm on prod.tipoMaterial = tm.idPk 
		INNER JOIN favorito f on prod.idProd = f.prodId
		where f.userId = ${id}
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},

	adicionarFavoritos(favorito){
		return _database.zunpc.model.favorito.create(favorito);
	},

	eliminarFavorito(idFavor){
		return _database.zunpc.model.favorito.destroy({
			where: {
				idFavor
			}
		});
	},

	obtenerRegisterUser(buscar){
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
		SELECT v.idventa, v.fecha, prod.idProd, prod.descripcion, tp.nombre as tipoProd, m.nombre as material, tm.nombre as tipoMaterial,
		prod.precio, prod.activo, prod.fotoprod1, prod.fotoprod2, prod.fotoprod3, e.nombre as Estado
		FROM producto prod 
		LEFT JOIN tipprodmaterial tp on prod.tipoProd = tp.idPk 
		LEFT JOIN tipprodmaterial m on prod.material = m.idPk 
		LEFT JOIN tipprodmaterial tm on prod.tipoMaterial = tm.idPk 
		INNER JOIN venta v on prod.idProd = v.idProd
		INNER JOIN estado e on v.idestado = e.idestado
		Where prod.descripcion LIKE '%${buscar}%' or prod.precio LIKE '%${buscar}%' or tp.nombre LIKE '%${buscar}%' 
		or m.nombre LIKE '%${buscar}%' or tm.nombre LIKE '%${buscar}%'
		GROUP BY v.fecha
		ORDER BY v.fecha
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},
	obtenerRegisterbyUser(buscar,id){
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
		SELECT v.idventa, v.fecha, prod.idProd, prod.descripcion, tp.nombre as tipoProd, m.nombre as material, tm.nombre as tipoMaterial,
		prod.precio, prod.activo, prod.fotoprod1, prod.fotoprod2, prod.fotoprod3, e.nombre as Estado
		FROM producto prod 
		LEFT JOIN tipprodmaterial tp on prod.tipoProd = tp.idPk 
		LEFT JOIN tipprodmaterial m on prod.material = m.idPk 
		LEFT JOIN tipprodmaterial tm on prod.tipoMaterial = tm.idPk 
		INNER JOIN venta v on prod.idProd = v.idProd
		INNER JOIN estado e on v.idestado = e.idestado
		Where v.iduser = ${id} and ( prod.descripcion LIKE '%${buscar}%' or prod.precio LIKE '%${buscar}%' or tp.nombre LIKE '%${buscar}%' 
		or m.nombre LIKE '%${buscar}%' or tm.nombre LIKE '%${buscar}%' )
		GROUP BY v.fecha
		ORDER BY v.fecha
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},
	getListProvincias(){
		return _database.zunpc.model.provincia.findAll({
			attributes: [['nombre','label'], ['idprov','value']],
		});
	},
	getProvinciaById(idprov){
		return _database.zunpc.model.provincia.findAll({
			attributes: ['nombre'],
			where: {
				idprov
			}
		});
	},
	getMunicipioByidprov(idprov){
		return _database.zunpc.model.municipio.findAll({
			attributes: [['nombre','label'], ['idmuni','value'], ['precioEnvio', 'envio']],
			where: {
				provId: idprov
			}
		});
	}
};