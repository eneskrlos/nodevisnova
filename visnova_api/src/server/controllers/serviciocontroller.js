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







exports.serviciocontroller = {

	optenerServicios(req,res){
		const ident = req.user.user;
		let { body } = req;
		let { buscar } = body;
		try {
			
			_database.zunpc.repository.serviciorepository.listServ(buscar).then(response => {
				_useful.log('serviciocontroller.js').info('Listó los servicios',req.user.user, JSON.stringify(response));
	
				return res.json(new httpresponse(200,"ok",response,""));
			}).catch(error => {
				_useful.log('serviciocontroller.js').error('No se pudo listar los servicios',ident,error);
				return res.json(new httpresponse(500,"No se pudo listar los servicios",null,""));
			});
		} catch (error) {
			_useful.log('serviciocontroller.js').error('No se pudo listar los servicios',ident,error);
			return res.json(new httpresponse(500,"No se ha podido listar los servicio",null,""));
		}
		
	},
	obtenerServicio(req,res){
		const id = req.body.idServicio;
		_database.zunpc.repository.serviciorepository.GetServicio(id).then(response => {
			_useful.log('serviciocontroller.js').info('Se obtubo el servicios',req.user.user, JSON.stringify(response));
			return res.json(new httpresponse(200,"ok",response,""));
		}).catch(error => {
			_useful.log('serviciocontroller.js').error('No se ha podido obtener el servicio','req.user.user',error);
			return res.json(new httpresponse(500,"No se ha podido obtener el servicio",null,""));
		});
	},
	async adiconarServicio(req,res){
		let nick = req.user.user;
		let { body } = req;
		let { nombre, descripcion, disponibilidad } = body;
		let dis = disponibilidad.toString();
		//verifico q estan todas los  atributos de servicio.
		if ( !nombre || !descripcion || !dis  ) return res.json(new httpresponse(500,"Error al adicionar un servicio: Compruebe que los campos esten llenos",null,""));
		try {
			//Busco si existe un servicio en base datos 
			let dbServi = await _database.zunpc.repository.serviciorepository.getByNombreServi(nombre);
			if ( dbServi && dbServi.nombre === nombre ) return res.json(new httpresponse(500,"Error al adicionar un servicio: El servicio ya existe.",null,""));

			let newserv = await _database.zunpc.repository.serviciorepository.addServicio(body);
			_useful.log('serviciocontroller.js').info('Se ha creado un servicio nuevo.', req.user.nick, JSON.stringify(newserv));
			var listservi = await _database.zunpc.repository.serviciorepository.listServ("");
			return res.json(new httpresponse(200,"ok",listservi,""));
		}
		catch (error) {
			_useful.log('serviciocontroller.js').error('No se ha podido crear el servicio',nick,error);
			return res.json(new httpresponse(500,"No se ha podido crear el servicio",null,""));
		}
	},

	async editarServicio(req,res){
		let nick = req.user.user;
		let { body } = req;
		let { idServicio, nombre, descripcion, disponibilidad } = body;
		let disp = disponibilidad.toString();
		if ( !idServicio,!nombre || !descripcion || !disp  ) return res.json(new httpresponse(500,"Error al editar un servicio: Compruebe que los campos esten llenos",null,""));
		try {
			let servi = await _database.zunpc.repository.serviciorepository.updateServi(body);
			_useful.log('serviciocontroller.js').info('Se ha editado el servicio',nick,JSON.stringify(servi));
			var listservi = await _database.zunpc.repository.serviciorepository.listServ("");
			return res.json(new httpresponse(200,"Se ha editado correctamente",listservi,""));
		} catch (error) {
			_useful.log('serviciocontroller.js').error('No se ha podido editar el servicio',nick,error);
			return res.json(new httpresponse(500,"No se ha podido editar el servicio",null,""));
		}
	},

	async eliminarServicio (req, res) {
		let nick = req.user.user;
		let { id } = req.params;
		try {
			let servicio = await  _database.zunpc.repository.serviciorepository.GetServicio(id);
			if(!servicio){
				return res.json(new httpresponse(500,"Ha ocurrido un error al intentar eliminar servicio:Servicio no encontrado.",null,""));
			}
			await _database.zunpc.repository.serviciorepository.deleteServi(servicio);
			_useful.log('serviciocontroller.js').info('Se ha eliminado el servicio',nick,JSON.stringify(id));
			var listservi = await _database.zunpc.repository.serviciorepository.listServ("");
			return res.json(new httpresponse(200,"Se ha eliminado el servicio",listservi,""));
		}
		catch (error) {
			_useful.log('serviciocontroller.js').error('Ha ocurrido un error al intentar eliminar servicio',nick,error);
			return res.json(new httpresponse(500,"Ha ocurrido un error al intentar eliminar servicio.",null,""));
		}
	},

	/* buscarServicio(req,res){
		let { buscar } = body;
		try {
			
		} catch (error) {
			_useful.log('serviciocontroller.js').error('Ha ocurrido un error al intentar buscar servicio',nick,error);
			return res.json(new httpresponse(500,"Ha ocurrido un error al intentar buscar servicio.",null,""));
		}
	} */

};
