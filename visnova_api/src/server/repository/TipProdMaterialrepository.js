const sequelize = require("../../../node_modules/sequelize/lib/sequelize");
const { Op } = require("sequelize");
const {QueryTypes} = require("sequelize");
module.exports = {

	listTipProdMaterial (buscar) {
		return _database.zunpc.model.tipprodmaterial.findAll({
			attributes: [['nombre','label'], ['idPk','value']],
			where: {
				[Op.or]: [
					{
						nombre: {
							[Op.like]: '%'+buscar+'%'
						}
					}
				]
			}
		});
	},
	obtenerTipProdMaterialByid(idPk){
		return _database.zunpc.model.tipprodmaterial.findOne({
			where: {
				idPk
			}
		});
	},
	addTPM(newTPM){
		return _database.zunpc.model.tipprodmaterial.create(newTPM);
	},
	getByNameTPM(nombre){
		return _database.zunpc.model.tipprodmaterial.findOne({
			where: {
				nombre
			}
		});
	},
	updateTPM(TPM){
		return _database.zunpc.model.tipprodmaterial.update({
			nombre: TPM.nombre,
			idFk: TPM.idFk
		},{
			where: {
				idPk: TPM.idPk
			}
		});
	},
	deleteTMP (idPk) {
		return _database.zunpc.model.tipprodmaterial.destroy({
			where: {
				idPk
			}
		});
	},
	obtenerHijosTipProdMaterialByid(idPk){
		return _database.zunpc.model.tipprodmaterial.findAll({
			where: {
				idFk:idPk
			}
		});
	},
	obtenerTipProd(buscar){
		return _database.zunpc.model.tipprodmaterial.findAll({
			attributes: [['nombre','label'], ['idPk','value']],
			where: {
				idFk: 0,
				[Op.or]: [
					{
						nombre: {
							[Op.like]: '%'+buscar+'%'
						}
					}
				]
			}
		});
	},
	obtenerMateriales(idFk){
		return _database.zunpc.model.tipprodmaterial.findAll({
			attributes: [['nombre','label'], ['idPk','value']],
			where: {
				idFk
			}
		});
	},
	getAllMateriales(buscar){
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
		select  m.idPk as value,m.nombre as label from tipprodmaterial tp 
		inner join tipprodmaterial m on tp.idPk = m.idFk
		where tp.idFk = 0 and m.nombre LIKE '%${buscar}%'
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},
	obtenerTipMateriales(idFk){
		return _database.zunpc.model.tipprodmaterial.findAll({
			attributes: [['nombre','label'], ['idPk','value']],
			where: {
				idFk
			}
		});
	},
	obtenerFiltro(){
		return _database.zunpc.model.tipprodmaterial.findAll({
			attributes: ['idPk','nombre', 'idFk'],
		});
	},
	getReferencia(id){
		return _database.zunpc.model.tipprodmaterial.findOne({
			attributes: ['nombre'],
			where: {
				idPk: id
			}
		});
	},
	getElementoReferencia(id){
		return _database.zunpc.model.tipprodmaterial.findOne({
			attributes: [['nombre','label'], ['idPk','value']],
			where: {
				idFk: id
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
	obtenerMaterialesbyNombre(nombre){
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
		SELECT mat.idPk as value, mat.nombre as label 
		FROM tipprodmaterial tp INNER JOIN tipprodmaterial mat on tp.idPk = mat.idFk 
		where tp.idFk = 0 and tp.nombre = '${nombre}'
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	},
	obtenerTipMaterialesbyNombre(nombre){
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
		SELECT tm.idPk as value, tm.nombre as label 
		FROM tipprodmaterial tp 
		INNER JOIN tipprodmaterial mat on tp.idPk = mat.idFk 
		INNER JOIN tipprodmaterial tm on mat.idPk = tm.idFk
		where mat.nombre = '${nombre}'
		`;
		let options = {
			type: QueryTypes.SELECT 
		};
		return sz.query(sql,options);
	}
};