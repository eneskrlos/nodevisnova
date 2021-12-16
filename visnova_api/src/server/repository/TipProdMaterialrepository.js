const { Op } = require("sequelize");
module.exports = {

	listTipProdMaterial (buscar) {
		return _database.zunpc.model.tipprodmaterial.findAll({
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
	obtenerTipProd(){
		return _database.zunpc.model.tipprodmaterial.findAll({
			attributes: [['nombre','label'], ['idPk','value']],
			where: {
				idFk: 0
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
	obtenerTPM(idPk){
		return _database.zunpc.model.tipprodmaterial.findOne({
			attributes: ['nombre'],
			where: {
				idPk
			}
		});
	},
};