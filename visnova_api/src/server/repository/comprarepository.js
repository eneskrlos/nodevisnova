const { Op } = require("sequelize");
module.exports = {

	listCompra (buscar) {
		return _database.zunpc.model.compra.findAll({
			attributes: ['idCompra', 'nombre', 'descripcion', 'precio','disponible'],
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
	GetComprasporid(idCompra){
		return _database.zunpc.model.compra.findOne({
			where: {
				idCompra
			}
		});
	},
	addCompra(newcompra){
		return _database.zunpc.model.compra.create(newcompra);
	},
	getByNombreCompra(nombre){
		return _database.zunpc.model.compra.findOne({
			where: {
				nombre
			}
		});
	},
	updateCompra(compra){
		return _database.zunpc.model.compra.update({
			nombre: compra.nombre,
			descripcion: compra.descripcion,
			precio: compra.precio,
			disponible: compra.disponible
		},{
			where: {
				idCompra: compra.idCompra
			}
		});
	},
	deleteCompra(compra){
		return _database.zunpc.model.compra.update({
			disponible: false
		},{
			where: {
				idCompra: compra.idCompra
			}
		});
	}
};