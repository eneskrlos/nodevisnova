const sequelize = require("../../../node_modules/sequelize/lib/sequelize");
const { Op } = require("sequelize");
const {QueryTypes} = require("sequelize");

module.exports = {
	listProdPaginado (buscar) {
		return _database.zunpc.model.producto.findAll({
			where: {
				[Op.or]: [
					{
						descripcion: {
							[Op.like]: '%'+buscar+'%'
						}
					},
					{
						precio: {
							[Op.like]: '%'+buscar+'%'
						}
					}
				]
			}
		});
	},
	listProd (buscar) {
		return _database.zunpc.model.producto.findAll({
			where: {
				[Op.or]: [
					{
						descripcion: {
							[Op.like]: '%'+buscar+'%'
						}
					},
					{
						precio: {
							[Op.like]: '%'+buscar+'%'
						}
					}
				]
			}
		});
	},
	prodquery(buscar){
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
		Where prod.descripcion LIKE '%${buscar}%' or prod.precio LIKE '%${buscar}%' or tp.nombre LIKE '%${buscar}%' 
		or m.nombre LIKE '%${buscar}%' or tm.nombre LIKE '%${buscar}%'
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},
	prodqueryFavor(buscar, id){
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
		FROM producto prod LEFT JOIN tipprodmaterial tp on prod.tipoProd = tp.idPk 
		LEFT JOIN tipprodmaterial m on prod.material = m.idPk 
		LEFT JOIN tipprodmaterial tm on prod.tipoMaterial = tm.idPk 
		where prod.descripcion LIKE '%${buscar}%' or prod.precio LIKE '%${buscar}%' or tp.nombre LIKE '%${buscar}%' 
		or m.nombre LIKE '%${buscar}%' or tm.nombre LIKE '%${buscar}%'
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},
	GetProductoporid(idProd){
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
		where prod.idProd  = ${idProd}
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},
	GetDatosProductoporid(idProd){
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
		SELECT prod.idProd,tp.nombre as nombreTP, tp.idPk as valueTP, 
		m.nombre as nombreM, m.idPk as valueM, 
		tm.nombre as nombreTM, tm.idPk as valueTM
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
	GetDatosMaterialporid(idProd){
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
		SELECT prod.idProd,
		m.nombre as nombreM, m.idPk as valueM
		FROM producto prod 
		LEFT JOIN tipprodmaterial m on prod.material = m.idPk 
		where prod.idProd = ${idProd}
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},
	GetDatosTipoMaterialporid(idProd){
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
		SELECT prod.idProd,
		tm.nombre as nombreTM, tm.idPk as valueTM
		FROM producto prod  
		LEFT JOIN tipprodmaterial tm on prod.tipoMaterial = tm.idPk 
		where prod.idProd = ${idProd}
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},
	addProducto(newproducto){
		return _database.zunpc.model.producto.create(newproducto);
	},
	getByDescProd(descripcion){
		return _database.zunpc.model.producto.findOne({
			where: {
				descripcion
			}
		});
	},
	updateProducto(producto){
		return _database.zunpc.model.producto.update({
			descripcion: producto.descripcion,
			tipoProd: producto.tipoProd,
			material: producto.material,
			tipoMaterial: producto.tipoMaterial,
			precio: producto.precio,
			activo: producto.activo,
			fotoprod1: producto.fotoprod1,
			fotoprod2: producto.fotoprod2,
			fotoprod3: producto.fotoprod3,
			cantDisponible: producto.cantDisponible,
			en_promosion: producto.en_promosion,
			tiempoelavoracion: producto.tiempoelavoracion,
			en_oferta: producto.en_oferta
		},{
			where: {
				idProd: producto.idProd
			}
		});
	},
	deleteProducto(producto){
		return _database.zunpc.model.producto.update({
			activo: false
		},{
			where: {
				idProd: producto.idProd
			}
		});
	},
	obtenerTPM(idPk){
		return _database.zunpc.model.tipprodmaterial.findOne({
			attributes: ['nombre'],
			where: {
				idPk
			}
		});
	},
	obtenerProductobyNombreTipMaterial(nombre){
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
		where tm.nombre = '${nombre}'
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},
	productosMasVendidios(nombre){
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
		select  p.idProd, p.descripcion,tp.nombre as tipoProd, m.nombre as material, tm.nombre as tipoMaterial, 
		p.precio , p.fotoprod1, p.fotoprod2, p.fotoprod3, p.cantDisponible, p.en_oferta, p.en_promosion, COUNT(v.idProd) as cantidad
		from venta v INNER JOIN producto p on v.idProd = p.idProd
		LEFT JOIN tipprodmaterial tp on p.tipoProd = tp.idPk 
		LEFT JOIN tipprodmaterial m on p.material = m.idPk 
		LEFT JOIN tipprodmaterial tm on p.tipoMaterial = tm.idPk
		where tp.nombre like '%${nombre}%' or m.nombre like '%${nombre}%' or tm.nombre like '%${nombre}%'
		GROUP BY v.idProd 
		ORDER BY cantidad DESC
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},
	todosProductos(nombre){
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
		select  p.idProd, p.descripcion,tp.nombre as tipoProd, 
		m.nombre as material, tm.nombre as tipoMaterial, p.precio, p.fotoprod1, 
		p.fotoprod2, p.fotoprod3, p.cantDisponible, p.en_oferta, p.en_promosion 
			from  producto p 
			LEFT JOIN tipprodmaterial tp on p.tipoProd = tp.idPk 
			LEFT JOIN tipprodmaterial m on p.material = m.idPk 
			LEFT JOIN tipprodmaterial tm on p.tipoMaterial = tm.idPk
		where p.activo = 1 and tp.nombre like '%${nombre}%' or m.nombre like '%${nombre}%' or tm.nombre like '%${nombre}%'
		ORDER BY tipoProd 
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	}
	
};