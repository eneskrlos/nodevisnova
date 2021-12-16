const https = require('https');
const needle = require('needle');
const request = require('request');
const { exec } = require('child_process');

const axios = require('axios');
const qs = require('qs');
var HTMLParser = require('node-html-parser');
const Auth = require('../../utils/logforauth');
const Logs = require('../../utils/newlogs');
const axiosRetry = require('axios-retry');
const httpresponse = require('../../utils/httpresponse');
const { response } = require('express');







exports.compracontroller = {

	GetCompras(req,res){
		//var autorizado = verPermiso(req,112,res);
		const ident = req.user.user;
		let { body } = req;
		let { buscar } = body;
		try {
			
			_database.zunpc.repository.comprarepository.listCompra(buscar).then(response => {
				_useful.log('compracontroller.js').info('Listó las compras',req.user.user, JSON.stringify(response));
	
				return res.json(new httpresponse(200,"ok",response,""));
			}).catch(error => {
				_useful.log('compracontroller.js').error('No se pudo listar los servicios',ident,error);
				return res.json(new httpresponse(500,"No se pudo listar las compras",null,""));
			});
		} catch (error) {
			_useful.log('compracontroller.js').error('No se pudo listar las compras',ident,error);
			return res.json(new httpresponse(500,"No se ha podido listas las compras",null,""));
		}
		
	},
	GetComprasporid(req,res){
		const id = req.body.idCompra;
		_database.zunpc.repository.comprarepository.GetComprasporid(id).then(response => {
			_useful.log('compracontroller.js').info('Se obtubo la compra',req.user.user, JSON.stringify(response));
			return res.json(new httpresponse(200,"ok",response,""));
		}).catch(error => {
			_useful.log('compracontroller.js').error('No se ha podido obtener la compra','req.user.user',error);
			return res.json(new httpresponse(500,"No se ha podido obtener la compra",null,""));
		});
	},
	async adiconarCompra(req,res){
		let nick = req.user.user;
		let { body } = req;
		let { nombre, descripcion,precio, disponible } = body;
		let dis = disponible.toString();
		//verifico q estan todas los  atributos de compra.
		if ( !nombre || !descripcion || !precio || !dis  ) return res.json(new httpresponse(500,"Error al adicionar una compra: Compruebe que los campos esten llenos",null,""));
		try {
			//adiciono la compra
			let newcomp = await _database.zunpc.repository.comprarepository.addCompra(body);
			_useful.log('compracontroller.js').info('Se ha creado una nueva compra.', req.user.nick, JSON.stringify(newcomp));
			var listcompra = await _database.zunpc.repository.comprarepository.listCompra("");
			return res.json(new httpresponse(200,"ok",listcompra,""));
		}
		catch (error) {
			_useful.log('compracontroller.js').error('No se ha podido crear la compra',nick,error);
			return res.json(new httpresponse(500,"No se ha podido crear la compra",null,""));
		}
	},

	async EditarCompra(req,res){
		let nick = req.user.user;
		let { body } = req;
		let { idCompra, nombre, descripcion,precio, disponible } = body;
		let disp = disponible.toString();
		if ( !idCompra,!nombre || !precio || !descripcion || !disp  ) return res.json(new httpresponse(500,"Error al editar la compra: Compruebe que los campos esten llenos",null,""));
		try {
			let compra = _database.zunpc.repository.comprarepository.updateCompra(body);
			_useful.log('compracontroller.js').info('Se ha editado el servicio',nick,JSON.stringify(compra));
			var listcompra = await _database.zunpc.repository.comprarepository.listCompra("");
			return res.json(new httpresponse(200,"Se ha editado correctamente",listcompra,""));
		} catch (error) {
			_useful.log('compracontroller.js').error('No se ha podido editar la compra',nick,error);
			return res.json(new httpresponse(500,"No se ha podido editar la compra",null,""));
		}
	},

	async eliminarCompra (req, res) {
		let nick = req.user.user;
		let { id } = req.params;
		try {
			let compra = await  _database.zunpc.repository.comprarepository.GetComprasporid(id);
			if(!compra){
				return res.json(new httpresponse(500,"Ha ocurrido un error al intentar eliminar la compra:Compra no encontrado.",null,""));
			}
			await _database.zunpc.repository.comprarepository.deleteCompra(compra);
			_useful.log('compracontroller.js').info('Se ha eliminado la compra',nick,JSON.stringify(id));
			var listcompra = _database.zunpc.repository.comprarepository.listCompra("");
			return res.json(new httpresponse(200,"Se ha eliminado la compra",listcompra,""));
		}
		catch (error) {
			_useful.log('compracontroller.js').error('Ha ocurrido un error al intentar eliminar la compra',nick,error);
			return res.json(new httpresponse(500,"Ha ocurrido un error al intentar eliminar la compra.",null,""));
		}
	},
};
