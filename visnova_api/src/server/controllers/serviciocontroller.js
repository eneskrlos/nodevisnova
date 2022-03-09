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
const pag = require('../../utils/paginate');

exports.serviciocontroller = {

	async optenerServicios(req,res){
		const ident = req.user.user;
		let { body } = req;
		let { buscar } = body;
		const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
		try {
			
			const lservi = await _database.zunpc.repository.serviciorepository.listServ(buscar);
			const servipaginado = await pag(lservi, lservi.length, page, limit);
			_useful.log('serviciocontroller.js').info('Listó los servicios',req.user.user, JSON.stringify(lservi));
			return res.json(new httpresponse(200,"ok",servipaginado,""));
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
		let { nombre, descripcion, disponibilidad, en_promosion } = body;
		
		//verifico q estan todas los  atributos de servicio.
		if ( !nombre || nombre == undefined || !descripcion || descripcion == undefined  ) return res.json(new httpresponse(500,"Error al adicionar un servicio: Compruebe que los campos esten llenos",null,""));
		try {
			//Busco si existe un servicio en base datos 
			let dbServi = await _database.zunpc.repository.serviciorepository.getByNombreServi(nombre);
			if ( dbServi && dbServi.nombre === nombre ) return res.json(new httpresponse(500,"Error al adicionar un servicio: El servicio ya existe.",null,""));
			let serv = {};
			serv.nombre = nombre;
			serv.descripcion = descripcion;
			serv.disponibilidad = (disponibilidad == undefined)? false : disponibilidad;
			serv.en_promosion = (en_promosion == undefined)? false : en_promosion;
			let newserv = await _database.zunpc.repository.serviciorepository.addServicio(serv);
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
		let { idServicio, nombre, descripcion, disponibilidad, en_promosion } = body;
		
		if ( !idServicio || idServicio == undefined || !nombre || nombre == undefined || !descripcion || descripcion == undefined   ) return res.json(new httpresponse(500,"Error al editar un servicio: Compruebe que los campos esten llenos",null,""));
		try {
			let serv = {};
			serv.idServicio = idServicio;
			serv.nombre = nombre;
			serv.descripcion = descripcion;
			serv.disponibilidad = (disponibilidad == undefined)? false : disponibilidad;
			serv.en_promosion = (en_promosion == undefined)? false : en_promosion;
			let servi = await _database.zunpc.repository.serviciorepository.updateServi(serv);
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
