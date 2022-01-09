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
		let { nombre, descripcion,precio, disponible, en_promosion } = body;
		//verifico q estan todas los  atributos de compra.
		if ( !nombre ||  nombre == undefined || !descripcion || descripcion == undefined || !precio || precio == undefined  ) return res.json(new httpresponse(500,"Error al adicionar una compra: Compruebe que los campos esten llenos",null,""));
		try {
			//adiciono la compra
			let compra = {};
			compra.nombre = nombre;
			compra.descripcion = descripcion;
			compra.precio = precio;
			compra.disponible = (disponible == undefined)? false: disponible;
			compra.en_promosion = (en_promosion == undefined)? false: en_promosion;

			let newcomp = await _database.zunpc.repository.comprarepository.addCompra(compra);
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
		let { idCompra, nombre, descripcion,precio, disponible, en_promosion } = body;
		if ( !idCompra || idCompra == undefined || !nombre || nombre == undefined || !descripcion || descripcion == undefined || !precio || precio == undefined   ) return res.json(new httpresponse(500,"Error al editar la compra: Compruebe que los campos esten llenos",null,""));
		try {
			let ecompra = {};
			ecompra.idCompra = idCompra;
			ecompra.nombre = nombre;
			ecompra.descripcion = descripcion;
			ecompra.precio = precio;
			ecompra.disponible = (disponible == undefined)? false: disponible;
			ecompra.en_promosion = (en_promosion == undefined)? false: en_promosion;
			let compra = await _database.zunpc.repository.comprarepository.updateCompra(ecompra);
			_useful.log('compracontroller.js').info('Se ha editado la compra',nick,JSON.stringify(compra));
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
