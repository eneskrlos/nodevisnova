const { Op } = require("sequelize");
module.exports = {

	listServ (buscar) {
		return _database.zunpc.model.servicio.findAll({
			attributes: ['idServicio', 'nombre', 'descripcion', 'disponibilidad'],
			where: {
				[Op.or]: [
					{
						nombre: {
							[Op.like]: '%'+buscar+'%'
						  }
					},
					{
						descripcion: {
							[Op.like]: '%'+buscar+'%'
						  }
					}
				]
			}
		});
	},
	GetServicio(idServicio){
		return _database.zunpc.model.servicio.findOne({
			where: {
				idServicio
			}
		});
	},
	addServicio(newservicio){
		return _database.zunpc.model.servicio.create(newservicio);
	},
	getByNombreServi(nombre){
		return _database.zunpc.model.servicio.findOne({
			where: {
				nombre
			}
		});
	},
	updateServi(servicio){
		return _database.zunpc.model.servicio.update({
			nombre: servicio.nombre,
			descripcion: servicio.descripcion,
			disponibilidad: servicio.disponibilidad
		},{
			where: {
				idServicio: servicio.idServicio
			}
		});
	},
	deleteServi(servicio){
		return _database.zunpc.model.servicio.update({
			disponibilidad: false
		},{
			where: {
				idServicio: servicio.idServicio
			}
		});
	}
};