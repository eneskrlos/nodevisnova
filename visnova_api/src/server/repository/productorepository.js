const sequelize = require("../../../node_modules/sequelize/lib/sequelize");
const { Op } = require("sequelize");
const {QueryTypes} = require("sequelize");
module.exports = {

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
		prod.precio, prod.activo, prod.fotoprod1, prod.fotoprod2, prod.fotoprod3, prod.cantDisponible
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
		prod.precio, prod.activo, prod.fotoprod1, prod.fotoprod2, prod.fotoprod3, prod.cantDisponible
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
	}
};